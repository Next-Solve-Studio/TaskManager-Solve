import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { PERMISSIONS, ROLES } from "@/lib/roles";

const DEFAULT_FINANCIAL_ROLES = PERMISSIONS.canViewFinancials.filter((r) => r !== ROLES.MASTER);

/**
 * Deriva o appKey da empresa do próprio usuário autenticado (nunca confia no
 * appKey enviado pelo cliente) e garante que o cargo dele tem permissão
 * financeira antes de liberar operações de billing.
 */
export async function getAuthorizedAppKey(uid) {
    const { db } = getFirebaseAdmin();

    const callerDoc = await db.collection("users").doc(uid).get();
    const callerData = callerDoc.data();
    if (!callerData?.companyId) {
        return { error: "Usuário não vinculado a uma empresa.", status: 404 };
    }

    if (callerData.role !== ROLES.MASTER) {
        const permsDoc = await db.collection("role_permissions").doc(callerData.companyId).get();
        const allowedRoles = permsDoc.exists
            ? (permsDoc.data().permissions?.canViewFinancials ?? DEFAULT_FINANCIAL_ROLES)
            : DEFAULT_FINANCIAL_ROLES;
        if (!allowedRoles.includes(callerData.role)) {
            return { error: "Sem permissão para gerenciar o faturamento.", status: 403 };
        }
    }

    const companyDoc = await db.collection("companies").doc(callerData.companyId).get();
    const appKey = companyDoc.data()?.appKey;
    if (!appKey) {
        return { error: "Empresa não encontrada.", status: 404 };
    }

    return { appKey };
}