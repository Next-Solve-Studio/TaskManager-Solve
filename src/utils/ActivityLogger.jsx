import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

/**
 * Registra uma atividade no sistema.
 *
 * @param {Object} activityData - Dados da atividade
 * @param {string} activityData.userId - ID do usuário que realizou a ação
 * @param {string} activityData.userName - Nome do usuário
 * @param {string} activityData.userPhoto - Foto do usuário
 * @param {string} activityData.companyId - ID da empresa
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
            companyId,
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

        if (!userId || !action || !resourceType || !companyId) {
            console.warn(
                "Dados insuficientes para log de atividade (companyId é obrigatório):",
                activityData,
            );
            return;
        }

        const logsRef = collection(db, "activity_logs");

        await addDoc(logsRef, {
            userId,
            userName: userName || "Usuário desconhecido",
            userPhoto: userPhoto || null,
            companyId,
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
 * Exclui logs de atividade mais antigos que o número de dias especificado.
 *
 * @param {number} days - Número de dias para manter os logs (padrão 2)
 */

export const cleanOldLogs = async (days = 2) => {
    try {
        const logsRef = collection(db, "activity_logs");

        // Calcula a data limite (X dias atrás)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

        // Cria a query para buscar logs anteriores à data limite
        const q = query(logsRef, where("timestamp", "<", cutoffTimestamp));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return;
        }

        // Deleta cada documento encontrado
        const deletePromises = querySnapshot.docs.map((document) =>
            deleteDoc(doc(db, "activity_logs", document.id)),
        );

        await Promise.all(deletePromises);
        console.log(
            `${querySnapshot.size} logs antigos (mais de ${days} dias) foram removidos.`,
        );
    } catch (error) {
        console.error("Erro ao limpar logs antigos:", error);
    }
};

/**
 * Gera uma mensagem amigável para a atividade baseada nos dados do log.
 * Útil para exibição no Feed de Atividades.
 */
export const getActivityMessage = (log) => {
    const { action, resourceType, resourceName, details } = log;

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
