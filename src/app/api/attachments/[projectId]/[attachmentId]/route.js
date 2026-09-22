import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "project-attachments";

async function getCallerCompanyId(uid) {
    const { db } = getFirebaseAdmin();
    const callerDoc = await db.collection("users").doc(uid).get();
    return callerDoc.data()?.companyId || null;
}

// GET → gera signed URL para download
export async function GET(request) {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit({ key: `attachments-dl:${ip}`, windowSeconds: 60, max: 30 });
    if (!allowed) return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
    try {
        const token = request.headers.get("authorization")?.split("Bearer ")[1];
        if (!token)
            return NextResponse.json(
                { error: "Não autorizado." },
                { status: 401 },
            );

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json(
                { error: "Token inválido." },
                { status: 401 },
            );
        }

        const storagePath = request.nextUrl.searchParams.get("path");
        if (!storagePath || storagePath.includes(".."))
            return NextResponse.json(
                { error: "Path inválido." },
                { status: 400 },
            );

        const companyId = await getCallerCompanyId(caller.uid);
        if (!companyId || !storagePath.startsWith(`${companyId}/`)) {
            return NextResponse.json(
                { error: "Anexo não encontrado." },
                { status: 404 },
            );
        }

        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(storagePath, 120);

        if (error)
            return NextResponse.json(
                { error: "Erro ao gerar link." },
                { status: 500 },
            );

        return NextResponse.json({ signedUrl: data.signedUrl });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

export async function DELETE(request) {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit({ key: `attachments-dl:${ip}`, windowSeconds: 60, max: 30 });
    if (!allowed) return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
    try {
        const token = request.headers.get("authorization")?.split("Bearer ")[1];
        if (!token)
            return NextResponse.json(
                { error: "Não autorizado." },
                { status: 401 },
            );

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json(
                { error: "Token inválido." },
                { status: 401 },
            );
        }

        const storagePath = request.nextUrl.searchParams.get("path");
        if (!storagePath || storagePath.includes(".."))
            return NextResponse.json(
                { error: "Path inválido." },
                { status: 400 },
            );

        const companyId = await getCallerCompanyId(caller.uid);
        if (!companyId || !storagePath.startsWith(`${companyId}/`)) {
            return NextResponse.json(
                { error: "Anexo não encontrado." },
                { status: 404 },
            );
        }

        const { error } = await supabaseAdmin.storage
            .from(BUCKET)
            .remove([storagePath]);
        if (error)
            return NextResponse.json(
                { error: "Erro ao remover." },
                { status: 500 },
            );

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}
