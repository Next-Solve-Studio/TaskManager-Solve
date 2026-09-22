import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit({ key: `google-status:${ip}`, windowSeconds: 60, max: 30 });
    if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });

    let caller;
    try {
        caller = await verifyFirebaseToken(token);
    } catch {
        return NextResponse.json({ message: "Token inválido." }, { status: 401 });
    }

    const { db } = getFirebaseAdmin();
    const doc = await db.collection("google_tokens").doc(caller.uid).get();

    if (!doc.exists) return NextResponse.json({ connected: false });
    return NextResponse.json({ connected: true, email: doc.data().googleEmail || null });
}