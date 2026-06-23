"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUser } from "react-icons/ai";
import { FaEye, FaEyeSlash, FaBuilding, FaArrowLeft } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { muiDark } from "@/styles/StyleInputs";
import PlanSelector from "./PlanSelector";

const schema = yup
    .object({
        companyName: yup
            .string()
            .min(3, "Mínimo 3 caracteres")
            .required("Obrigatório"),
        cnpj: yup.string().optional(),
        endereco: yup.string().optional(),
        name: yup
            .string()
            .min(3, "Mínimo 3 caracteres")
            .required("Obrigatório"),
        email: yup.string().email("E-mail inválido").required("Obrigatório"),
        password: yup
            .string()
            .min(6, "Mínimo 6 caracteres")
            .required("Obrigatório"),
    })
    .required();

export default function RegisterForm({ setHaveAccount }) {
    const { registerCompany } = useAuth();
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [step, setStep] = useState(1); // 1 = selecionar plano, 2 = dados
    const [selectedPlan, setSelectedPlan] = useState("FREE");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    async function onSubmit(data) {
        setLoading(true);
        try {
            await registerCompany(
                data.companyName,
                data.name,
                data.email,
                data.password,
                selectedPlan,
                data.cnpj || "",
                data.endereco || "",
            );
            toast.success("Empresa cadastrada com sucesso!", {
                description: "Bem-vindo ao TaskManager!",
            });
        } catch (error) {
            toast.error("Erro ao cadastrar. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // STEP 1 — Seleção de plano
    if (step === 1) {
        return (
            <div className="flex flex-col gap-6 w-full">
                <PlanSelector
                    selected={selectedPlan}
                    onSelect={setSelectedPlan}
                />

                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white
                       bg-linear-to-r from-brand-600 to-brand-500
                       shadow-[0_4px_24px_rgba(26,215,111,0.35)] cursor-pointer"
                    >
                        Continuar com{" "}
                        {selectedPlan === "FREE"
                            ? "Trial Grátis"
                            : `Plano ${selectedPlan}`}
                    </button>

                    <button
                        type="button"
                        className="text-sm text-text-muted hover:text-brand-500 transition-colors duration-150 text-center cursor-pointer"
                        onClick={() => setHaveAccount(true)}
                    >
                        Já tem uma conta?{" "}
                        <span className="text-brand-500 font-semibold underline underline-offset-2">
                            Entrar
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    // STEP 2 — Dados da empresa
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                >
                    <FaArrowLeft size={10} />
                    Voltar — Plano {selectedPlan}
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
                onSubmit={handleSubmit(onSubmit)}
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
                    label="CNPJ (Opcional)"
                    variant="outlined"
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
                    className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white
                     bg-linear-to-r from-brand-600 to-brand-500
                     shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer"
                >
                    {loading ? (
                        <CircularProgress size={22} color="inherit" />
                    ) : (
                        "Cadastrar Empresa"
                    )}
                </button>
            </form>
        </div>
    );
}
