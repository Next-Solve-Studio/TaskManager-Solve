import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];

        if (!token) {
            return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
        }

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db, auth } = getFirebaseAdmin();
        const { name, email, password, companyId, role, customData } = await request.json();

        if (!email || !companyId || !password) {
            return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
        }

        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();

        if (!callerData || callerData.companyId !== companyId) {
            return NextResponse.json({ message: "Sem permissão para esta empresa." }, { status: 403 });
        }

        if (callerData.role !== "master") {
            const permsDoc = await db.collection("role_permissions").doc(companyId).get()
            const allowedRoles = permsDoc.exists ?
                (permsDoc.data().permissions?.canCreateUsers ?? []) : []
            if (!allowedRoles.includes(callerData.role)) {
                return NextResponse.json({ message: "Sem permissão para criar usuários." }, { status: 403 });
            }
            
        }

        const companyDoc = await db.collection("companies").doc(companyId).get();
        const companyData = companyDoc.data();

        if (!companyDoc.exists || companyData.status !== "active") {
            return NextResponse.json(
                { message: "Licença inativa ou expirada. Regularize o plano para adicionar usuários." },
                { status: 403 }
            );
        }

        // Ajuste os limites reais de cada plano aqui
        const PLAN_USER_LIMITS = {
            FREE: 3,
            BASIC: 10,
            PRO: 30,
            ENTERPRISE: Infinity,
        };
        const userLimit = PLAN_USER_LIMITS[companyData.plan] ?? PLAN_USER_LIMITS.FREE;

        const existingUsersSnap = await db
            .collection("users")
            .where("companyId", "==", companyId)
            .get();

        if (existingUsersSnap.size >= userLimit) {
            return NextResponse.json(
                { message: `Limite de usuários do plano ${companyData.plan} atingido (${userLimit}).` },
                { status: 403 }
            );
        }

        const allowedRoles = ["administrador", "desenvolvedor", "lider_de_projetos"];
        const safeRole = allowedRoles.includes(role) ? role : "desenvolvedor";

        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name?.trim(),
        });

        await db.collection("users").doc(userRecord.uid).set({
            name: name.trim(),
            email,
            role: safeRole,
            companyId,
            customData: customData || {},
            createdAt: new Date(),
            lastLoginAt: null,
            lastSeenAt: null,
            authMethod: "email",
        });

        return NextResponse.json(
            { message: "Usuário registrado com sucesso.", uid: userRecord.uid },
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro na API de registro:", error);

        if (error.code?.startsWith("auth/")) {
            const messages = {
                "auth/email-already-exists": "Este e-mail já está em uso.",
                "auth/invalid-password": "A senha deve ter pelo menos 6 caracteres.",
            };
            return NextResponse.json(
                { message: messages[error.code] ?? error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}