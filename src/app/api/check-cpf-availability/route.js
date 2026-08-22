import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const cpfCnpj = searchParams.get("cpfCnpj");
        const plan = searchParams.get("plan") ?? "FREE";

        if (!cpfCnpj) {
            return NextResponse.json({ error: "CPF/CNPJ obrigatório." }, { status: 400 });
        }

        if (!process.env.REGISTRATION_SECRET) {
            console.error("[check-cpf-availability] REGISTRATION_SECRET não configurado.");
            return NextResponse.json({ error: "Serviço indisponível." }, { status: 503 });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8_000);

        try {
            const url = `${process.env.LICENSE_API_URL}/api/public/check-availability?cpfCnpj=${encodeURIComponent(cpfCnpj)}&plan=${encodeURIComponent(plan)}`;
            const response = await fetch(url, {
                headers: { "x-registration-secret": process.env.REGISTRATION_SECRET },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === "AbortError") {
                return NextResponse.json({ error: "Serviço indisponível." }, { status: 503 });
            }
            throw fetchError;
        }
    } catch (error) {
        console.error("[check-cpf-availability] Erro:", error);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}