import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";
import { ROLES } from "@/lib/roles";

export async function POST(request) {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    let caller;
    try {
        caller = await verifyFirebaseToken(token);
    } catch {
        return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const { db } = getFirebaseAdmin();
    const userDoc = await db.collection("users").doc(caller.uid).get();
    const userData = userDoc.data();

    if (userData?.role !== ROLES.MASTER) {
        return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
    }

    const companyId = userData.companyId;
    if (!companyId) return NextResponse.json({ error: "Empresa não encontrada." }, { status: 400 });

    const body = await request.json();
    const { permissionKey, roles } = body;
    if (!permissionKey || !Array.isArray(roles)) {
        return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    await db.collection("role_permissions").doc(companyId).set(
        { companyId, permissions: { [permissionKey]: roles }, updatedAt: new Date(), updatedBy: caller.uid },
        { merge: true },
    );

    return NextResponse.json({ ok: true });
}