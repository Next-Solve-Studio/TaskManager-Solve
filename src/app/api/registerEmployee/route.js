import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { createRemoteJWKSet, jwtVerify } from "jose";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const JWKS = createRemoteJWKSet(
    new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function verifyFirebaseToken(token) {
    const { payload } = await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
    });
    return { uid: payload.sub };
}

const getPrivateKey = () => {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    if (!key) return undefined;
    return key.replaceAll(String.raw`\n`, "\n").replaceAll('"', "");
};

function getFirebaseAdmin() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: getPrivateKey(),
            }),
        });
    }
    return {
        db: admin.firestore(),
        auth: admin.auth(),
    };
}

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
        const { name, email, password, companyId, role } = await request.json();

        if (!email || !companyId || !password) {
            return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
        }

        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();

        if (!callerData || callerData.companyId !== companyId) {
            return NextResponse.json({ message: "Sem permissão para esta empresa." }, { status: 403 });
        }

        if (callerData.role !== "master") {
            return NextResponse.json({ message: "Apenas o master pode criar usuários." }, { status: 403 });
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