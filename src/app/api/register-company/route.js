import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit({ key: `reg-company:${ip}`, windowSeconds: 3600, max: 5 });
    if (!allowed) return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });
    
    try {
        const body = await request.json();
        const { companyId, companyName, responsibleName, email, cpfCnpj } = body;

        if (!companyId || !companyName || !responsibleName || !email || !cpfCnpj) {
            return NextResponse.json(
                { error: "Campos obrigatórios faltando." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
        }

        if (!process.env.REGISTRATION_SECRET) {
            console.error("[register-company] REGISTRATION_SECRET não configurado.");
            return NextResponse.json({ error: "Serviço indisponível." }, { status: 503 });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10_000);

        try {
            const response = await fetch(
                `${process.env.LICENSE_API_URL}/api/public/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-registration-secret": process.env.REGISTRATION_SECRET,
                    },
                    body: JSON.stringify(body),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });

        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === "AbortError") {
                return NextResponse.json(
                    { error: "Serviço indisponível. Tente novamente." },
                    { status: 503 }
                );
            }
            throw fetchError;
        }
    } catch (error) {
        console.error("[register-company] Erro:", error);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}