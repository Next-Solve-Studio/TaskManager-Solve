"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress, InputAdornment, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUser } from "react-icons/ai";
import { FaArrowLeft, FaBuilding, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { IoMdLock } from "react-icons/io";
import { MdCheck, MdContentCopy, MdCreditCard, MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { auth } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { muiDark } from "@/styles/StyleInputs";
import PlanSelector from "./PlanSelector";

const schema = yup.object({
    companyName: yup.string().min(3, "Mínimo 3 caracteres").required("Obrigatório"),
    cnpj: yup.string().min(1, "CPF/CNPJ é obrigatório").required("Obrigatório"),
    name: yup.string().min(3, "Mínimo 3 caracteres").required("Obrigatório"),
    email: yup.string().email("E-mail inválido").required("Obrigatório"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Obrigatório"),
    endereco: yup.string().optional(),
}).required();

function PixSuccess({ pixData }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(pixData.qrCode ?? "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="flex flex-col gap-5 w-full">
            <div>
                <h2 className="text-xl font-black text-text-primary">Pagamento PIX</h2>
                <p className="text-sm text-text-muted">Escaneie ou copie o código para ativar sua licença</p>
            </div>
            <div className="flex flex-col gap-4 items-start">
                {pixData.qrCodeImage && (
                    <img src={`data:image/png;base64,${pixData.qrCodeImage}`} alt="QR Code PIX"
                        className="w-40 h-40 rounded-xl border border-border-main mx-auto" />
                )}
                <div className="w-full space-y-2">
                    <p className="text-xs text-text-muted">Código Copia e Cola</p>
                    <div className="bg-bg-surface rounded-xl p-3 text-[11px] text-text-secondary break-all font-mono border border-border-main max-h-20 overflow-auto">
                        {pixData.qrCode}
                    </div>
                    <button type="button" onClick={copy}
                        className="flex items-center gap-2 text-xs text-brand-500 hover:underline cursor-pointer"
                    >
                        {copied ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                        {copied ? "Copiado!" : "Copiar código PIX"}
                    </button>
                </div>
            </div>
            <p className="text-xs text-text-muted text-center">
                Sua licença ativa automaticamente após o pagamento.
            </p>
        </div>
    );
}

export default function RegisterForm({ setHaveAccount, onStepChange }) {
    const { registerCompany } = useAuth();
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState("FREE");
    const [savedFormData, setSavedFormData] = useState(null);
    const [pixData, setPixData] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("PIX");
    const [card, setCard] = useState({ holderName: "", number: "", expiryMonth: "", expiryYear: "", ccv: "" });
    const [cardHolder, setCardHolder] = useState({ postalCode: "", addressNumber: "" });

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

    const isFreePlan = selectedPlan === "FREE";

    const changeStep = (n) => { setStep(n); onStepChange?.(n); };

    async function doRegister(data, payMethod) {
        setLoading(true);
        try {
            const appKey = await registerCompany(
                data.companyName, data.name, data.email, data.password,
                selectedPlan, data.cnpj, data.endereco || ""
            );

            if (!isFreePlan && appKey) {
                const token = await auth.currentUser?.getIdToken();
                if (!token) throw new Error("Erro de autenticação após registro.");

                const cpfCnpjRaw = data.cnpj.replace(/\D/g, "");

                const setupRes = await fetch("/api/billing/setup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ appKey, name: data.name, email: data.email, cpfCnpj: cpfCnpjRaw }),
                });
                if (!setupRes.ok) {
                    const e = await setupRes.json();
                    throw new Error(e.error || "Erro ao configurar pagamento.");
                }

                const subPayload = { appKey, plan: selectedPlan, billingType: payMethod };
                if (payMethod === "CREDIT_CARD") {
                    subPayload.creditCard = {
                        holderName: card.holderName,
                        number: card.number.replace(/\s/g, ""),
                        expiryMonth: card.expiryMonth,
                        expiryYear: card.expiryYear,
                        ccv: card.ccv,
                    };
                    subPayload.creditCardHolderInfo = {
                        name: data.name,
                        email: data.email,
                        cpfCnpj: cpfCnpjRaw,
                        postalCode: cardHolder.postalCode.replace(/\D/g, ""),
                        addressNumber: cardHolder.addressNumber,
                    };
                }

                const subRes = await fetch("/api/billing/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(subPayload),
                });
                const subData = await subRes.json();
                if (!subRes.ok) throw new Error(subData.error || "Erro ao criar assinatura.");

                if (payMethod === "PIX" && subData.pixInfo) {
                    setPixData(subData.pixInfo);
                    toast.success("Empresa cadastrada! Efetue o pagamento via PIX.");
                    return;
                }

                toast.success("Plano ativado com sucesso!", { description: "Bem-vindo ao TaskManager!" });
                return;
            }

            toast.success("Empresa cadastrada com sucesso!", { description: "Bem-vindo ao TaskManager!" });
        } catch (error) {
            toast.error(error.message || "Erro ao cadastrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function onCompanyDataSubmit(data) {
        if (isFreePlan) {
            await doRegister(data, null);
        } else {
            setSavedFormData(data);
            changeStep(3);
        }
    }

    async function onPaymentSubmit() {
        if (paymentMethod === "CREDIT_CARD") {
            if (!card.holderName || !card.number || !card.expiryMonth || !card.expiryYear || !card.ccv) {
                toast.error("Preencha todos os dados do cartão"); return;
            }
            if (!cardHolder.postalCode || !cardHolder.addressNumber) {
                toast.error("Preencha CEP e número do endereço"); return;
            }
        }
        await doRegister(savedFormData, paymentMethod);
    }

    if (pixData) return <PixSuccess pixData={pixData} />;

    if (step === 1) {
        return (
            <div className="flex flex-col gap-6 w-full">
                <div className="w-full">
                    <PlanSelector selected={selectedPlan} onSelect={setSelectedPlan} />
                    <div className="flex flex-col gap-3">
                        <button type="button" onClick={() => changeStep(2)}
                            className="h-12 w-full max-w-85 mx-auto rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r bg-brand-600 hover:bg-brand-700 shadow-[0_4px_24px_rgba(26,215,111,0.25)] cursor-pointer transition-all duration-150 text-shadow-lg"
                        >
                            Continuar com {selectedPlan === "FREE" ? "Trial Grátis" : `Plano ${selectedPlan}`}
                        </button>
                        <button type="button"
                            className="text-sm text-text-muted w-full max-w-45 mx-auto hover:text-brand-500 transition-colors duration-150 text-center cursor-pointer"
                            onClick={() => setHaveAccount(true)}
                        >
                            Já tem uma conta?{" "}
                            <span className="text-brand-500 font-semibold underline underline-offset-2">Entrar</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="flex flex-col gap-5 w-full">
                <button type="button" onClick={() => changeStep(2)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                >
                    <FaArrowLeft size={10} /> Voltar — Dados da Empresa
                </button>
                <div>
                    <h2 className="text-xl font-black text-text-primary">Forma de Pagamento</h2>
                    <p className="text-sm text-text-muted">Plano {selectedPlan} — ativa após confirmação do pagamento</p>
                </div>

                <ToggleButtonGroup exclusive value={paymentMethod}
                    onChange={(_, v) => { if (v) setPaymentMethod(v); }} sx={{ gap: 1 }}
                >
                    {[
                        { value: "PIX", icon: <FaPix size={14} />, label: "PIX" },
                        { value: "CREDIT_CARD", icon: <MdCreditCard size={16} />, label: "Cartão de Crédito" },
                    ].map(({ value, icon, label }) => (
                        <ToggleButton key={value} value={value} sx={{
                            borderRadius: "10px !important",
                            border: "1px solid var(--color-border-main) !important",
                            color: "var(--color-text-secondary)",
                            "&.Mui-selected": {
                                backgroundColor: "rgba(26,215,111,0.1)",
                                color: "var(--color-brand-500)",
                                borderColor: "var(--color-brand-500) !important",
                            },
                            textTransform: "none", px: 2, gap: 1, fontSize: 13,
                        }}>
                            {icon} {label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {paymentMethod === "CREDIT_CARD" && (
                    <div className="flex flex-col gap-3">
                        <TextField label="Nome no cartão" value={card.holderName}
                            onChange={e => setCard(c => ({ ...c, holderName: e.target.value }))} sx={muiDark} />
                        <TextField
                            label="Número do cartão"
                            value={card.number}
                            onChange={e => {
                                const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                                setCard(c => ({ ...c, number: v.replace(/(.{4})/g, "$1 ").trim() }));
                            }}
                            placeholder="0000 0000 0000 0000" sx={muiDark}
                        />
                        <div className="grid grid-cols-3 gap-3">
                            <TextField label="Mês" placeholder="MM" value={card.expiryMonth}
                                onChange={e => setCard(c => ({ ...c, expiryMonth: e.target.value.replace(/\D/g, "").slice(0, 2) }))} sx={muiDark} />
                            <TextField label="Ano" placeholder="AAAA" value={card.expiryYear}
                                onChange={e => setCard(c => ({ ...c, expiryYear: e.target.value.replace(/\D/g, "").slice(0, 4) }))} sx={muiDark} />
                            <TextField label="CVV" placeholder="123" value={card.ccv}
                                onChange={e => setCard(c => ({ ...c, ccv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} sx={muiDark} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <TextField label="CEP" placeholder="00000-000" value={cardHolder.postalCode}
                                onChange={e => setCardHolder(h => ({ ...h, postalCode: e.target.value }))} sx={muiDark} />
                            <TextField label="Número" placeholder="123" value={cardHolder.addressNumber}
                                onChange={e => setCardHolder(h => ({ ...h, addressNumber: e.target.value }))} sx={muiDark} />
                        </div>
                    </div>
                )}

                {paymentMethod === "PIX" && (
                    <div className="rounded-xl border border-border-main bg-bg-card p-4 text-sm text-text-secondary">
                        Após o cadastro você receberá um QR Code PIX. Sua licença ativa automaticamente quando o pagamento for identificado.
                    </div>
                )}

                <button type="button" disabled={loading} onClick={onPaymentSubmit}
                    className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                    {loading
                        ? <CircularProgress size={22} color="inherit" />
                        : <>{paymentMethod === "PIX" ? <FaPix size={16} /> : <MdCreditCard size={17} />} Cadastrar e Ativar Plano {selectedPlan}</>
                    }
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
                <button type="button" onClick={() => changeStep(1)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                >
                    <FaArrowLeft size={10} /> Voltar — Plano {selectedPlan}
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                        <FaBuilding size={18} color="white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Nova Empresa</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-text-primary">Dados da Empresa</h2>
            </div>

            <form onSubmit={handleSubmit(onCompanyDataSubmit)} className="flex flex-col gap-4">
                <TextField {...register("companyName")} label="Nome da Empresa" variant="outlined"
                    error={!!errors.companyName} helperText={errors.companyName?.message} sx={muiDark}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><FaBuilding color="var(--color-brand-500)" size={19} /></InputAdornment> } }}
                />
                <TextField {...register("name")} label="Seu Nome (Administrador)" variant="outlined"
                    error={!!errors.name} helperText={errors.name?.message} sx={muiDark}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><AiOutlineUser color="var(--color-brand-500)" size={19} /></InputAdornment> } }}
                />
                <TextField {...register("email")} label="E-mail Corporativo" variant="outlined"
                    error={!!errors.email} helperText={errors.email?.message} sx={muiDark}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><MdOutlineEmail color="var(--color-brand-500)" size={19} /></InputAdornment> } }}
                />
                <div className="relative flex items-center">
                    <TextField {...register("password")} label="Senha" variant="outlined"
                        type={seePassword ? "text" : "password"}
                        error={!!errors.password} helperText={errors.password?.message}
                        sx={muiDark} className="w-full"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><IoMdLock color="var(--color-brand-500)" size={19} /></InputAdornment> } }}
                    />
                    <button type="button" className="absolute right-3 text-text-muted hover:text-brand-500"
                        onClick={() => setSeePassword(!seePassword)}
                    >
                        {seePassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                </div>
                <TextField {...register("cnpj")} label="CPF/CNPJ" variant="outlined"
                    error={!!errors.cnpj}
                    helperText={errors.cnpj?.message ?? "Obrigatório — verificação de uso do plano gratuito"}
                    sx={muiDark}
                />
                <TextField {...register("endereco")} label="Endereço (Opcional)" variant="outlined" sx={muiDark} />

                <button type="submit" disabled={loading}
                    className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                    {loading
                        ? <CircularProgress size={22} color="inherit" />
                        : isFreePlan ? "Cadastrar Empresa" : "Continuar para Pagamento"
                    }
                </button>
            </form>
        </div>
    );
}