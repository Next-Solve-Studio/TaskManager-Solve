"use client";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where
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
import { auth, db } from "@/lib/firebaseConfig";

import { getErrorMessage } from "@/utils/getErrorMessage";
import { logActivity } from "@/utils/ActivityLogger";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const UsersContext = createContext();

export const useUsers = () => useContext(UsersContext);

export const UsersProvider = ({ children }) => {
    const { uid, userName: currentUserName, userPhoto, companyId } = useCurrentUser();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        if (!companyId) {
            setUsers([]);
            setLoadingUsers(false);
            return;
        }

        const q = query(
            collection(db, "users"),
            where("companyId", "==", companyId),
            orderBy("createdAt", "desc")
        );

        const unSubscribe = onSnapshot(
            q,
            (snapshot) => {
                setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
                setLoadingUsers(false);
            },
            (error) => {
                console.error("Erro ao ouvir users", error);
                if (error.code !== "permission-denied") {
                    toast.error(getErrorMessage(error, "Erro ao carregar usuários"));
                }
                setLoadingUsers(false);
            },
        );

        return unSubscribe;
    }, [companyId]);

    const updateUser = useCallback(async (userId, newRole, details, userName = "") => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch("/api/updateEmployee", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ userId, role: newRole, ...details }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erro ao atualizar usuário");
        }

        await logActivity({
            userId: uid,
            userName: currentUserName,
            userPhoto: userPhoto,
            companyId: companyId,
            action: "update",
            resourceType: "user",
            resourceId: userId,
            resourceName: userName,
        });
    }, [uid, companyId, userPhoto, currentUserName]);

    const deleteUser = useCallback(async (userId) => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch("/api/deleteEmployee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erro ao excluir usuário");
        }
    }, []);

    const value = useMemo(() => ({
        loadingUsers,
        users,
        updateUser,
        deleteUser,
    }), [
        loadingUsers,
        users,
        updateUser,
        deleteUser,
    ]);

    return (
        <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
    );
};