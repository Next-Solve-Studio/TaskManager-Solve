import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { getAuthorizedClientForUser } from "@/lib/googleCalendar";

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db } = getFirebaseAdmin();
        const ref = db.collection("scheduleEvents").doc(id);
        const snap = await ref.get();
        if (!snap.exists) {
            return NextResponse.json({ message: "Evento não encontrado." }, { status: 404 });
        }
        const data = snap.data();
        if (data.createdBy !== caller.uid) {
            return NextResponse.json({ message: "Só quem criou pode excluir este evento." }, { status: 403 });
        }

        let googleCancelled = true;
        let googleError = null;

        if (data.googleEventId) {
            const authClient = await getAuthorizedClientForUser(caller.uid);
            if (!authClient) {
                googleCancelled = false;
                googleError = "Sua conta do Google não está mais conectada.";
            } else {
                const calendar = google.calendar({ version: "v3", auth: authClient });
                try {
                    await calendar.events.delete({
                        calendarId: "primary",
                        eventId: data.googleEventId,
                        sendUpdates: "all",
                    });
                } catch (err) {
                    googleCancelled = false;
                    googleError = err?.errors?.[0]?.message || err.message;
                    console.error("Falha ao cancelar evento no Google Calendar:", err);
                }
            }
        }

        await ref.delete();
        return NextResponse.json({ ok: true, googleCancelled, googleError });
    } catch (error) {
        console.error("Erro ao excluir reunião:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}