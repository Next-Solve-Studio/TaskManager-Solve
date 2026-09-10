"use client";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
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
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebaseConfig";
import { userDetailsSchema } from "@/utils/userDetailsSchema";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { logActivity } from "@/utils/ActivityLogger";

const UsersContext = createContext();

export const useUsers = () => useContext(UsersContext);

export const UsersProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        if (!currentUser?.companyId) {
            setUsers([]);
            setLoadingUsers(false);
            return;
        }

        const q = query(
            collection(db, "users"),
            where("companyId", "==", currentUser.companyId),
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
    }, [currentUser?.companyId]);

    const updateUser = useCallback(async (userId, newRole, details, userName = "") => {
        const payload = { role: newRole, updatedAt: serverTimestamp() };
        if (details) {
            Object.assign(
                payload,
                await userDetailsSchema.validate(details, { stripUnknown: true }),
            );
        }
        await updateDoc(doc(db, "users", userId), payload);

        await logActivity({
            userId: currentUser.uid,
            userName: currentUser.name || currentUser.displayName,
            userPhoto: currentUser.photo || currentUser.photoURL,
            companyId: currentUser.companyId,
            action: "update",
            resourceType: "user",
            resourceId: userId,
            resourceName: userName,
        });
    }, [currentUser]);

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