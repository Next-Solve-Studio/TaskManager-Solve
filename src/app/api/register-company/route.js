import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(
            `${process.env.LICENSE_API_URL}/api/public/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-registration-secret": process.env.REGISTRATION_SECRET,
                },
                body: JSON.stringify(body),
            },
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("[register-company] Erro:", error);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}
