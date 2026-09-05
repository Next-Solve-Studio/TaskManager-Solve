import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request, { params }) {
    try {
        const { token } = await params;
        const ip = getClientIp(request);

        const { allowed } = await checkRateLimit({ key: `invite-accept:${ip}`, windowSeconds: 60, max: 10 });
        if (!allowed) {
            return NextResponse.json({ message: "Muitas tentativas. Tente novamente em instantes." }, { status: 429 });
        }

        const { password } = await request.json();
        if (!password || password.length < 6) {
            return NextResponse.json({ message: "A senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
        }

        const { db, auth } = getFirebaseAdmin();
        const inviteRef = db.collection("invites").doc(token);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            return NextResponse.json({ message: "Convite não encontrado." }, { status: 404 });
        }

        const invite = inviteDoc.data();

        if (invite.status !== "pending") {
            return NextResponse.json({ message: "Este convite já foi utilizado." }, { status: 410 });
        }

        if (Date.now() > invite.expiresAt) {
            return NextResponse.json({ message: "Este convite expirou." }, { status: 410 });
        }

        const companyDoc = await db.collection("companies").doc(invite.companyId).get();
        const companyData = companyDoc.data();
        if (!companyDoc.exists || companyData.status !== "active") {
            return NextResponse.json({ message: "A licença desta empresa está inativa." }, { status: 403 });
        }

        const userRecord = await auth.createUser({
            email: invite.email,
            password,
            displayName: invite.name,
        });

        await db.collection("users").doc(userRecord.uid).set({
            name: invite.name,
            email: invite.email,
            role: invite.role,
            companyId: invite.companyId,
            customData: invite.customData || {},
            createdAt: new Date(),
            lastLoginAt: null,
            lastSeenAt: null,
            authMethod: "email",
        });

        await inviteRef.update({ status: "accepted", acceptedAt: Date.now() });

        return NextResponse.json({ message: "Conta criada com sucesso.", email: invite.email }, { status: 201 });
    } catch (error) {
        console.error("Erro ao aceitar convite:", error);
        if (error.code === "auth/email-already-exists") {
            return NextResponse.json({ message: "Já existe uma conta com este e-mail." }, { status: 409 });
        }
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}