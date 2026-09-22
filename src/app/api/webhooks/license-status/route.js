import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const ALLOWED_STATUSES = ["active", "inactive"];
const COMPANY_ID_REGEX = /^[A-Za-z0-9_-]+$/;

function isValidSecret(received, expected) {
    if (!received || !expected) return false;
    const receivedBuf = Buffer.from(received);
    const expectedBuf = Buffer.from(expected);
    return receivedBuf.length === expectedBuf.length && timingSafeEqual(receivedBuf, expectedBuf);
}

export async function POST(request) {
    try {
        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `webhook-license:${ip}`, windowSeconds: 60, max: 20 });
        if (!allowed) return NextResponse.json({ message: "Muitas requisições." }, { status: 429 });

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