import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { ROLES } from "@/lib/roles";

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];

        if (!token) {
            return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
        }

        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `del-emp:${ip}`, windowSeconds: 300, max: 3 });
        if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });


        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db, auth } = getFirebaseAdmin();
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
        }

        if (userId === caller.uid) {
            return NextResponse.json({ message: "Você não pode excluir a si mesmo." }, { status: 400 });
        }

        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();

        if (!callerData || ![ROLES.MASTER, ROLES.ADMIN].includes(callerData.role)) {
            return NextResponse.json({ message: "Sem permissão para excluir usuários." }, { status: 403 });
        }

        const targetDoc = await db.collection("users").doc(userId).get();
        const targetData = targetDoc.data();

        if (!targetData || targetData.companyId !== callerData.companyId) {
            return NextResponse.json({ message: "Usuário não encontrado nesta empresa." }, { status: 404 });
        }

        if (targetData.role === ROLES.MASTER) {
            return NextResponse.json({ message: "Não é possível excluir o usuário master." }, { status: 403 });
        }

        await db.collection("users").doc(userId).delete();

        try {
            await auth.deleteUser(userId);
        } catch (err) {
            if (err.code !== "auth/user-not-found") throw err;
        }

        return NextResponse.json({ message: "Usuário excluído com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao excluir funcionário:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}