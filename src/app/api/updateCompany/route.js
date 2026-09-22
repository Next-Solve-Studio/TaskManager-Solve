import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { PERMISSIONS, ROLES } from "@/lib/roles";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const DEFAULT_SETTINGS_ROLES = PERMISSIONS.canManageSystemSettings.filter((r) => r !== ROLES.MASTER);
const ALLOWED_FIELDS = ["name", "cnpj", "endereco"];

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `update-company:${ip}`, windowSeconds: 300, max: 10 });
        if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db } = getFirebaseAdmin();
        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();
        if (!callerData?.companyId) {
            return NextResponse.json({ message: "Usuário não vinculado a uma empresa." }, { status: 403 });
        }

        if (callerData.role !== ROLES.MASTER) {
            const permsDoc = await db.collection("role_permissions").doc(callerData.companyId).get();
            const allowedRoles = permsDoc.exists
                ? (permsDoc.data().permissions?.canManageSystemSettings ?? DEFAULT_SETTINGS_ROLES)
                : DEFAULT_SETTINGS_ROLES;
            if (!allowedRoles.includes(callerData.role)) {
                return NextResponse.json({ message: "Sem permissão para editar dados da empresa." }, { status: 403 });
            }
        }

        const body = await request.json();
        const payload = {};
        for (const field of ALLOWED_FIELDS) {
            if (body[field] !== undefined) payload[field] = body[field];
        }
        if (Object.keys(payload).length === 0) {
            return NextResponse.json({ message: "Nada para atualizar." }, { status: 400 });
        }
        payload.updatedAt = new Date();

        await db.collection("companies").doc(callerData.companyId).update(payload);

        return NextResponse.json({ message: "Empresa atualizada com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar empresa:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}