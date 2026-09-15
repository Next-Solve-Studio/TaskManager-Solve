import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";

const APP_KEY_REGEX = /^ak_[a-f0-9]{32}$/;

export async function GET(request) {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    try {
        await verifyFirebaseToken(token);
    } catch {
        return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const appKey = searchParams.get("appKey");

    if (!appKey || !APP_KEY_REGEX.test(appKey)) {
        return NextResponse.json({ error: "appKey inválido." }, { status: 400 });
    }

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