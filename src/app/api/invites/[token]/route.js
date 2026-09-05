import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export async function GET(request, { params }) {
    try {
        const { token } = await params;
        const { db } = getFirebaseAdmin();
        const inviteDoc = await db.collection("invites").doc(token).get();

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

        return NextResponse.json({
            email: invite.email,
            name: invite.name,
            role: invite.role,
            companyName: invite.companyName,
            invitedByName: invite.invitedByName,
        });
    } catch (error) {
        console.error("Erro ao buscar convite:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}