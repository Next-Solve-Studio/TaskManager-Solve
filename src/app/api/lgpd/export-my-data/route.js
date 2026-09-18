import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];

        if (!token) {
            return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
        }

        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `lgpd-export:${ip}`, windowSeconds: 300, max: 3 });
        if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });


        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db } = getFirebaseAdmin();

        const userDoc = await db.collection("users").doc(caller.uid).get();
        if (!userDoc.exists) {
            return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
        }
        const userData = userDoc.data();

        const [activitySnap, schedulesSnap] = await Promise.all([
            db.collection("activity_logs").where("userId", "==", caller.uid).get(),
            db.collection("scheduleEvents").where("people", "array-contains", caller.uid).get(),
        ]);

        return NextResponse.json({
            exportedAt: new Date().toISOString(),
            perfil: { id: userDoc.id, ...userData },
            atividades: activitySnap.docs.map((d) => ({ id: d.id, ...d.data() })),
            agendas: schedulesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        });
    } catch (error) {
        console.error("Erro ao exportar dados:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}