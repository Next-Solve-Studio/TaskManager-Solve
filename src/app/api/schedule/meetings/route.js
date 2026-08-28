import { google } from "googleapis";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { getAuthorizedClientForUser } from "@/lib/googleCalendar";

const TIMEZONE = "America/Sao_Paulo";

function buildDateTime(dateStr, timeStr) {
    return `${dateStr}T${timeStr}:00`;
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const body = await request.json();
        const { id, weekKey, dayKey, date, title, description, start, end, cat, peopleIds } = body;

        if (!weekKey || !dayKey || !date || !title || !start || !end || !cat) {
            return NextResponse.json({ message: "Dados incompletos." }, { status: 400 });
        }
        if (start >= end) {
            return NextResponse.json({ message: "O horário final precisa ser depois do início." }, { status: 400 });
        }

        const { db } = getFirebaseAdmin();
        const userDoc = await db.collection("users").doc(caller.uid).get();
        const companyId = userDoc.data()?.companyId;
        if (!companyId) {
            return NextResponse.json({ message: "Usuário não vinculado a uma empresa." }, { status: 400 });
        }

        let existingRef = null;
        let existingData = null;
        if (id) {
            existingRef = db.collection("scheduleEvents").doc(id);
            const existingSnap = await existingRef.get();
            if (!existingSnap.exists) {
                return NextResponse.json({ message: "Evento não encontrado." }, { status: 404 });
            }
            existingData = existingSnap.data();
            if (existingData.createdBy !== caller.uid) {
                return NextResponse.json({ message: "Só quem criou pode editar este evento." }, { status: 403 });
            }
        }

        const people = Array.from(new Set([...(peopleIds || []), caller.uid]));

        let meetLink = null;
        let googleEventId = null;

        if (cat === "reuniao") {
            meetLink = existingData?.meetLink || null;
            googleEventId = existingData?.googleEventId || null;

            const authClient = await getAuthorizedClientForUser(caller.uid);
            if (!authClient) {
                return NextResponse.json(
                    { message: "Conecte sua conta do Google Calendar antes de criar uma reunião.", code: "GOOGLE_NOT_CONNECTED" },
                    { status: 409 },
                );
            }

            const peopleSnaps = await Promise.all(
                people.filter((pid) => pid !== caller.uid).map((pid) => db.collection("users").doc(pid).get()),
            );
            const attendees = peopleSnaps.map((s) => s.data()?.email).filter(Boolean).map((email) => ({ email }));

            const calendar = google.calendar({ version: "v3", auth: authClient });
            const eventBody = {
                summary: title,
                description: description || "",
                start: { dateTime: buildDateTime(date, start), timeZone: TIMEZONE },
                end: { dateTime: buildDateTime(date, end), timeZone: TIMEZONE },
                attendees,
            };

            if (googleEventId) {
                const { data } = await calendar.events.patch({
                    calendarId: "primary",
                    eventId: googleEventId,
                    sendUpdates: "all",
                    requestBody: eventBody,
                });
                meetLink = data.hangoutLink || meetLink;
            } else {
                const { data } = await calendar.events.insert({
                    calendarId: "primary",
                    conferenceDataVersion: 1,
                    sendUpdates: "all",
                    requestBody: {
                        ...eventBody,
                        conferenceData: {
                            createRequest: { requestId: uuidv4(), conferenceSolutionKey: { type: "hangoutsMeet" } },
                        },
                    },
                });
                meetLink = data.hangoutLink || null;
                googleEventId = data.id;
            }
        }

        const payload = {
            companyId,
            weekKey,
            dayKey,
            date,
            title,
            description: description || "",
            cat,
            start,
            end,
            people,
            createdBy: existingData?.createdBy || caller.uid,
            meetLink,
            googleEventId,
            updatedAt: new Date(),
        };

        let docId = id;
        if (existingRef) {
            await existingRef.set(payload, { merge: true });
        } else {
            payload.createdAt = new Date();
            const newRef = await db.collection("scheduleEvents").add(payload);
            docId = newRef.id;
        }

        return NextResponse.json({ id: docId, ...payload });
    } catch (error) {
        console.error("Erro ao salvar reunião:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}