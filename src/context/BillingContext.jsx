"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { auth } from "@/lib/firebaseConfig";

const BillingContext = createContext()
export const useBilling = () => useContext(BillingContext)

export function BillingProvider({ children }) {
    const { companyId } = useCurrentUser();
    const [billingStatus, setBillingStatus] = useState(null)
    const [loading, setLoading] = useState(true)

    const getToken = useCallback(async () => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Não autenticado");
        return token;
    }, []);

    const fetchStatus = useCallback(async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch("/api/billing/status", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBillingStatus(await res.json());
        } catch (err) {
            console.error("Erro ao buscar billing:", err);
        } finally {
            setLoading(false);
        }
    }, [companyId, getToken]);

    useEffect(() => { if (companyId) fetchStatus(); }, [companyId, fetchStatus]);

    const setupCustomer = useCallback(async (data) => {
        const token = await getToken();
        const res = await fetch("/api/billing/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao configurar pagamento");
        return json;
    }, [getToken]);

    const subscribe = useCallback(async (data) => {
        const token = await getToken();
        const res = await fetch("/api/billing/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao criar assinatura");
        await fetchStatus();
        return json;
    }, [fetchStatus, getToken]);

    const cancelSubscription = useCallback(async () => {
        const token = await getToken();
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
        billingStatus, loading,
        fetchStatus, setupCustomer, subscribe, cancelSubscription,
    }), [billingStatus, loading, fetchStatus, setupCustomer, subscribe, cancelSubscription]);

    return (
        <BillingContext.Provider value={value}>
            {children}
        </BillingContext.Provider>
    );
}