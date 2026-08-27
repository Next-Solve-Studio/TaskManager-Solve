"use client";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
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
import { useAuth } from "@/context/AuthContext";
import { useRolePermissions } from "@/context/RolePermissionsContext";
import { db } from "@/lib/firebaseConfig";
import { ROLES } from "@/lib/roles";
import { logActivity } from "@/utils/ActivityLogger";
import { getErrorMessage } from "@/utils/getErrorMessage";


//Criando o contexto
const TasksContext = createContext();

// hook personalizado, para usar useTasks
export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children, projectId }) => {
    const { currentUser } = useAuth(); // dados do user atual
    const { permissions, loadingPermissions } = useRolePermissions();
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    // Paginação
    const [visibleTasksCount, setVisibleTasksCount] = useState(20);

    const loadMoreTasks = useCallback(
        () => setVisibleTasksCount((prev) => prev + 20),
        [],
    );

    const canViewAll = currentUser?.role === ROLES.MASTER || (permissions?.canViewAllUsersTasks?.includes(currentUser?.role) ?? false);

    useEffect(() => {
        if (!currentUser?.companyId || loadingPermissions) {
            setTasks([]);
            setLoadingTasks(false);
            return;
        }

        const constraints = [
            where("companyId", "==", currentUser.companyId),
        ];

        if (!canViewAll) {
            constraints.push(where("assignedTo", "array-contains", currentUser.uid));
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
    }, [projectId, currentUser?.companyId, currentUser?.uid, canViewAll, loadingPermissions]);

    const createTask = useCallback(
        // memoriza a função para que ela não mude entre renderizações (a menos que currentUser mude)
        async (data) => {
            if (!currentUser?.companyId) throw new Error("Usuário não vinculado a uma empresa");

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
                companyId: currentUser.companyId,
                createdBy: currentUser.uid,
                createdByName:
                    currentUser.name || currentUser.displayname || "",
                createdAt: serverTimestamp(),
                lastModified: serverTimestamp(),
                lastModifiedBy: currentUser.uid,
                lastModifiedByName:
                    currentUser.name || currentUser.displayname || "",
            };

            // adiciona os dados do novo doc na coleção tasks
            const ref = await addDoc(collection(db, "tasks"), payload);

            await logActivity({
                userId: currentUser.uid,
                userName: currentUser.name || currentUser.displayName,
                userPhoto: currentUser.photo || currentUser.photoURL,
                action: "create",
                companyId: currentUser.companyId,
                resourceType: "task",
                resourceId: ref.id,
                resourceName: payload.title,
                details: { projectId: payload.projectId || null },
            });

            // A função retorna o projeto recém-criado com seu ID.
            return { id: ref.id, ...payload };
        },
        [currentUser, projectId],
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
                lastModifiedBy: currentUser.uid,
                lastModifiedByName:
                    currentUser.name || currentUser.displayname || "",
            };

            // localiza a task atual e substitui com os novos dados
            await updateDoc(doc(db, "tasks", taskId), payload);

            // caso o status recebido seja diferente do que estava antes, faz um log de mudança de status
            if (prevStatus === nextStatus) {
                await logActivity({
                    userId: currentUser.uid,
                    userName: currentUser.name || currentUser.displayName,
                    userPhoto: currentUser.photo || currentUser.photoURL,
                    action: "update",
                    companyId: currentUser.companyId,
                    resourceType: "task",
                    resourceId: taskId,
                    resourceName: payload.title,
                    details: { projectId: payload.projectId || null },
                });
            } else {
                await logActivity({
                    userId: currentUser.uid,
                    userName: currentUser.name || currentUser.displayName,
                    userPhoto: currentUser.photo || currentUser.photoURL,
                    action: "status_change",
                    companyId: currentUser.companyId,
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
        [currentUser, projectId],
    );

    const deleteTask = useCallback(
        async (task) => {
            // remove o documento com o ID fornecido
            await deleteDoc(doc(db, "tasks", task.id));

            await logActivity({
                userId: currentUser.uid,
                userName: currentUser.name || currentUser.displayName,
                userPhoto: currentUser.photo || currentUser.photoURL,
                action: "delete",
                companyId: currentUser.companyId,
                resourceType: "task",
                resourceId: task.id,
                resourceName: task.title,
                details: { projectId: task.projectId || null },
            });
        },
        [currentUser],
    );

    // Atualiza apenas o checklist de uma tarefa (sem reabrir modal)
    const updateChecklist = useCallback(
        async (taskId, checklist) => {
            // atualiza a task do taskId fornecido
            await updateDoc(doc(db, "tasks", taskId), {
                checklist,
                lastModified: serverTimestamp(),
                lastModifiedBy: currentUser.uid,
                lastModifiedByName:
                    currentUser.name || currentUser.displayName || "",
            });
        },
        [currentUser],
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
    ]);

    return (
        <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
    );
};
