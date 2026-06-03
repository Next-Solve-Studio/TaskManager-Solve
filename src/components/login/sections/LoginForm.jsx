"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import ResetPassword from "./ResetPassword";

const schema = yup.object({
    email: yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("A senha é obrigatória"),
}).required();

export default function LoginForm({ setHaveAccount, allowRegistration }) {
    const { loginWithEmail } = useAuth();
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    async function onSubmit(data) {
        setLoading(true);
        try {
            await loginWithEmail(data.email, data.password);
            toast.success("Login realizado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao fazer login", {
                description: "Verifique suas credenciais ou tente novamente.",
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
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(26,215,111,0.35)]">
                        <IoMdLock size={18} color="white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                        Acesso ao Sistema
                    </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-primary">
                    Entrar no TaskManager
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Acesse sua empresa ou entre como funcionário
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <TextField
                    {...register("email")}
                    label="E-mail"
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
                        },
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

                {allowRegistration && (
                    <button
                        type="button"
                        className="text-sm text-text-muted hover:text-brand-500 transition-colors duration-150 text-left cursor-pointer"
                        onClick={() => setHaveAccount(false)}
                    >
                        Quer cadastrar sua empresa? <span className="text-brand-500 font-semibold underline underline-offset-2">Criar agora</span>
                    </button>
                )}
                <ResetPassword/>
                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer"
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
                </button>
            </form>
        </div>
    );
}
