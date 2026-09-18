import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { getAuthorizedAppKey } from "@/lib/billingAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit({ key: `billing-tok:${ip}`, windowSeconds: 300, max: 3 });
    if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });


    let caller;
    try {
        caller = await verifyFirebaseToken(token);
    } catch {
        return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const { appKey, error, status } = await getAuthorizedAppKey(caller.uid);
    if (error) return NextResponse.json({ error }, { status });

    // Recebe os dados do cartão — NUNCA loga o body
    const body = await request.json();

    const response = await fetch(`${process.env.LICENSE_API_URL}/api/billing/tokenize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-app-key": appKey },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    // Retorna APENAS o token — nunca retorna os dados originais do cartão
    if (!response.ok) return NextResponse.json({ error: data.error || "Erro ao tokenizar." }, { status: response.status });

    return NextResponse.json({
        creditCardToken: data.creditCardToken,
        creditCardBrand: data.creditCardBrand,
        creditCardNumber: data.creditCardNumber,
    });
}