"use client";
import { useState, useEffect } from "react";
import {
    Alert, Button, Chip, CircularProgress,
    TextField, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import { FaPix } from "react-icons/fa6";
import { MdCheck, MdContentCopy, MdCreditCard } from "react-icons/md";
import { toast } from "sonner";
import { useBilling } from "@/context/BillingContext";
import { useAuth } from "@/context/AuthContext";

const PLANS = {
    BASIC: { label: "Basic", price: "R$ 29,90/mês" },
    PRO:   { label: "Pro",   price: "R$ 49,90/mês" },
};

const muiField = {
    "& .MuiOutlinedInput-root": {
        color: "var(--color-text-primary)",
        backgroundColor: "var(--color-border-subtle)",
        borderRadius: "12px",
        "& fieldset": { borderColor: "var(--color-border-main)" },
        "&:hover fieldset": { borderColor: "rgba(var(--color-brand-500-rgb),0.3)" },
        "&.Mui-focused fieldset": { borderColor: "var(--color-brand-500)" },
    },
    "& .MuiInputLabel-root": { color: "var(--color-text-muted)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-brand-500)" },
};

function PixDisplay({ pixData, appKey, onRefresh }) {
    const [copied, setCopied] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(300);
    const [refreshing, setRefreshing] = useState(false);
    const expired = secondsLeft <= 0;

    useEffect(() => {
        if (expired) return;
        const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearInterval(id);
    }, [expired]);

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
            await onRefresh();
            setSecondsLeft(300);
        } catch {
            toast.error("Erro ao atualizar QR Code.");
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="p-5 bg-bg-card border border-border-main rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-text-primary">Pagamento PIX Pendente</p>
                {!expired ? (
                    <span className={`text-xs font-bold font-mono ${secondsLeft < 60 ? "text-red-400" : "text-brand-500"}`}>
                        Expira em {mm}:{ss}
                    </span>
                ) : (
                    <button type="button" onClick={handleRefresh} disabled={refreshing}
                        className="flex items-center gap-1 text-xs text-brand-500 hover:underline cursor-pointer font-bold disabled:opacity-50"
                    >
                        {refreshing ? <CircularProgress size={12} sx={{ color: "inherit" }} /> : <FaPix size={12} />}
                        Gerar novo
                    </button>
                )}
            </div>
            <p className="text-xs text-text-secondary">
                Valor: R$ {pixData.value?.toFixed(2).replace(".", ",")} · Vence em{" "}
                {new Date(pixData.dueDate).toLocaleDateString("pt-BR")}
            </p>
            {!expired && (
                <div className="flex flex-col md:flex-row gap-5 items-start">
                    {pixData.qrCodeImage && (
                        <img
                            src={`data:image/png;base64,${pixData.qrCodeImage}`}
                            alt="QR Code PIX"
                            className="w-40 h-40 rounded-xl border border-border-main"
                        />
                    )}
                    <div className="flex-1 space-y-2">
                        <p className="text-xs text-text-muted">Código PIX Copia e Cola</p>
                        <div className="bg-bg-surface rounded-xl p-3 text-[11px] text-text-secondary break-all font-mono border border-border-main max-h-20 overflow-auto">
                            {pixData.qrCode}
                        </div>
                        <Button variant="outlined" size="small"
                            startIcon={copied ? <MdCheck /> : <MdContentCopy />}
                            onClick={copy}
                            sx={{
                                borderColor: "var(--color-brand-500)",
                                color: "var(--color-brand-500)",
                                borderRadius: "8px", textTransform: "none", fontSize: 12,
                            }}
                        >
                            {copied ? "Copiado!" : "Copiar código"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BillingSettings() {
    const { billingStatus, loading, setupCustomer, subscribe, cancelSubscription } = useBilling();
    const { currentUser } = useAuth();

    const [view, setView] = useState("loading"); // loading | info | form | pixqr
    const [paymentMethod, setPaymentMethod] = useState("PIX");
    const [selectedPlan, setSelectedPlan] = useState("BASIC");
    const [submitting, setSubmitting] = useState(false);
    const [pixData, setPixData] = useState(null);

    const [cpfCnpj, setCpfCnpj] = useState("");
    const [phone, setPhone] = useState("");
    const [card, setCard] = useState({ holderName: "", number: "", expiryMonth: "", expiryYear: "", ccv: "" });
    const [cardHolder, setCardHolder] = useState({ postalCode: "", addressNumber: "" });

    useEffect(() => {
        if (loading) { setView("loading"); return; }
        if (billingStatus?.hasSubscription) {
            if (billingStatus.pixInfo) setPixData(billingStatus.pixInfo);
            setView("info");
        } else {
            setView("form");
        }
    }, [billingStatus, loading]);

    const handleSubscribe = async () => {
        const rawDoc = cpfCnpj.replace(/\D/g, "");
        if (!rawDoc) { toast.error("Informe o CPF ou CNPJ"); return; }

        setSubmitting(true);
        try {
            if (!billingStatus?.hasCustomer) {
                await setupCustomer({
                    name: currentUser.name,
                    email: currentUser.email,
                    cpfCnpj: rawDoc,
                    phone: phone.replace(/\D/g, "") || undefined,
                });
            }

            const payload = { plan: selectedPlan, billingType: paymentMethod };

            if (paymentMethod === "CREDIT_CARD") {
                if (!card.holderName || !card.number || !card.expiryMonth || !card.expiryYear || !card.ccv) {
                    toast.error("Preencha todos os dados do cartão");
                    setSubmitting(false);
                    return;
                }
                if (!cardHolder.postalCode || !cardHolder.addressNumber) {
                    toast.error("Preencha CEP e número do endereço");
                    setSubmitting(false);
                    return;
                }
                payload.creditCard = {
                    holderName: card.holderName,
                    number: card.number.replace(/\s/g, ""),
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear,
                    ccv: card.ccv,
                };
                payload.creditCardHolderInfo = {
                    name: currentUser.name,
                    email: currentUser.email,
                    cpfCnpj: rawDoc,
                    postalCode: cardHolder.postalCode.replace(/\D/g, ""),
                    addressNumber: cardHolder.addressNumber,
                    phone: phone.replace(/\D/g, "") || undefined,
                };
            }

            const result = await subscribe(payload);

            if (paymentMethod === "PIX" && result.pixInfo) {
                setPixData(result.pixInfo);
                setView("pixqr");
                toast.success("Assinatura criada! Efetue o pagamento via PIX.");
            } else {
                toast.success("Assinatura criada com sucesso!");
                setView("info");
            }
        } catch (err) {
            toast.error(err.message || "Erro ao criar assinatura");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;
        setSubmitting(true);
        try {
            await cancelSubscription();
            toast.success("Assinatura cancelada.");
        } catch (err) {
            toast.error(err.message || "Erro ao cancelar");
        } finally {
            setSubmitting(false);
        }
    };

    if (view === "loading") {
        return (
            <div className="flex items-center justify-center py-16">
                <CircularProgress size={32} sx={{ color: "var(--color-brand-500)" }} />
            </div>
        );
    }

    if (view === "info") {
        const planLabel = { FREE: "Free", BASIC: "Basic", PRO: "Pro" }[billingStatus?.plan] ?? billingStatus?.plan;
        const expiresAt = billingStatus?.expiresAt
            ? new Date(billingStatus.expiresAt).toLocaleDateString("pt-BR")
            : "-";

        return (
            <div className="space-y-6">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Assinatura</label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Plano", value: planLabel },
                        { label: "Método", value: billingStatus?.paymentMethod === "CREDIT_CARD" ? "Cartão de Crédito" : "PIX" },
                        { label: "Expira em", value: expiresAt },
                    ].map(({ label, value }) => (
                        <div key={label} className="p-4 bg-bg-card border border-border-main rounded-2xl">
                            <p className="text-xs text-text-muted mb-1">{label}</p>
                            <p className="text-base font-bold text-text-primary">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Status:</span>
                    <Chip
                        label={billingStatus?.status ? "Ativo" : "Inativo"}
                        size="small"
                        sx={{
                            backgroundColor: billingStatus?.status ? "rgba(26,215,111,0.15)" : "rgba(239,68,68,0.15)",
                            color: billingStatus?.status ? "var(--color-brand-500)" : "#ef4444",
                            fontWeight: 700, fontSize: 11,
                        }}
                    />
                </div>

                {pixData && (
                    <PixDisplay
                        pixData={pixData}
                        onRefresh={fetchStatus}
                    />
                )}

                <div className="pt-2">
                    <Button
                        variant="outlined"
                        color="error"
                        disabled={submitting}
                        onClick={handleCancel}
                        sx={{ textTransform: "none", borderRadius: "10px", fontSize: 13 }}
                    >
                        {submitting ? <CircularProgress size={16} /> : "Cancelar Assinatura"}
                    </Button>
                </div>
            </div>
        );
    }

    if (view === "pixqr" && pixData) {
        return (
            <div className="space-y-5 max-w-md">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Pagamento PIX</label>
                <Alert severity="info" sx={{ borderRadius: "12px", fontSize: 13 }}>
                    Escaneie o QR Code ou copie o código. Sua licença ativa automaticamente após o pagamento.
                </Alert>
                <PixDisplay pixData={pixData} />
            </div>
        );
    }

    // FORM
    return (
        <div className="space-y-8 max-w-lg">
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Escolha seu Plano</label>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(PLANS).map(([key, p]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedPlan(key)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                                selectedPlan === key
                                    ? "border-brand-500 bg-brand-500/10"
                                    : "border-border-main bg-bg-card hover:border-brand-500/40"
                            }`}
                        >
                            <p className="font-bold text-text-primary">{p.label}</p>
                            <p className="text-sm text-text-secondary">{p.price}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-border-main" />

            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Forma de Pagamento</label>
                <ToggleButtonGroup
                    exclusive
                    value={paymentMethod}
                    onChange={(_, v) => { if (v) setPaymentMethod(v); }}
                    sx={{ gap: 1 }}
                >
                    {[
                        { value: "PIX", icon: <FaPix size={15} />, label: "PIX" },
                        { value: "CREDIT_CARD", icon: <MdCreditCard size={17} />, label: "Cartão de Crédito" },
                    ].map(({ value, icon, label }) => (
                        <ToggleButton
                            key={value}
                            value={value}
                            sx={{
                                borderRadius: "10px !important",
                                border: "1px solid var(--color-border-main) !important",
                                color: "var(--color-text-secondary)",
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(26,215,111,0.1)",
                                    color: "var(--color-brand-500)",
                                    borderColor: "var(--color-brand-500) !important",
                                },
                                textTransform: "none",
                                px: 2.5, gap: 1, fontSize: 13,
                            }}
                        >
                            {icon} {label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Dados para Faturamento</label>
                <div className="grid grid-cols-1 gap-3">
                    <TextField label="CPF ou CNPJ" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)}
                        placeholder="000.000.000-00" fullWidth sx={muiField} />
                    <TextField label="Telefone (opcional)" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999" fullWidth sx={muiField} />
                </div>
            </div>

            {paymentMethod === "CREDIT_CARD" && (
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Dados do Cartão</label>
                    <div className="grid grid-cols-1 gap-3">
                        <TextField label="Nome no cartão" value={card.holderName}
                            onChange={e => setCard(c => ({ ...c, holderName: e.target.value }))} fullWidth sx={muiField} />
                        <TextField
                            label="Número do cartão"
                            value={card.number}
                            onChange={e => {
                                const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                                setCard(c => ({ ...c, number: v.replace(/(.{4})/g, "$1 ").trim() }));
                            }}
                            placeholder="0000 0000 0000 0000"
                            fullWidth sx={muiField}
                        />
                        <div className="grid grid-cols-3 gap-3">
                            <TextField label="Mês" placeholder="MM" value={card.expiryMonth}
                                onChange={e => setCard(c => ({ ...c, expiryMonth: e.target.value.replace(/\D/g,"").slice(0,2) }))} sx={muiField} />
                            <TextField label="Ano" placeholder="AAAA" value={card.expiryYear}
                                onChange={e => setCard(c => ({ ...c, expiryYear: e.target.value.replace(/\D/g,"").slice(0,4) }))} sx={muiField} />
                            <TextField label="CVV" placeholder="123" value={card.ccv}
                                onChange={e => setCard(c => ({ ...c, ccv: e.target.value.replace(/\D/g,"").slice(0,4) }))} sx={muiField} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <TextField label="CEP" placeholder="00000-000" value={cardHolder.postalCode}
                                onChange={e => setCardHolder(h => ({ ...h, postalCode: e.target.value }))} sx={muiField} />
                            <TextField label="Número" placeholder="123" value={cardHolder.addressNumber}
                                onChange={e => setCardHolder(h => ({ ...h, addressNumber: e.target.value }))} sx={muiField} />
                        </div>
                    </div>
                </div>
            )}

            <Button
                fullWidth
                variant="contained"
                disabled={submitting}
                onClick={handleSubscribe}
                startIcon={submitting
                    ? <CircularProgress size={16} sx={{ color: "inherit" }} />
                    : paymentMethod === "PIX" ? <FaPix /> : <MdCreditCard />}
                sx={{
                    backgroundColor: "var(--color-brand-500)",
                    "&:hover": { backgroundColor: "var(--color-brand-600)" },
                    "&.Mui-disabled": { backgroundColor: "var(--color-border-subtle)", color: "var(--color-text-muted)" },
                    borderRadius: "12px", py: 1.5, textTransform: "none", fontWeight: 700, fontSize: "0.9rem",
                }}
            >
                {submitting ? "Processando..." : `Assinar com ${paymentMethod === "PIX" ? "PIX" : "Cartão de Crédito"}`}
            </Button>
        </div>
    );
}