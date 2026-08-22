import { NextResponse } from "next/server";
import { getFirebaseAdmin, verifyFirebaseToken } from "@/lib/firebaseAdmin";

export async function DELETE(request) {
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

        const { db, auth } = getFirebaseAdmin();

        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();

        if (!callerData?.companyId) {
            return NextResponse.json({ message: "Empresa não encontrada." }, { status: 404 });
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

        // Remove tudo do lado do TaskManagerSolve
        const usersSnap = await db.collection("users").where("companyId", "==", callerData.companyId).get();
        await Promise.all(usersSnap.docs.map((doc) => doc.ref.delete()));

        await db.collection("role_permissions").doc(callerData.companyId).delete().catch(() => {});
        await companyRef.delete();

        await auth.deleteUser(caller.uid).catch(() => {});

        return NextResponse.json({ message: "Cadastro cancelado com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Erro ao cancelar cadastro pendente:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}