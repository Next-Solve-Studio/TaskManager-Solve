import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function DELETE(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];

        if (!token) {
            return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
        }

        const ip = getClientIp(request);
        const { allowed } = await checkRateLimit({ key: `billing-cancel:${ip}`, windowSeconds: 300, max: 3 });
        if (!allowed) return NextResponse.json({ message: "Muitas tentativas." }, { status: 429 });

        let caller;
        try {
            caller = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { db, auth } = getFirebaseAdmin();

        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();

        if (!callerData?.companyId) {
            return NextResponse.json({ message: "Empresa não encontrada." }, { status: 404 });
        }

        if (callerData.role !== "master") {
            return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
        }

        const companyRef = db.collection("companies").doc(callerData.companyId);
        const companyDoc = await companyRef.get();
        const appKey = companyDoc.data()?.appKey;

        if (!appKey) {
            return NextResponse.json({ message: "Empresa não encontrada." }, { status: 404 });
        }

        const response = await fetch(`${process.env.LICENSE_API_URL}/api/billing/cancel-account`, {
            method: "DELETE",
            headers: { "x-app-key": appKey },
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.error || "Erro ao cancelar cadastro." }, { status: response.status });
        }

        const companyId = callerData.companyId;

        const usersSnap = await db.collection("users").where("companyId", "==", companyId).get();
        const userIds = usersSnap.docs.map((d) => d.id);

        await Promise.all(userIds.map((uid) => auth.deleteUser(uid).catch(() => {})));

        await Promise.all(
            userIds.flatMap((uid) => [
                db.collection("google_tokens").doc(uid).delete().catch(() => {}),
                db.collection("password_reset_codes").doc(uid).delete().catch(() => {}),
                db.collection("password_change_codes").doc(uid).delete().catch(() => {}),
                db.collection("oauth_states").where("uid", "==", uid).get()
                    .then((s) => Promise.all(s.docs.map((d) => d.ref.delete())))
                    .catch(() => {}),
            ])
        );

        const [scheduleSnap, activitySnap, invitesSnap, projectsSnap, tasksSnap, clientsSnap] =
            await Promise.all([
                db.collection("scheduleEvents").where("companyId", "==", companyId).get(),
                db.collection("activity_logs").where("companyId", "==", companyId).get(),
                db.collection("invites").where("companyId", "==", companyId).get(),
                db.collection("projects").where("companyId", "==", companyId).get(),
                db.collection("tasks").where("companyId", "==", companyId).get(),
                db.collection("clients").where("companyId", "==", companyId).get(),
            ]);

        await Promise.all(projectsSnap.docs.map((d) => db.recursiveDelete(d.ref)));

        await Promise.all([
            ...usersSnap.docs.map((d) => d.ref.delete()),
            ...scheduleSnap.docs.map((d) => d.ref.delete()),
            ...activitySnap.docs.map((d) => d.ref.delete()),
            ...invitesSnap.docs.map((d) => d.ref.delete()),
            ...tasksSnap.docs.map((d) => d.ref.delete()),
            ...clientsSnap.docs.map((d) => d.ref.delete()),
        ]);

        await Promise.all([
            db.collection("role_permissions").doc(companyId).delete().catch(() => {}),
            db.collection("customFields").doc(companyId).delete().catch(() => {}),
            companyRef.delete(),
        ]);

        return NextResponse.json({ message: "Cadastro cancelado com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao cancelar cadastro pendente:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}