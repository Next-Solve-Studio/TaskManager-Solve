import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const MAX_ATTEMPTS = 5;

export async function POST(request) {
    try {
        const { email, code, newPassword } = await request.json();

        if (!email || !code || !newPassword || newPassword.length < 6) {
            return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
        }

        const { db, auth } = getFirebaseAdmin();

        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email.trim().toLowerCase());
        } catch {
            return NextResponse.json({ message: "Código inválido ou expirado." }, { status: 400 });
        }

        const codeRef = db.collection("password_reset_codes").doc(userRecord.uid);
        const codeDoc = await codeRef.get();

        if (!codeDoc.exists) {
            return NextResponse.json({ message: "Nenhum código pendente. Solicite um novo." }, { status: 400 });
        }

        const data = codeDoc.data();

        if (Date.now() > data.expiresAt) {
            await codeRef.delete();
            return NextResponse.json({ message: "Código expirado. Solicite um novo." }, { status: 410 });
        }

        if (data.code.toUpperCase() !== code.toUpperCase()) {
            const attempts = (data.attempts || 0) + 1;

            if (attempts >= MAX_ATTEMPTS) {
                await codeRef.delete();
                return NextResponse.json(
                    { message: "Muitas tentativas incorretas. Processo cancelado, solicite um novo código." },
                    { status: 429 },
                );
            }

            await codeRef.update({ attempts });
            return NextResponse.json(
                { message: `Código incorreto. Tentativas restantes: ${MAX_ATTEMPTS - attempts}.` },
                { status: 400 },
            );
        }

        await auth.updateUser(userRecord.uid, { password: newPassword });
        await codeRef.delete();

        return NextResponse.json({ message: "Senha redefinida com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao verificar código de redefinição de senha:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}