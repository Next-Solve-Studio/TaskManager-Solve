import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";

function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) {
            return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
        }

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db } = getFirebaseAdmin();
        const userDoc = await db.collection("users").doc(caller.uid).get();
        const userData = userDoc.data();

        if (!userData?.email) {
            return NextResponse.json({ message: "Usuário sem e-mail cadastrado." }, { status: 400 });
        }

        const code = generateCode();
        const expiresAt = Date.now() + 15 * 60 * 1000;

        await db.collection("password_change_codes").doc(caller.uid).set({
            code,
            expiresAt,
            attempts: 0,
            createdAt: Date.now(),
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
                    to_email: userData.email,
                    user_name: userData.name || "",
                    code,
                },
            }),
        });

        if (!emailRes.ok) {
            const errText = await emailRes.text();
            console.error("[request-password-change-code] Falha ao enviar e-mail:", errText);
            return NextResponse.json({ message: "Erro ao enviar e-mail. Tente novamente." }, { status: 502 });
        }

        return NextResponse.json({ message: "Código enviado para o seu e-mail." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao solicitar código de troca de senha:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}