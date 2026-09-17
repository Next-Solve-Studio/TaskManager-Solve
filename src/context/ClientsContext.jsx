"use client";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";

import { db } from "@/lib/firebaseConfig";
import { logActivity } from "@/utils/ActivityLogger";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ClientsContext = createContext();

export const useClients = () => useContext(ClientsContext);

export const ClientsProvider = ({ children }) => {
    const { uid, companyId, userName, userPhoto } = useCurrentUser();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // só busca dados da empresa que o usuário estiver logado.
        if (!companyId) {
            setClients([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "clients"),
            where("companyId", "==", companyId),
            orderBy("createdAt", "desc"),
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setClients(
                    snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
                );
                setLoading(false);
            },
            (error) => {
                console.error("Erro ao ouvir clientes", error);
                if (error.code !== "permission-denied") {
                    toast.error("Erro ao carregar clientes");
                }
                setLoading(false);
            },
        );
        return unsubscribe;
    }, [companyId]);

    const createClient = useCallback(
        async (data) => {
            if (!companyId) throw new Error("Usuário não vinculado a uma empresa");

            try {
                const payload = {
                    name: data.name,
                    email: data.email || "",
                    contato: data.contato || "",
                    documento: data.documento || "",
                    endereco: data.endereco?.trim() || "",
                    status: data.status || "active",
                    customData: data.customData || {},
                    companyId: companyId,
                    createdBy: uid || "system",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                const ref = await addDoc(collection(db, "clients"), payload);

                // Log de Atividade
                await logActivity({
                    userId: uid,
                    userName: userName,
                    companyId: companyId,
                    userPhoto: userPhoto,
                    action: "create",
                    resourceType: "client",
                    resourceId: ref.id,
                    resourceName: payload.name,
                });
                toast.success("Cliente criado com sucesso");
                return { id: ref.id, ...payload };
            } catch (error) {
                console.error("Erro ao criar cliente:", error);
                toast.error(getErrorMessage(error, "Erro ao criar cliente"));
                throw error;
            }
        },
        [uid, companyId, userName, userPhoto],
    );

    const updateClient = useCallback(
        async (clientId, data) => {
            try {
                const payload = {
                    name: data.name,
                    email: data.email || "",
                    contato: data.contato || "",
                    documento: data.documento || "",
                    endereco: data.endereco?.trim() || "",
                    status: data.status,
                    customData: data.customData || {},
                    updatedAt: serverTimestamp(),
                };
                await updateDoc(doc(db, "clients", clientId), payload);

                // Log de Atividade
                await logActivity({
                    userId: uid,
                    userName: userName,
                    userPhoto: userPhoto,
                    companyId: companyId,
                    action: "update",
                    resourceType: "client",
                    resourceId: clientId,
                    resourceName: payload.name,
                });

                toast.success("Cliente atualizado com sucesso");
            } catch (error) {
                console.error("Erro ao atualizar cliente:", error);
                toast.error(getErrorMessage(error, "Erro ao atualizar cliente"));
                throw error;
            }
        },
        [uid, companyId, userName, userPhoto],
    );

        const deleteClient = useCallback(
        async (client) => {
            try {
                const clientId = client.id;
                await deleteDoc(doc(db, "clients", clientId));

                // Remove logs de atividade que referenciam este cliente (LGPD)
                const logsQuery = query(
                    collection(db, "activity_logs"),
                    where("companyId", "==", companyId),
                    where("resourceType", "==", "client"),
                    where("resourceId", "==", clientId),
                );
                const logsSnap = await getDocs(logsQuery);
                await Promise.all(
                    logsSnap.docs.map((logDoc) => deleteDoc(logDoc.ref)),
                );

                // Log de Atividade
                await logActivity({
                    userId: uid,
                    userName: userName,
                    companyId: companyId,
                    userPhoto: userPhoto,
                    action: "delete",
                    resourceType: "client",
                    resourceId: clientId,
                    resourceName: client.name,
                });

                toast.success("Cliente excluído com sucesso");
            } catch (error) {
                console.error("Erro ao excluir cliente:", error);
                toast.error(getErrorMessage(error, "Erro ao excluir cliente"));
                throw error;
            }
        },
        [uid, companyId, userName, userPhoto],
    );

    const value = useMemo(()=>({
        clients,
        loading,
        createClient,
        updateClient,
        deleteClient,
    }),[clients, loading, createClient, updateClient, deleteClient]);

    return (
        <ClientsContext.Provider value={value}>
            {children}
        </ClientsContext.Provider>
    );
};
