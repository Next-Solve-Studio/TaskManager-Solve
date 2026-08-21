"use client"
import { createContext, useCallback, useContext, useEffect, useState} from 'react'
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebaseConfig";

const BillingContext = createContext()
export const useBilling = () => useContext(BillingContext)

export function BillingProvider ({ children }) {
    const {currentUser} = useAuth()
    const [billingStatus, setBillingStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [appKey, setAppKey] = useState(null)

    useEffect(()=> {
        if (!currentUser?.companyId) return
        getDoc(doc(db, "companies", currentUser.companyId)).then(snap => {
            if (snap.exists()) setAppKey(snap.data().appKey ?? null);
        });
    }, [currentUser?.companyId]);
    
    const getToken = async () => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Não autenticado");
        return token;
    };

    const fetchStatus = useCallback(async () => {
        if (!appKey) return;
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`/api/billing/status?appKey=${appKey}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBillingStatus(await res.json());
        } catch (err) {
            console.error("Erro ao buscar billing:", err);
        } finally {
            setLoading(false);
        }
    }, [appKey]);

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
    }, [appKey]);

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
    }, [appKey, fetchStatus]);

    const cancelSubscription = useCallback(async () => {
        const token = await getToken();
        const res = await fetch(`/api/billing/subscribe?appKey=${appKey}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro ao cancelar");
        await fetchStatus();
        return json;
    }, [appKey, fetchStatus]);

    return (
        <BillingContext.Provider value={{ billingStatus, loading, appKey, fetchStatus, setupCustomer, subscribe, cancelSubscription }}>
            {children}
        </BillingContext.Provider>
    );
}