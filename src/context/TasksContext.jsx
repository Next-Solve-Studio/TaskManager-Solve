"use client";

import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";
import { useRolePermissions } from "@/context/RolePermissionsContext";
import { db } from "@/lib/firebaseConfig";
import { ROLES } from "@/lib/roles";
import { logActivity } from "@/utils/ActivityLogger";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useCurrentUser } from "@/hooks/useCurrentUser";

//Criando o contexto
const TasksContext = createContext();

// hook personalizado, para usar useTasks
export const useTasks = () => useContext(TasksContext);

// o Firestore aceita no máximo 500 operações por batch
const BATCH_LIMIT = 400;

export const TasksProvider = ({ children, projectId }) => {
    const { permissions, loadingPermissions } = useRolePermissions();
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const { uid, companyId, userName, userPhoto, role } = useCurrentUser();

    // Paginação
    const [visibleTasksCount, setVisibleTasksCount] = useState(20);

    const loadMoreTasks = useCallback(
        () => setVisibleTasksCount((prev) => prev + 20),
        [],
    );

    const canViewAll = role === ROLES.MASTER || (permissions?.canViewAllUsersTasks?.includes(role) ?? false);

    useEffect(() => {
        if (!companyId || loadingPermissions) {
            setTasks([]);
            setLoadingTasks(false);
            return;
        }

        const constraints = [
            where("companyId", "==", companyId),
        ];

        if (!canViewAll) {
            constraints.push(where("assignedTo", "array-contains", uid));
        }

        if (projectId) {
            constraints.push(where("projectId", "==", projectId));
        }

        constraints.push(orderBy("createdAt", "desc"));

        const q = query(collection(db, "tasks"), ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
                setLoadingTasks(false);
            },
            (error) => {
                console.error("Erro ao ouvir tasks", error);
                if (error.code !== "permission-denied") {
                    toast.error(getErrorMessage(error, "Erro ao carregar tarefas"));
                }
                setLoadingTasks(false);
            },
        );

        return unsubscribe;
    }, [projectId, companyId, uid, canViewAll, loadingPermissions]);

    const createTask = useCallback(
        // memoriza a função para que ela não mude entre renderizações (a menos que currentUser mude)
        async (data) => {
            if (!companyId) throw new Error("Usuário não vinculado a uma empresa");

            const payload = {
                title: data.title,
                description: data.description || "",
                projectId: data.projectId || projectId || "",
                assignedTo: data.assignedTo || [],
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate || "",
                priority: data.priority || "media",
                status: data.status || "em_andamento",
                solution: data.solution || "",
                checklist: data.checklist || [],
                companyId: companyId,
                createdBy: uid,
                createdByName: userName,
                createdAt: serverTimestamp(),
                lastModified: serverTimestamp(),
                lastModifiedBy: uid,
                lastModifiedByName: userName,
                customData: data.customData || {},
            };

            // adiciona os dados do novo doc na coleção tasks
            const ref = await addDoc(collection(db, "tasks"), payload);

            await logActivity({
                userId: uid,
                userName: userName,
                userPhoto: userPhoto,
                action: "create",
                companyId: companyId,
                resourceType: "task",
                resourceId: ref.id,
                resourceName: payload.title,
                details: { projectId: payload.projectId || null },
            });

            // A função retorna o projeto recém-criado com seu ID.
            return { id: ref.id, ...payload };
        },
        [uid, companyId, userName, userPhoto, projectId],
    );

    const updateTask = useCallback(
        async (taskId, data, currentTask) => {
            const prevStatus = currentTask.status;
            const nextStatus = data.status;

            const payload = {
                title: data.title,
                description: data.description || "",
                projectId: data.projectId || projectId || "",
                assignedTo: data.assignedTo || [],
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                priority: data.priority,
                status: data.status,
                solution: data.solution || "",
                checklist: data.checklist || [],
                lastModified: serverTimestamp(),
                lastModifiedBy: uid,
                lastModifiedByName: userName,
                customData: data.customData || {},
            };

            // localiza a task atual e substitui com os novos dados
            await updateDoc(doc(db, "tasks", taskId), payload);

            // caso o status recebido seja diferente do que estava antes, faz um log de mudança de status
            if (prevStatus === nextStatus) {
                await logActivity({
                    userId: uid,
                    userName: userName,
                    userPhoto: userPhoto,
                    action: "update",
                    companyId: companyId,
                    resourceType: "task",
                    resourceId: taskId,
                    resourceName: payload.title,
                    details: { projectId: payload.projectId || null },
                });
            } else {
                await logActivity({
                    userId: uid,
                    userName: userName,
                    userPhoto: userPhoto,
                    action: "status_change",
                    companyId: companyId,
                    resourceType: "task",
                    resourceId: taskId,
                    resourceName: payload.title,
                    details: {
                        field: "status",
                        oldValue: prevStatus,
                        newValue: nextStatus,
                        projectId: payload.projectId || null,
                    },
                });
            }

            return { id: taskId, ...payload };
        },
        [uid, companyId, userName, userPhoto, projectId],
    );

    const deleteTask = useCallback(
        async (task) => {
            // remove o documento com o ID fornecido
            await deleteDoc(doc(db, "tasks", task.id));

            await logActivity({
                userId: uid,
                userName: userName,
                userPhoto: userPhoto,
                action: "delete",
                companyId: companyId,
                resourceType: "task",
                resourceId: task.id,
                resourceName: task.title,
                details: { projectId: task.projectId || null },
            });
        },
        [uid, companyId, userName, userPhoto],
    );

    // Atualiza apenas o checklist de uma tarefa (sem reabrir modal)
    // Se `currentTask` for informada e todos os itens ficarem marcados, a tarefa
    // também vira "concluido". Retorna true quando a conclusão automática ocorreu.
    const updateChecklist = useCallback(
        async (taskId, checklist, currentTask) => {
            const autoComplete = Boolean(
                currentTask &&
                    currentTask.status !== "concluido" &&
                    checklist.length > 0 &&
                    checklist.every((item) => item.done),
            );

            // atualiza a task do taskId fornecido
            await updateDoc(doc(db, "tasks", taskId), {
                checklist,
                ...(autoComplete && { status: "concluido" }),
                lastModified: serverTimestamp(),
                lastModifiedBy: uid,
                lastModifiedByName: userName,
            });

            if (autoComplete) {
                await logActivity({
                    userId: uid,
                    userName: userName,
                    userPhoto: userPhoto,
                    action: "status_change",
                    companyId: companyId,
                    resourceType: "task",
                    resourceId: taskId,
                    resourceName: currentTask.title,
                    details: {
                        field: "status",
                        oldValue: currentTask.status,
                        newValue: "concluido",
                        projectId: currentTask.projectId || null,
                    },
                });
            }

            return autoComplete;
        },
        [uid, companyId, userName, userPhoto],
    );

    // Altera várias tarefas de uma vez: status e/ou responsável (adiciona ou limpa).
    // Retorna quantas tarefas realmente mudaram.
    const bulkUpdateTasks = useCallback(
        async (taskIds, { status, addAssignee, clearAssignees }) => {
            const byId = new Map(tasks.map((t) => [t.id, t]));
            const affected = taskIds
                .map((id) => byId.get(id))
                .filter((t) => {
                    if (!t) return false;
                    const assigned = t.assignedTo || [];
                    if (status && t.status !== status) return true;
                    if (addAssignee && !assigned.includes(addAssignee)) return true;
                    if (clearAssignees && assigned.length > 0) return true;
                    return false;
                });

            if (affected.length === 0) return 0;

            for (let i = 0; i < affected.length; i += BATCH_LIMIT) {
                const batch = writeBatch(db);
                for (const t of affected.slice(i, i + BATCH_LIMIT)) {
                    batch.update(doc(db, "tasks", t.id), {
                        ...(status && { status }),
                        ...(addAssignee && { assignedTo: arrayUnion(addAssignee) }),
                        ...(clearAssignees && { assignedTo: [] }),
                        lastModified: serverTimestamp(),
                        lastModifiedBy: uid,
                        lastModifiedByName: userName,
                    });
                }
                await batch.commit();
            }

            await Promise.all(
                affected.map((t) => {
                    const statusChanged = Boolean(status) && t.status !== status;
                    return logActivity({
                        userId: uid,
                        userName: userName,
                        userPhoto: userPhoto,
                        action: statusChanged ? "status_change" : "update",
                        companyId: companyId,
                        resourceType: "task",
                        resourceId: t.id,
                        resourceName: t.title,
                        details: statusChanged
                            ? {
                                  field: "status",
                                  oldValue: t.status,
                                  newValue: status,
                                  projectId: t.projectId || null,
                              }
                            : { projectId: t.projectId || null },
                    });
                }),
            );

            return affected.length;
        },
        [tasks, uid, companyId, userName, userPhoto],
    );

    // Estados e funções disponíveis para os componentes filhos
    const value = useMemo(()=>({
        tasks,
        loadingTasks,
        visibleTasksCount,
        loadMoreTasks,
        createTask,
        updateTask,
        deleteTask,
        updateChecklist,
        bulkUpdateTasks,
    }),
    [
        tasks,
        loadingTasks,
        visibleTasksCount,
        loadMoreTasks,
        createTask,
        updateTask,
        deleteTask,
        updateChecklist,
        bulkUpdateTasks,
    ]);

    return (
        <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
    );
};
