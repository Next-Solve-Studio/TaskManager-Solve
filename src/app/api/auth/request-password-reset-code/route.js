import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

const GENERIC_MESSAGE = "Se esse e-mail estiver cadastrado, você vai receber um código em instantes.";

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ message: "Informe um e-mail válido." }, { status: 400 });
        }

        const { db, auth } = getFirebaseAdmin();

        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email.trim().toLowerCase());
        } catch {
            return NextResponse.json({ message: GENERIC_MESSAGE });
        }

        const userDoc = await db.collection("users").doc(userRecord.uid).get();
        const userData = userDoc.data();

        const code = generateCode();
        const expiresAt = Date.now() + 15 * 60 * 1000;

        await db.collection("password_reset_codes").doc(userRecord.uid).set({
            code,
            expiresAt,
            attempts: 0,
            createdAt: Date.now(),
            email: userRecord.email,
        });

        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    to_email: userRecord.email,
                    user_name: userData?.name || "",
                    code,
                },
            }),
        });

        if (!emailRes.ok) {
            const errText = await emailRes.text();
            console.error("[request-password-reset-code] Falha ao enviar e-mail:", errText);
        }

        return NextResponse.json({ message: GENERIC_MESSAGE });
    } catch (error) {
        console.error("Erro ao solicitar código de redefinição de senha:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}