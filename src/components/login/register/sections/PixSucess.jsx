"use client"
import { CircularProgress} from "@mui/material";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaPix } from "react-icons/fa6";
import { auth } from "@/lib/firebaseConfig";
import {
    MdCheck,
    MdContentCopy,
} from "react-icons/md";
import { toast } from "sonner";

export default function PixSuccess({ pixData, appKey, onRenew }) {
    const [copied, setCopied] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(300);
    const [refreshing, setRefreshing] = useState(false);
    const [activated, setActivated] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const expired = secondsLeft <= 0;
    const prevQrCode = useRef(pixData?.qrCode);

    useEffect(() => {
        if (expired) return;
        const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [expired]);

    useEffect(() => {
        if (pixData?.qrCode && pixData.qrCode !== prevQrCode.current) {
            prevQrCode.current = pixData.qrCode;
            setSecondsLeft(300);
        }
    }, [pixData]);

    useEffect(() => {
        if (!appKey || activated) return;
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
                    setActivated(true);
                    toast.success(
                        "Pagamento confirmado! Entrando no sistema...",
                    );
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                }
            } catch {
                /* ignora */
            }
        };
        const id = setInterval(poll, 5000);
        return () => clearInterval(id);
    }, [appKey, activated]);

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");

    const copy = () => {
        navigator.clipboard.writeText(pixData.qrCode ?? "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await onRenew();
        } catch (err) {
            toast.error(err.message || "Erro ao gerar novo QR Code.");
        } finally {
            setRefreshing(false);
        }
    };

    const handleCancel = async () => {
        if (
            !window.confirm(
                "Tem certeza? Isso vai excluir seu cadastro e você precisará se cadastrar novamente.",
            )
        )
            return;
        setCancelling(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch("/api/billing/cancel-account", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao cancelar.");
            toast.success("Cadastro cancelado.");
            await signOut(auth);
            window.location.href = "/login";
        } catch (err) {
            toast.error(err.message || "Erro ao cancelar cadastro.");
            setCancelling(false);
        }
    };

    if (activated) {
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
    }

    return (
        <div className="flex flex-col gap-5 w-full">
            <div>
                <h2 className="text-xl font-black text-text-primary">
                    QR Code PIX
                </h2>
                <p className="text-sm text-text-muted">
                    Sua licença ativa automaticamente após o pagamento
                </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
                <span className="text-text-muted">Expira em:</span>
                <span
                    className={`font-bold font-mono ${secondsLeft < 60 ? "text-red-400" : "text-brand-500"}`}
                >
                    {mm}:{ss}
                </span>
            </div>

            {!expired ? (
                <div className="flex flex-col items-center gap-4">
                    {pixData.qrCodeImage && (
                        <Image
                            src={`data:image/png;base64,${pixData.qrCodeImage}`}
                            alt="QR Code PIX"
                            className="w-48 h-48 rounded-2xl border-2 border-brand-500/30"
                        />
                    )}
                    <div className="w-full space-y-2">
                        <p className="text-xs text-text-muted font-semibold">
                            Copia e Cola
                        </p>
                        <div className="bg-bg-surface rounded-xl p-3 text-[11px] text-text-secondary break-all font-mono border border-border-main max-h-24 overflow-auto">
                            {pixData.qrCode}
                        </div>
                        <button
                            type="button"
                            onClick={copy}
                            className="flex items-center gap-2 text-sm font-semibold text-brand-500 hover:underline cursor-pointer"
                        >
                            {copied ? (
                                <MdCheck size={16} />
                            ) : (
                                <MdContentCopy size={16} />
                            )}
                            {copied ? "Copiado!" : "Copiar código PIX"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                    <p className="text-sm text-text-secondary text-center">
                        QR Code expirado. Gere um novo.
                    </p>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="h-10 px-6 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                        {refreshing ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <FaPix size={14} />
                        )}
                        Gerar novo QR Code
                    </button>
                </div>
            )}

            {!expired && (
                <p className="text-xs text-text-muted text-center">
                    Aguardando confirmação do pagamento...
                </p>
            )}

            <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs text-text-muted hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
            >
                {cancelling ? "Cancelando..." : "Cancelar cadastro"}
            </button>
        </div>
    );
}