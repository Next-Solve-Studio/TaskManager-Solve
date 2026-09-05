import { NextResponse } from "next/server";
import crypto from "crypto";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit } from "@/lib/rateLimit";

const PLAN_USER_LIMITS = { FREE: 3, BASIC: 10, PRO: 30, ENTERPRISE: Infinity };
const ALLOWED_ROLES = ["administrador", "desenvolvedor", "lider_de_projetos"];

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];
        if (!token) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { allowed } = await checkRateLimit({ key: `invite:${caller.uid}`, windowSeconds: 60, max: 10 });
        if (!allowed) {
            return NextResponse.json({ message: "Muitos convites enviados. Tente novamente em instantes." }, { status: 429 });
        }

        const { db, auth } = getFirebaseAdmin();
        const { name, email, role, companyId, customData } = await request.json();

        if (!email || !companyId || !name) {
            return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
        }

        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();

        if (!callerData || callerData.companyId !== companyId) {
            return NextResponse.json({ message: "Sem permissão para esta empresa." }, { status: 403 });
        }

        if (callerData.role !== "master") {
            const permsDoc = await db.collection("role_permissions").doc(companyId).get();
            const allowedRoles = permsDoc.exists ? (permsDoc.data().permissions?.canCreateUsers ?? []) : [];
            if (!allowedRoles.includes(callerData.role)) {
                return NextResponse.json({ message: "Sem permissão para criar usuários." }, { status: 403 });
            }
        }

        const companyDoc = await db.collection("companies").doc(companyId).get();
        const companyData = companyDoc.data();

        if (!companyDoc.exists || companyData.status !== "active") {
            return NextResponse.json(
                { message: "Licença inativa ou expirada. Regularize o plano para convidar usuários." },
                { status: 403 },
            );
        }

        const userLimit = PLAN_USER_LIMITS[companyData.plan] ?? PLAN_USER_LIMITS.FREE;

        const [existingUsersSnap, pendingInvitesSnap] = await Promise.all([
            db.collection("users").where("companyId", "==", companyId).get(),
            db.collection("invites").where("companyId", "==", companyId).where("status", "==", "pending").get(),
        ]);

        if (existingUsersSnap.size + pendingInvitesSnap.size >= userLimit) {
            return NextResponse.json(
                { message: `Limite de usuários do plano ${companyData.plan} atingido (${userLimit}).` },
                { status: 403 },
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        try {
            await auth.getUserByEmail(normalizedEmail);
            return NextResponse.json({ message: "Já existe uma conta com este e-mail." }, { status: 409 });
        } catch {
            // não existe usuário com esse e-mail ainda, segue o fluxo
        }

        const existingInvite = await db
            .collection("invites")
            .where("companyId", "==", companyId)
            .where("email", "==", normalizedEmail)
            .where("status", "==", "pending")
            .get();

        if (!existingInvite.empty) {
            return NextResponse.json({ message: "Já existe um convite pendente para este e-mail." }, { status: 409 });
        }

        const safeRole = ALLOWED_ROLES.includes(role) ? role : "desenvolvedor";
        const inviteToken = crypto.randomBytes(24).toString("hex");
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

        await db.collection("invites").doc(inviteToken).set({
            email: normalizedEmail,
            name: name.trim(),
            role: safeRole,
            companyId,
            companyName: companyData.name || "",
            customData: customData || {},
            invitedBy: caller.uid,
            invitedByName: callerData.name || "",
            status: "pending",
            createdAt: Date.now(),
            expiresAt,
        });

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/Invite/${inviteToken}`;

        const emailRes = await fetch(`${process.env.API_TASKMANAGER_URL}/api/internal/send-invite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_SECRET,
            },
            body: JSON.stringify({
                to: normalizedEmail,
                inviteeName: name.trim(),
                companyName: companyData.name || "",
                inviterName: callerData.name || "",
                inviteLink,
            }),
        });

        if (!emailRes.ok) {
            const errText = await emailRes.text();
            console.error("[invites] Falha ao enviar e-mail de convite:", errText);
            await db.collection("invites").doc(inviteToken).delete();
            return NextResponse.json({ message: "Erro ao enviar e-mail de convite. Tente novamente." }, { status: 502 });
        }

        return NextResponse.json({ message: "Convite enviado com sucesso." }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar convite:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}