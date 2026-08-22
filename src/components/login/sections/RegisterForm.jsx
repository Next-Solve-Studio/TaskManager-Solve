"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUser } from "react-icons/ai";
import { FaArrowLeft, FaBuilding, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { IoMdLock } from "react-icons/io";
import { MdCheck, MdContentCopy, MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebaseConfig";
import { muiDark } from "@/styles/StyleInputs";
import { FormatDocument } from "@/utils/FormatCnpj/CPF";
import PlanSelector from "./PlanSelector";

const schema = yup
    .object({
        companyName: yup
            .string()
            .min(3, "Mínimo 3 caracteres")
            .required("Obrigatório"),
        cnpj: yup
            .string()
            .min(1, "CPF/CNPJ é obrigatório")
            .required("Obrigatório"),
        name: yup
            .string()
            .min(3, "Mínimo 3 caracteres")
            .required("Obrigatório"),
        email: yup.string().email("E-mail inválido").required("Obrigatório"),
        password: yup
            .string()
            .min(6, "Mínimo 6 caracteres")
            .required("Obrigatório"),
        endereco: yup.string().optional(),
    })
    .required();

function PixSuccess({ pixData, appKey, onRenew }) {
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

    // Reseta o timer quando chega um QR Code novo
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
        if (!window.confirm("Tem certeza? Isso vai excluir seu cadastro e você precisará se cadastrar novamente.")) return;
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
                        <img
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

            <button type="button" onClick={handleCancel} disabled={cancelling}
                className="text-xs text-text-muted hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
            >
                {cancelling ? "Cancelando..." : "Cancelar cadastro"}
            </button>
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
    const [pixAppKey, setPixAppKey] = useState(null);
    

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const isFreePlan = selectedPlan === "FREE";
    const changeStep = (n) => {
        setStep(n);
        onStepChange?.(n);
    };

    async function doRegister(data) {
        setLoading(true);
        try {
            const appKey = await registerCompany(
                data.companyName,
                data.name,
                data.email,
                data.password,
                selectedPlan,
                data.cnpj,
                data.endereco || "",
            );

            if (!isFreePlan && appKey) {
                const token = await auth.currentUser?.getIdToken();
                if (!token)
                    throw new Error("Erro de autenticação após registro.");

                const cpfCnpjRaw = data.cnpj.replace(/\D/g, "");

                const setupRes = await fetch("/api/billing/setup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        appKey,
                        name: data.name,
                        email: data.email,
                        cpfCnpj: cpfCnpjRaw,
                    }),
                });
                if (!setupRes.ok) {
                    const e = await setupRes.json();
                    throw new Error(e.error || "Erro ao configurar pagamento.");
                }

                const subRes = await fetch("/api/billing/subscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        appKey,
                        plan: selectedPlan,
                        billingType: "PIX",
                    }),
                });
                const subData = await subRes.json();
                if (!subRes.ok)
                    throw new Error(
                        subData.error || "Erro ao criar assinatura.",
                    );

                if (subData.pixInfo) {
                    setPixAppKey(appKey);
                    setPixData(subData.pixInfo);
                    return;
                }
            }

            toast.success("Empresa cadastrada com sucesso!", {
                description: "Bem-vindo ao TaskManager!",
            });
        } catch (error) {
            toast.error(error.message || "Erro ao cadastrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function handlePixRenew() {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Sessão expirada. Recarregue a página.");

        await fetch("/api/billing/subscribe", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ appKey: pixAppKey }),
        });

        const subRes = await fetch("/api/billing/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                appKey: pixAppKey,
                plan: selectedPlan,
                billingType: "PIX",
            }),
        });
        const subData = await subRes.json();
        if (!subRes.ok)
            throw new Error(subData.error || "Erro ao criar nova assinatura.");
        if (!subData.pixInfo)
            throw new Error("QR Code não disponível. Tente novamente.");

        setPixData(subData.pixInfo);
    }

    async function onCompanyDataSubmit(data) {
        if (isFreePlan) {
            await doRegister(data);
            return;
        }

        setLoading(true);
        try {
            const cpfCnpjRaw = data.cnpj.replace(/\D/g, "");
            const res = await fetch(
                `/api/check-cpf-availability?cpfCnpj=${encodeURIComponent(cpfCnpjRaw)}&plan=${selectedPlan}`,
            );
            const result = await res.json();

            if (!res.ok || !result.available) {
                toast.error(
                    result.message ||
                        result.error ||
                        "Não foi possível continuar com esse CPF/CNPJ.",
                );
                return;
            }

            setSavedFormData(data);
            changeStep(3);
        } catch (error) {
            console.log(error);
            toast.error("Erro ao verificar CPF/CNPJ. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    if (pixData)
        return (
            <PixSuccess
                pixData={pixData}
                appKey={pixAppKey}
                onRenew={handlePixRenew}
            />
        );

    if (step === 1) {
        return (
            <div className="flex flex-col gap-6 w-full">
                <div className="w-full">
                    <PlanSelector
                        selected={selectedPlan}
                        onSelect={setSelectedPlan}
                    />
                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={() => changeStep(2)}
                            className="h-12 w-full max-w-85 mx-auto rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r bg-brand-600 hover:bg-brand-700 shadow-[0_4px_24px_rgba(26,215,111,0.25)] cursor-pointer transition-all duration-150 text-shadow-lg"
                        >
                            Continuar com{" "}
                            {selectedPlan === "FREE"
                                ? "Trial Grátis"
                                : `Plano ${selectedPlan}`}
                        </button>
                        <button
                            type="button"
                            className="text-sm text-text-muted w-full max-w-45 mx-auto hover:text-brand-500 transition-colors duration-150 text-center cursor-pointer"
                            onClick={() => setHaveAccount(true)}
                        >
                            Já tem uma conta?{" "}
                            <span className="text-brand-500 font-semibold underline underline-offset-2">
                                Entrar
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="flex flex-col gap-5 w-full">
                <button
                    type="button"
                    onClick={() => changeStep(2)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                >
                    <FaArrowLeft size={10} /> Voltar — Dados da Empresa
                </button>

                <div>
                    <h2 className="text-xl font-black text-text-primary">
                        Pagamento via PIX
                    </h2>
                    <p className="text-sm text-text-muted">
                        Plano {selectedPlan} · R${" "}
                        {selectedPlan === "BASIC" ? "29,90" : "49,90"}/mês
                    </p>
                </div>

                <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-text-secondary leading-relaxed">
                    Clique no botão para gerar o QR Code PIX. Após o pagamento,
                    sua licença ativa automaticamente e você entra no sistema.
                </div>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => doRegister(savedFormData)}
                    className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <CircularProgress size={22} color="inherit" />
                    ) : (
                        <>
                            <FaPix size={16} /> Gerar QR Code PIX
                        </>
                    )}
                </button>
            </div>
        );
    }

    const documentValue = watch("documento");

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => changeStep(1)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                >
                    <FaArrowLeft size={10} /> Voltar — Plano {selectedPlan}
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                        <FaBuilding size={18} color="white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Nova Empresa
                    </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-text-primary">
                    Dados da Empresa
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(onCompanyDataSubmit)}
                className="flex flex-col gap-4"
            >
                <TextField
                    {...register("companyName")}
                    label="Nome da Empresa"
                    variant="outlined"
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                    sx={muiDark}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaBuilding
                                        color="var(--color-brand-500)"
                                        size={19}
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    {...register("name")}
                    label="Seu Nome (Administrador)"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={muiDark}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AiOutlineUser
                                        color="var(--color-brand-500)"
                                        size={19}
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    {...register("email")}
                    label="E-mail Corporativo"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={muiDark}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdOutlineEmail
                                        color="var(--color-brand-500)"
                                        size={19}
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <div className="relative flex items-center">
                    <TextField
                        {...register("password")}
                        label="Senha"
                        variant="outlined"
                        type={seePassword ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={muiDark}
                        className="w-full"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IoMdLock
                                            color="var(--color-brand-500)"
                                            size={19}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-3 text-text-muted hover:text-brand-500"
                        onClick={() => setSeePassword(!seePassword)}
                    >
                        {seePassword ? (
                            <FaEyeSlash size={18} />
                        ) : (
                            <FaEye size={18} />
                        )}
                    </button>
                </div>
                <TextField
                    {...register("cnpj")}
                    label="CPF/CNPJ"
                    variant="outlined"
                    error={!!errors.cnpj}
                    value={FormatDocument(documentValue)}
                    onChange={(e) => {
                        setValue("documento", FormatDocument(e.target.value), {
                            shouldValidate: true,
                        });
                    }}
                    helperText={
                        errors.cnpj?.message ??
                        "Obrigatório — verificação de uso do plano gratuito"
                    }
                    sx={muiDark}
                />
                <TextField
                    {...register("endereco")}
                    label="Endereço (Opcional)"
                    variant="outlined"
                    sx={muiDark}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                    {loading ? (
                        <CircularProgress size={22} color="inherit" />
                    ) : isFreePlan ? (
                        "Cadastrar Empresa"
                    ) : (
                        "Continuar para Pagamento"
                    )}
                </button>
            </form>
        </div>
    );
}
