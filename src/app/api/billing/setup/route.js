import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const JWKS = createRemoteJWKSet(new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
));

async function verifyToken(token) {
    const { payload } = await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
    });
    return payload;
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

        try { await verifyToken(token); } catch {
            return NextResponse.json({ error: "Token inválido." }, { status: 401 });
        }

        const { appKey, ...customerData } = await request.json();
        if (!appKey) return NextResponse.json({ error: "App key obrigatória." }, { status: 400 });

        const response = await fetch(`${process.env.LICENSE_API_URL}/api/billing/customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-app-key": appKey },
            body: JSON.stringify(customerData),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}