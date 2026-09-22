import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { disconnectGoogle } from "@/lib/googleCalendar";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit({ key: `google-disconnect:${ip}`, windowSeconds: 300, max: 5 });
    if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });

    let caller;
    try {
        caller = await verifyFirebaseToken(token);
    } catch {
        return NextResponse.json({ message: "Token inválido." }, { status: 401 });
    }

    await disconnectGoogle(caller.uid);
    return NextResponse.json({ ok: true });
}