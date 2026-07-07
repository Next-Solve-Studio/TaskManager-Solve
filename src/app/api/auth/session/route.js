import admin from "firebase-admin";
import { NextResponse } from "next/server";

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
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const FOURTEEN_DAYS_S  = 14 * 24 * 60 * 60;

export async function POST(request) {
    try {
        const { token } = await request.json();

        if (!token || typeof token !== "string") {
            return NextResponse.json(
                { error: "Token inválido." },
                { status: 400 },
            );
        }

        const auth = getFirebaseAdmin();

        // Verifica o token antes
        const sessionCookie = await auth.createSessionCookie(token, {
            expiresIn: FOURTEEN_DAYS_MS,
        });

        const response = NextResponse.json({ ok: true });
        response.cookies.set(SESSION_COOKIE, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: FOURTEEN_DAYS_S,
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: "Token inválido ou expirado." },
            { status: 401 },
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
}
