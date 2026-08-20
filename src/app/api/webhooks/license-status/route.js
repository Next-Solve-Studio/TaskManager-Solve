import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const ALLOWED_STATUSES = ["active", "inactive"];
const COMPANY_ID_REGEX = /^[A-Za-z0-9_-]+$/;

// Limite simples em memória — não é distribuído entre instâncias serverless,
// mas já corta tentativas repetidas dentro da mesma instância "morna".
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

function isRateLimited(key) {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(key, { windowStart: now, count: 1 });
        return false;
    }

    entry.count += 1;
    return entry.count > RATE_LIMIT_MAX;
}

function isValidSecret(received, expected) {
    if (!received || !expected) return false;
    const receivedBuf = Buffer.from(received);
    const expectedBuf = Buffer.from(expected);
    return receivedBuf.length === expectedBuf.length && timingSafeEqual(receivedBuf, expectedBuf);
}

export async function POST(request) {
    try {
        const ip = request.headers.get("x-forwarded-for") ?? "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json({ message: "Muitas requisições." }, { status: 429 });
        }

        const secret = request.headers.get("x-webhook-secret");
        if (!isValidSecret(secret, process.env.LICENSE_WEBHOOK_SECRET)) {
            return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
        }

        const { companyId, status, licenseExpiresAt, plan } = await request.json();

        if (
            typeof companyId !== "string" ||
            !COMPANY_ID_REGEX.test(companyId) ||
            !ALLOWED_STATUSES.includes(status)
        ) {
            return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
        }

        const { db } = getFirebaseAdmin();
        const companyRef = db.collection("companies").doc(companyId);
        const companyDoc = await companyRef.get();

        if (!companyDoc.exists) {
            return NextResponse.json({ message: "Empresa não encontrada." }, { status: 404 });
        }

        const updates = { status };
        if (licenseExpiresAt) updates.licenseExpiresAt = new Date(licenseExpiresAt);
        if (plan) updates.plan = plan;

        await companyRef.update(updates);

        console.log(`[webhook] Empresa ${companyId} sincronizada: status=${status}`);

        return NextResponse.json({ message: "Status sincronizado." }, { status: 200 });
    } catch (error) {
        console.error("Erro no webhook de status de licença:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}