"use client"
import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IoMdWarning } from "react-icons/io";
import {
    MdCheck
} from "react-icons/md";
import { auth } from "@/lib/firebaseConfig";

export default function CardConfirmation({ appKey }) {
    const [status, setStatus] = useState("processing"); // processing | success | pending
    const attemptsRef = useRef(0);

    useEffect(() => {
        if (!appKey) return;
        const poll = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;
                const res = await fetch(
                    `/api/billing/status?appKey=${appKey}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const data = await res.json();
                if (data.status === true) {
                    setStatus("success");
                    clearInterval(id);
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                    return;
                }
                attemptsRef.current += 1;
                if (attemptsRef.current >= 6) {
                    setStatus("pending");
                    clearInterval(id);
                }
            } catch {
                /* ignora */
            }
        };
        const id = setInterval(poll, 5000);
        poll();
        return () => clearInterval(id);
    }, [appKey]);

    if (status === "success")
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center">
                    <MdCheck size={28} className="text-brand-500" />
                </div>
                <p className="text-base font-bold text-text-primary">
                    Pagamento confirmado!
                </p>
                <p className="text-sm text-text-muted">
                    Redirecionando para o sistema...
                </p>
                <CircularProgress
                    size={20}
                    sx={{ color: "var(--color-brand-500)" }}
                />
            </div>
        );

    if (status === "pending")
        return (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
                <IoMdWarning className="text-3xl text-yellow-400" />
                <p className="text-base font-bold text-text-primary">
                    Pagamento em análise
                </p>
                <p className="text-sm text-text-muted">
                    Seu pagamento ainda está sendo processado pela operadora.
                    Assim que for confirmado, sua conta é ativada
                    automaticamente.
                </p>
            </div>
        );

    return (
        <div className="flex flex-col items-center gap-4 py-8">
            <CircularProgress
                size={28}
                sx={{ color: "var(--color-brand-500)" }}
            />
            <p className="text-sm text-text-muted">Confirmando pagamento...</p>
        </div>
    );
}