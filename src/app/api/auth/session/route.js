import { NextResponse } from "next/server";

const SESSION_COOKIE = "__session";
const THIRTY_DAYS = 30 * 24 * 60 * 60;

export async function POST(request) {
    try {
        const { token } = await request.json();

        if (!token || typeof token !== "string" || token.length < 100) {
            return NextResponse.json({ error: "Token inválido." }, { status: 400 });
        }

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
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
}