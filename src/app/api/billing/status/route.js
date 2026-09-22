import { NextResponse } from "next/server";
import { getAuthorizedAppKey } from "@/lib/billingAuth";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

export async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token)
            return NextResponse.json(
                { error: "Não autorizado." },
                { status: 401 },
            );
        
        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `billing-status:${ip}`, windowSeconds: 60, max: 20 });
        if (!allowed) return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json(
                { error: "Token inválido." },
                { status: 401 },
            );
        }

        const { appKey, error, status } = await getAuthorizedAppKey(caller.uid);
        if (error) return NextResponse.json({ error }, { status });

        const response = await fetchWithTimeout(
            `${process.env.LICENSE_API_URL}/api/billing/status`,
            { headers: { "x-app-key": appKey } },
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}
