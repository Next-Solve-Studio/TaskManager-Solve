import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";

const BUCKET = "project-attachments";
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "application/rtf",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
];

export async function POST(request, { params }) {
    try {
        const { projectId } = await params;
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ error: "Token inválido." }, { status: 401 });
        }

        const { db } = getFirebaseAdmin();
        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const companyId = callerDoc.data()?.companyId;
        if (!companyId) {
            return NextResponse.json({ error: "Usuário não vinculado a uma empresa." }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file)
            return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });

        if (!ALLOWED_TYPES.includes(file.type))
            return NextResponse.json({ error: "Tipo de arquivo não permitido." }, { status: 400 });

        if (file.size > MAX_SIZE)
            return NextResponse.json({ error: "Arquivo maior que 10MB." }, { status: 400 });

        const ext = file.name.split(".").pop();
        const uid = crypto.randomUUID();
        const storagePath = `${companyId}/${projectId}/${uid}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const { error: upErr } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(storagePath, buffer, { contentType: file.type, upsert: false });

        if (upErr) {
            console.error(upErr);
            return NextResponse.json({ error: "Erro ao enviar arquivo." }, { status: 500 });
        }

        return NextResponse.json({
            storagePath,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedBy: caller.uid,
            uploadedByName: callerDoc.data()?.name || "Usuário",
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}