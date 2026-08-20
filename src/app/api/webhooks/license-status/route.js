import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const ALLOWED_STATUSES = ["active", "inactive"];

export async function POST(request) {
    try {
        const secret = request.headers.get("x-webhook-secret");
        if (!secret || secret !== process.env.LICENSE_WEBHOOK_SECRET) {
            return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
        }

        const { companyId, status, licenseExpiresAt, plan } = await request.json();

        if (!companyId || !ALLOWED_STATUSES.includes(status)) {
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

        return NextResponse.json({ message: "Status sincronizado." }, { status: 200 });
    } catch (error) {
        console.error("Erro no webhook de status de licença:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}