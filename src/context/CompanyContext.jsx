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

    const { currentCompany } = useAuth();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentCompany?.id) {
            setCompany(null);
            setLoading(false);
            return;
        }

        const loadCompany = async () => {
            try {
                const companyDoc = await getDoc(doc(db, "companies", currentCompany.id));
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
    }, [currentCompany?.id]);

    const updateCompany = useCallback(
        async (data) => {
            if (!currentCompany?.id) return;

            try {
                await updateDoc(doc(db, "companies", currentCompany.id), {
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
        [currentCompany?.id]
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
