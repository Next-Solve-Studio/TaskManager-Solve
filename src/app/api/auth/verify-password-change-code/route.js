import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";

const MAX_ATTEMPTS = 5;

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

        const { code, newPassword } = await request.json();

        if (!code || !newPassword || newPassword.length < 6) {
            return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
        }

        const { db, auth } = getFirebaseAdmin();
        const codeRef = db.collection("password_change_codes").doc(caller.uid);
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

        await auth.updateUser(caller.uid, { password: newPassword });
        await codeRef.delete();

        return NextResponse.json({ message: "Senha alterada com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao verificar código de troca de senha:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}