"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebaseConfig";

const BillingContext = createContext()
export const useBilling = () => useContext(BillingContext)

export function BillingProvider({ children }) {
    const { currentUser } = useAuth()
    const [billingStatus, setBillingStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [appKey, setAppKey] = useState(null)

    useEffect(() => {
        if (!currentUser?.companyId) return
        getDoc(doc(db, "companies", currentUser.companyId)).then(snap => {
            if (snap.exists()) setAppKey(snap.data().appKey ?? null);
        });
    }, [currentUser?.companyId]);

    const getToken = useCallback(async () => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Não autenticado");
        return token;
    }, []);

    const fetchStatus = useCallback(async () => {
        if (!appKey) return;
        setLoading(true);
        try {
            const token = await getToken();
            // appKey removido da URL — servidor deriva do token
            const res = await fetch("/api/billing/status", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBillingStatus(await res.json());
        } catch (err) {
            console.error("Erro ao buscar billing:", err);
        } finally {
            setLoading(false);
        }
    }, [appKey, getToken]);

    useEffect(() => { if (appKey) fetchStatus(); }, [appKey, fetchStatus]);

    const setupCustomer = useCallback(async (data) => {
        const token = await getToken();
        const res = await fetch("/api/billing/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ appKey, ...data }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao configurar pagamento");
        return json;
    }, [appKey, getToken]);

    const subscribe = useCallback(async (data) => {
        const token = await getToken();
        const res = await fetch("/api/billing/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ appKey, ...data }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao criar assinatura");
        await fetchStatus();
        return json;
    }, [appKey, fetchStatus, getToken]);

    const cancelSubscription = useCallback(async () => {
        const token = await getToken();
        // appKey removido da URL — servidor deriva do token
        const res = await fetch("/api/billing/subscribe", {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao cancelar");
        await fetchStatus();
        return json;
    }, [fetchStatus, getToken]);

    const value = useMemo(() => ({
        billingStatus, loading, appKey,
        fetchStatus, setupCustomer, subscribe, cancelSubscription,
    }), [billingStatus, loading, appKey, fetchStatus, setupCustomer, subscribe, cancelSubscription]);

    return (
        <BillingContext.Provider value={value}>
            {children}
        </BillingContext.Provider>
    );
}