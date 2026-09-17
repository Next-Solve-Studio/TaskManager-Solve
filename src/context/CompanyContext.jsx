"use client"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const CompanyContext = createContext()

export const useCompany = () => {
    const context = useContext(CompanyContext);

    if (!context) {
        throw new Error("useCompany deve ser usado dentro de CompanyProvider");
    }
    return context;
};

export const CompanyProvider = ({children}) => {
    const {companyId } = useCurrentUser();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!companyId) {
                setCompany(null);
                setLoading(false);
                return;
            }

            const companyRef = doc(db, "companies", companyId);
            const unsubscribe = onSnapshot(
                companyRef,
                (snap) => {
                    setCompany(snap.exists() ? { id: snap.id, ...snap.data() } : null);
                    setLoading(false);
                },
                (error) => {
                    console.error("Erro ao carregar empresa:", error);
                    setLoading(false);
                },
            );
            return unsubscribe;
        }, [companyId]);

    const updateCompany = useCallback(
        async (data) => {
            if (!companyId) return;

            try {
                await updateDoc(doc(db, "companies", companyId), {
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
        [companyId]
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
