import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const SESSION_COOKIE = "__session";
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const FOURTEEN_DAYS_S  = 14 * 24 * 60 * 60;

export async function POST(request) {
    try {
        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `session-create:${ip}`, windowSeconds: 60, max: 10 });
        if (!allowed) return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });

        const { token } = await request.json();
        if (!token || typeof token !== "string" || token.length < 100) {
            return NextResponse.json({ error: "Token inválido." }, { status: 400 });
        }

        const { auth } = getFirebaseAdmin();
        const sessionCookie = await auth.createSessionCookie(token, { expiresIn: FOURTEEN_DAYS_MS });

        const response = NextResponse.json({ ok: true });
        response.cookies.set(SESSION_COOKIE, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: FOURTEEN_DAYS_S,
            path: "/",
        });
        return response;
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
}