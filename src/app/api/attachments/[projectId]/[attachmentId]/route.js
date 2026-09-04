import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const JWKS = createRemoteJWKSet(
    new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);
const BUCKET = "project-attachments";

async function verifyToken(token) {
    const { payload } = await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
    });
    return payload;
}

// GET → gera signed URL para download
export async function GET(request) {
    try {
        const token = request.headers.get("authorization")?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
        try { await verifyToken(token); } catch {
            return NextResponse.json({ error: "Token inválido." }, { status: 401 });
        }

        const storagePath = request.nextUrl.searchParams.get("path");
        if (!storagePath) return NextResponse.json({ error: "Path ausente." }, { status: 400 });

        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(storagePath, 120);

        if (error) return NextResponse.json({ error: "Erro ao gerar link." }, { status: 500 });

        return NextResponse.json({ signedUrl: data.signedUrl });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

// DELETE → remove do storage
export async function DELETE(request) {
    try {
        const token = request.headers.get("authorization")?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
        try { await verifyToken(token); } catch {
            return NextResponse.json({ error: "Token inválido." }, { status: 401 });
        }

        const storagePath = request.nextUrl.searchParams.get("path");
        if (!storagePath) return NextResponse.json({ error: "Path ausente." }, { status: 400 });

        const { error } = await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);
        if (error) return NextResponse.json({ error: "Erro ao remover." }, { status: 500 });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}