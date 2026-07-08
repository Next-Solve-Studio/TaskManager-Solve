"use client"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "./AuthContext";

const CompanyContext = createContext()

export const useCompany = () => {
    const context = useContext(CompanyContext);

    if (!context) {
        throw new Error("useCompany deve ser usado dentro de CompanyProvider");
    }
    return context;
};

export const CompanyProvider = ({children}) => {

    const { currentUser } = useAuth();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Agora buscamos a empresa baseada no companyId do usuário logado
        if (!currentUser?.companyId) {
            setCompany(null);
            setLoading(false);
            return;
        }

        const loadCompany = async () => {
            try {
                const companyDoc = await getDoc(doc(db, "companies", currentUser.companyId));
                if (companyDoc.exists()) {
                    setCompany({ id: companyDoc.id, ...companyDoc.data() });
                }
            } catch (error) {
                console.error("Erro ao carregar empresa:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCompany();
    }, [currentUser?.companyId]);

    const updateCompany = useCallback(
        async (data) => {
            if (!currentUser?.companyId) return;

            try {
                await updateDoc(doc(db, "companies", currentUser.companyId), {
                    ...data,
                    updatedAt: new Date(),
                });

                setCompany((prev) => ({
                    ...prev,
                    ...data,
                    updatedAt: new Date(),
                }));
            } catch (error) {
                console.error("Erro ao atualizar empresa:", error);
                throw error;
            }
        },
        [currentUser?.companyId]
    );

    const value = useMemo(
        () => ({
            company,
            loading,
            updateCompany,
        }),
        [company, loading, updateCompany]
    );

    return (
        <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
    );
};
