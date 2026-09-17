"use client"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { doc, updateDoc } from "firebase/firestore";
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
            if (!currentUser?.companyId) {
                setCompany(null);
                setLoading(false);
                return;
            }

            const companyRef = doc(db, "companies", currentUser.companyId);
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
