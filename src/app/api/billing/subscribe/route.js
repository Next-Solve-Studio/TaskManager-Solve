import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { getAuthorizedAppKey } from "@/lib/billingAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `billing-sub:${ip}`, windowSeconds: 300, max: 3 });
        if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ error: "Token inválido." }, { status: 401 });
        }

        const { appKey, error, status } = await getAuthorizedAppKey(caller.uid);
        if (error) return NextResponse.json({ error }, { status });

        const { appKey: _clientAppKey, ...subscribeData } = await request.json();

        const response = await fetch(`${process.env.LICENSE_API_URL}/api/billing/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-app-key": appKey },
            body: JSON.stringify(subscribeData),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `billing-unsub:${ip}`, windowSeconds: 300, max: 5 });
        if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });
        
        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ error: "Token inválido." }, { status: 401 });
        }

        const { appKey, error, status } = await getAuthorizedAppKey(caller.uid);
        if (error) return NextResponse.json({ error }, { status });

        const response = await fetch(`${process.env.LICENSE_API_URL}/api/billing/subscribe`, {
            method: "DELETE",
            headers: { "x-app-key": appKey },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}