import { NextResponse } from "next/server";
import admin from "firebase-admin";

function getFirebaseAdmin() {
    if (!admin.apps.length) {
        const key = process.env.FIREBASE_PRIVATE_KEY;
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: key
                    ? key.replaceAll(String.raw`\n`, "\n").replaceAll('"', "")
                    : undefined,
            }),
        });
    }
    return admin.auth();
}

const SESSION_COOKIE = "__session";
const THIRTY_DAYS = 30 * 24 * 60 * 60;

export async function POST(request) {
    try {
        const { token } = await request.json();

        if (!token || typeof token !== "string") {
            return NextResponse.json({ error: "Token inválido." }, { status: 400 });
        }

        // Verifica o token com Firebase Admin antes de setar o cookie
        const auth = getFirebaseAdmin();
        await auth.verifyIdToken(token);

        const response = NextResponse.json({ ok: true });
        response.cookies.set(SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: THIRTY_DAYS,
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
}