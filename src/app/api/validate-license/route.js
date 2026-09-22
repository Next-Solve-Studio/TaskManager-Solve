import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { getAuthorizedAppKey } from "@/lib/billingAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request) {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit({ key: `validate-license:${ip}`, windowSeconds: 60, max: 30 });
    if (!allowed) return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });

    let caller;
    try {
        caller = await verifyFirebaseToken(token);
    } catch {
        return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    // Deriva o appKey do próprio usuário autenticado — nunca confia no cliente
    const { appKey, error, status } = await getAuthorizedAppKey(caller.uid);
    if (error) return NextResponse.json({ error }, { status });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);

    try {
        const response = await fetch(
            `${process.env.LICENSE_API_URL}/api/license/validate/${appKey}`,
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError")
            return NextResponse.json({ error: "Serviço indisponível." }, { status: 503 });
        return NextResponse.json({ error: "Erro ao validar licença." }, { status: 500 });
    }
}