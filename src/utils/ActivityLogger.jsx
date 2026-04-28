import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

/**
 * Registra uma atividade no sistema.
 *
 * @param {Object} activityData - Dados da atividade
 * @param {string} activityData.userId - ID do usuário que realizou a ação
 * @param {string} activityData.userName - Nome do usuário
 * @param {string} activityData.userPhoto - Foto do usuário
 * @param {'create' | 'update' | 'delete' | 'status_change'} activityData.action - Tipo de ação
 * @param {'project' | 'client' | 'user' | 'schedule'} activityData.resourceType - Tipo de recurso afetado
 * @param {string} activityData.resourceId - ID do recurso (ex: ID do projeto)
 * @param {string} activityData.resourceName - Nome amigável do recurso (ex: Título do projeto)
 * @param {Object} [activityData.details] - Detalhes adicionais (campos alterados, valores antigos/novos)
 */
export const logActivity = async (activityData) => {
    try {
        const {
            userId,
            userName,
            userPhoto,
            action,
            resourceType,
            resourceId,
            resourceName,
            details = {},
        } = activityData;

        // Validação básica
        if (!userId || !action || !resourceType) {
            console.error(
                "Dados insuficientes para log de atividade:",
                activityData,
            );
            return;
        }

        const logsRef = collection(db, "activity_logs");

        await addDoc(logsRef, {
            userId,
            userName: userName || "Usuário desconhecido",
            userPhoto: userPhoto || null,
            action,
            resourceType,
            resourceId,
            resourceName: resourceName || "N/A",
            details,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao registrar log de atividade:", error);
    }
};

/**
 * Gera uma mensagem amigável para a atividade baseada nos dados do log.
 * Útil para exibição no Feed de Atividades.
 */
export const getActivityMessage = (log) => {
    const { userName, action, resourceType, resourceName, details } = log;

    const resourceLabels = {
        project: "projeto",
        client: "cliente",
        user: "usuário",
        schedule: "agenda",
        task: "tarefa",
    };

    const label = resourceLabels[resourceType] || resourceType;

    switch (action) {
        case "create":
            return `criou o ${label} "${resourceName}" através da página "${resourceType}"`;
        case "delete":
            return `removeu o ${label} "${resourceName}" através da página "${resourceType}"`;
        case "status_change":
            return `alterou o status de "${resourceName}" para ${details.newValue || "—"}`;
        case "update":
            if (details.field) {
                return `atualizou o campo ${details.field} de "${resourceName}" através da página "${resourceType}"`;
            }
            return `atualizou informações em "${resourceName}" através da página "${resourceType}"`;
        default:
            return `realizou uma ação em ${label} "${resourceName}" através da página "${resourceType}"`;
    }
};
