"use client";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
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
import { getErrorMessage } from "@/utils/getErrorMessage";

const UsersContext = createContext(); // Contexto criado

export const useUsers = () => useContext(UsersContext);
// hook personalizado, para usar useUsers, ao invés se sempre escrever useContext(UsersContext)

export const UsersProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        // só busca dados da empresa que o usuário estiver logado.
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
            //onSnapshot pois escuta mudanças na coleção users e atualiza automaticamente
            q,
            (snapshot) => {
                //converte cada documento em um objeto com id e os dados e guarda no estado users
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

    const updateUser = useCallback(async (userId, newRole) => {
        await updateDoc(doc(db, "users", userId), { role: newRole }); // localiza o documento e aplica o novo cargo
    }, []);

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

    const value = useMemo(()=>({
        loadingUsers,
        users,
        updateUser,
        deleteUser,
    }), 
    [
        loadingUsers,
        users,
        updateUser,
        deleteUser,
    ]);

    return (
        <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
    );
};
