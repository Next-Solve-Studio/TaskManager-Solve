import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { userDetailsSchema } from "@/utils/userDetailsSchema";
import { ROLES } from "@/lib/roles";

const ALLOWED_ROLES = [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.PROJECT_LEAD];

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `update-emp:${ip}`, windowSeconds: 60, max: 20 });
        if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db } = getFirebaseAdmin();
        const { userId, role, cpf, endereco, customData } = await request.json();

        if (!userId || !role) {
            return NextResponse.json({ message: "Dados incompletos." }, { status: 400 });
        }
        if (!ALLOWED_ROLES.includes(role)) {
            return NextResponse.json({ message: "Cargo inválido." }, { status: 400 });
        }

        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();
        if (!callerData?.companyId) {
            return NextResponse.json({ message: "Usuário não vinculado a uma empresa." }, { status: 403 });
        }

        if (callerData.role !== ROLES.MASTER) {
            const permsDoc = await db.collection("role_permissions").doc(callerData.companyId).get();
            const allowedRoles = permsDoc.exists ? (permsDoc.data().permissions?.canManageUsers ?? []) : [];
            if (!allowedRoles.includes(callerData.role)) {
                return NextResponse.json({ message: "Sem permissão para gerenciar usuários." }, { status: 403 });
            }
        }

        if (userId === caller.uid && role !== callerData.role) {
            return NextResponse.json({ message: "Você não pode alterar seu próprio cargo." }, { status: 400 });
        }

        const targetDoc = await db.collection("users").doc(userId).get();
        const targetData = targetDoc.data();
        if (!targetData || targetData.companyId !== callerData.companyId) {
            return NextResponse.json({ message: "Usuário não encontrado nesta empresa." }, { status: 404 });
        }

        if (targetData.role === ROLES.MASTER) {
            return NextResponse.json({ message: "Não é possível alterar o cargo do usuário master." }, { status: 403 });
        }

        let details;
        try {
            details = await userDetailsSchema.validate({ cpf, endereco, customData }, { stripUnknown: true });
        } catch (err) {
            return NextResponse.json({ message: err.message }, { status: 400 });
        }

        await db.collection("users").doc(userId).update({
            role,
            ...details,
            updatedAt: new Date(),
        });

        return NextResponse.json({ message: "Usuário atualizado com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}