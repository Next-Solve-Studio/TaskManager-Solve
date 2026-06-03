"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUser } from "react-icons/ai";
import { FaEye, FaEyeSlash, FaBuilding } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";

// Schema de validação com Yup incluindo Empresa
const schema = yup
    .object({
        companyName: yup
            .string()
            .min(3, "O nome da empresa deve ter pelo menos 3 caracteres")
            .required("O nome da empresa é obrigatório"),
        cnpj: yup.string().optional(), // Campo opcional
        endereco: yup.string().optional(), // Campo opcional
        name: yup
            .string()
            .min(3, "Seu nome deve ter pelo menos 3 caracteres")
            .required("Seu nome é obrigatório"),
        email: yup
            .string()
            .email("E-mail inválido")
            .required("O e-mail é obrigatório"),
        password: yup
            .string()
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .required("A senha é obrigatória"),
    })
    .required();

export default function RegisterForm({ setHaveAccount }) {
    const { registerCompany } = useAuth();
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

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
                data.cnpj || "", 
                data.endereco || ""
            );
            toast.success("Empresa cadastrada com sucesso!", {
                description: "Bem-vindo ao TaskManager SaaS!",
            });
        } finally {
            setLoading(false);
        }
    }

    const fieldSx = {
        width: "100%",
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            color: "var(--text-primary)",
            backgroundColor: "var(--bg-surface)",
            fontSize: "0.95rem",
            "& fieldset": { borderColor: "var(--border-main2)" },
            "&:hover fieldset": { borderColor: "var(--color-brand-500)" },
            "&.Mui-focused fieldset": { borderColor: "var(--color-brand-500)" },
        },
        "& .MuiInputLabel-root": { color: "var(--text-muted)" },
        "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-brand-500)" },
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                        <FaBuilding size={18} color="white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        SaaS - Nova Empresa
                    </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-primary">
                    Cadastre sua Empresa
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Comece a gerenciar seus projetos de forma profissional
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <TextField
                    {...register("companyName")}
                    label="Nome da Empresa"
                    variant="outlined"
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                    sx={fieldSx}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaBuilding color="var(--color-brand-500)" size={19} />
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                <TextField
                    {...register("name")}
                    label="Seu Nome (Administrador)"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={fieldSx}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AiOutlineUser color="var(--color-brand-500)" size={19} />
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                <TextField
                    {...register("email")}
                    label="E-mail Corporativo"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={fieldSx}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdOutlineEmail color="var(--color-brand-500)" size={19} />
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                <div className="flex w-full relative items-center">
                    <TextField
                        {...register("password")}
                        label="Senha"
                        variant="outlined"
                        type={seePassword ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={fieldSx}
                        className="w-full"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IoMdLock color="var(--color-brand-500)" size={19} />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-3 text-text-muted hover:text-brand-500"
                        onClick={() => setSeePassword(!seePassword)}
                    >
                        {seePassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                </div>
                <TextField
                    {...register("cnpj")}
                    label="CNPJ (Opcional)"
                    variant="outlined"
                    error={!!errors.cnpj}
                    helperText={errors.cnpj?.message}
                    sx={fieldSx}
                />

                <TextField
                    {...register("endereco")}
                    label="Endereço (Opcional)"
                    variant="outlined"
                    error={!!errors.endereco}
                    helperText={errors.endereco?.message}
                    sx={fieldSx}
                />
                <button
                    type="button"
                    className="text-sm text-text-muted hover:text-brand-500 transition-colors duration-150 text-left cursor-pointer"
                    onClick={() => setHaveAccount(true)}
                >
                    Já tem uma conta? <span className="text-brand-500 font-semibold underline underline-offset-2">Entrar agora</span>
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer"
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Cadastrar Empresa"}
                </button>
            </form>
        </div>
    );
}
