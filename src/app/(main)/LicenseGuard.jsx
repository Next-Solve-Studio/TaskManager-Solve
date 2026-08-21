"use client";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { FcLock } from "react-icons/fc";
import { IoMdWarning } from "react-icons/io";
import { FaPix } from "react-icons/fa6";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { useLicense } from "@/context/LicenseApiContext";
import { useBilling } from "@/context/BillingContext";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebaseConfig";

const SUPPORT_EMAIL = "equipe.nextsolvesolution@gmail.com";

function PixActivation() {
    const { setupCustomer, subscribe, cancelSubscription, appKey } = useBilling();
    const { currentUser } = useAuth();
    const [state, setState] = useState("idle"); // idle | loading | qr | success
    const [pixData, setPixData] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(300);
    const [copied, setCopied] = useState(false);
    const prevQrCode = useRef(null);
    const expired = secondsLeft <= 0;

    useEffect(() => {
        if (state !== "qr" || expired) return;
        const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearInterval(id);
    }, [state, expired]);

    useEffect(() => {
        if (pixData?.qrCode && pixData.qrCode !== prevQrCode.current) {
            prevQrCode.current = pixData.qrCode;
            setSecondsLeft(300);
        }
    }, [pixData]);

    useEffect(() => {
        if (state !== "qr" || !appKey) return;
        const poll = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;
                const res = await fetch(`/api/billing/status?appKey=${appKey}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.status === true) {
                    setState("success");
                    setTimeout(() => { window.location.href = "/"; }, 2000);
                }
            } catch { /* ignora */ }
        };
        const id = setInterval(poll, 5000);
        return () => clearInterval(id);
    }, [state, appKey]);

    const doSubscribe = async () => {
        const companySnap = await getDoc(doc(db, "companies", currentUser.companyId));
        const companyData = companySnap.data();
        const plan = companyData?.plan;
        const cpfCnpj = (companyData?.cnpj ?? "").replace(/\D/g, "");

        try { await cancelSubscription(); } catch { /* ignora se não existir */ }

        await setupCustomer({ name: currentUser.name, email: currentUser.email, cpfCnpj });

        const subData = await subscribe({ plan, billingType: "PIX" });
        if (!subData.pixInfo) throw new Error("QR Code não disponível. Tente novamente.");

        setPixData(subData.pixInfo);
        setState("qr");
    };

    const handleGenerate = async () => {
        setState("loading");
        try { await doSubscribe(); }
        catch (err) { toast.error(err.message || "Erro ao gerar QR Code."); setState("idle"); }
    };

    const handleRenew = async () => {
        setState("loading");
        try { await doSubscribe(); }
        catch (err) { toast.error(err.message || "Erro ao renovar QR Code."); setState("qr"); }
    };

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");
    const copy = () => {
        navigator.clipboard.writeText(pixData?.qrCode ?? "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (state === "success") return (
        <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center">
                <MdCheck size={24} className="text-brand-500" />
            </div>
            <p className="text-sm font-bold text-white">Pagamento confirmado!</p>
            <CircularProgress size={18} sx={{ color: "var(--color-brand-500)" }} />
        </div>
    );

    if (state === "idle" || state === "loading") return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={state === "loading" || !appKey}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer"
        >
            {state === "loading" ? <CircularProgress size={18} color="inherit" /> : <FaPix size={16} />}
            Completar Pagamento
        </button>
    );

    // state === "qr"
    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center gap-2 text-sm">
                <span className="text-white/60">Expira em:</span>
                <span className={`font-bold font-mono ${secondsLeft < 60 ? "text-red-400" : "text-brand-500"}`}>
                    {mm}:{ss}
                </span>
            </div>
            {!expired ? (
                <>
                    {pixData?.qrCodeImage && (
                        <img
                            src={`data:image/png;base64,${pixData.qrCodeImage}`}
                            alt="QR Code PIX"
                            className="w-40 h-40 rounded-2xl border-2 border-brand-500/30"
                        />
                    )}
                    <div className="w-full space-y-1 text-left">
                        <p className="text-xs text-white/50 font-semibold">Copia e Cola</p>
                        <div className="bg-white/5 rounded-xl p-3 text-[10px] text-white/60 break-all font-mono border border-white/10 max-h-20 overflow-auto">
                            {pixData?.qrCode}
                        </div>
                        <button type="button" onClick={copy}
                            className="flex items-center gap-2 text-sm font-semibold text-brand-500 hover:underline cursor-pointer"
                        >
                            {copied ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                            {copied ? "Copiado!" : "Copiar código PIX"}
                        </button>
                    </div>
                    <p className="text-xs text-white/40">Aguardando confirmação do pagamento...</p>
                </>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-white/60">QR Code expirado.</p>
                    <button type="button" onClick={handleRenew}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 cursor-pointer"
                    >
                        <FaPix size={14} /> Gerar novo QR Code
                    </button>
                </div>
            )}
        </div>
    );
}

export default function LicenseGuard({ children }) {
    const { license, loading } = useLicense();
    const { currentUser } = useAuth();

    if (loading) return null;

    if (!license) {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-[40px] max-w-md space-y-4">
                    <span className="text-4xl">⚠️</span>
                    <h2 className="text-yellow-400 text-xl font-black uppercase tracking-tight">
                        Serviço Indisponível
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Não foi possível verificar sua licença. Tente recarregar a página.
                        Se o problema persistir, entre em contato com o suporte.
                    </p>
                    <button
                        type="button"
                        onClick={() => globalThis.location.reload()}
                        className="px-6 py-2 rounded-xl font-bold text-white bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
                    >
                        Recarregar
                    </button>
                </div>
            </div>
        );
    }

    if (license.status === "EXPIRED" || license.status === "INACTIVE") {
        const isMaster = currentUser?.role === "master";
        const isPendingPayment = license.status === "INACTIVE";

        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] w-full max-w-md space-y-6 shadow-2xl shadow-red-500/5">
                    <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
                        <span className="text-4xl"><FcLock /></span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-red-400 text-2xl font-black uppercase tracking-tight">
                            {isPendingPayment ? "Conta Inativa" : "Licença Expirada"}
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            {isPendingPayment && isMaster
                                ? "Seu cadastro está aguardando confirmação do pagamento. Complete o PIX para ativar sua conta."
                                : isPendingPayment
                                    ? "Sua conta está inativa. Entre em contato com o administrador."
                                    : "Sua licença expirou. Renove para continuar usando o TaskManager."}
                        </p>
                    </div>

                    {isPendingPayment && isMaster ? (
                        <PixActivation />
                    ) : (
                        <a
                            href={`mailto:${SUPPORT_EMAIL}?subject=Renovação de Licença`}
                            className="inline-block px-6 py-3 rounded-xl font-bold text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)]"
                        >
                            Entrar em Contato
                        </a>
                    )}
                    <p className="text-xs text-text-muted">Suporte: {SUPPORT_EMAIL}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {license.status === "GRACE_PERIOD" && (
                <div className="w-full bg-orange-500/15 border-b border-orange-500/20 px-4 py-2 text-center">
                    <p className="text-orange-300 text-xs font-semibold">
                        <IoMdWarning className="text-warning" /> {license.warning}
                    </p>
                </div>
            )}
            {children}
        </>
    );
}