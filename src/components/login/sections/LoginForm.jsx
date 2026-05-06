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
import GoogleLoginBtn from "./GoogleLoginBtn";

//Schema de validação com Yup
const schema = yup
    .object({
        email: yup
            .string()
            .email("E-mail inválido")
            .required("O e-mail é obrigatório"),
        password: yup
            .string()
            .min(6, "A senha deve ter pelo 6 caracteres")
            .required("A senha é obrigatória"),
    })
    .required();

export default function LoginForm({ setHaveAccount, allowRegistration }) {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    // Configuração do React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    async function onSubmit(data) {
        if (!data.email || !data.password) {
            toast.warning("Preencha todos os campos !");
            return;
        }
        setLoading(true);

        try {
            await login(data.email, data.password);
        } catch (error) {
            const messages = {
                "auth/user-not-found":
                    "Nenhuma conta encontrada com este e-mail.",
                "auth/wrong-password": "Senha incorreta.",
                "auth/invalid-email": "E-mail inválido.",
                "auth/invalid-credential": "E-mail ou senha incorretos.",
                "auth/too-many-requests":
                    "Muitas tentativas. Tente novamente mais tarde.",
            };

            toast.error("Erro ao fazer login", {
                description:
                    messages[error.code] ?? "Tente novamente mais tarde.",
            });
        } finally {
            setLoading(false);
            toast.success("Login realizado com sucesso!", {
                description: "Bem-vindo de volta!",
            });
        }
    }

    const fieldSx = {
        width: "100%",
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            color: "var(--text-primary)",
            backgroundColor: "var(--bg-surface)",
            fontSize: "0.95rem",
            transition: "box-shadow 0.2s ease",
            "& fieldset": {
                borderColor: "var(--border-main2)",
                transition: "border-color 0.2s ease",
            },
            "&:hover fieldset": { borderColor: "var(--color-brand-500)" },
            "&.Mui-focused fieldset": {
                borderColor: "var(--color-brand-500)",
                borderWidth: "1.5px",
            },
            "&.Mui-focused": {
                boxShadow: "0 0 0 3px rgba(26, 215, 111, 0.12)",
            },
        },
        "& .MuiInputLabel-root": {
            color: "var(--text-muted)",
            fontSize: "0.9rem",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--color-brand-500)",
        },
        "& .MuiFormHelperText-root": {
            fontSize: "0.78rem",
            marginLeft: "4px",
        },
        "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
            transition: "background-color 50000s ease-in-out 0s",
            WebkitTextFillColor: "var(--text-primary) !important",
            caretColor: "var(--text-primary)",
        },
    };

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-cyan-400
                                    flex items-center justify-center
                                    shadow-[0_0_20px_rgba(26,215,111,0.35)]">
                        <IoMdLock size={18} color="white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                        Autenticação
                    </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-primary">
                    Acesse sua conta
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Insira suas credenciais para continuar
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                <GoogleLoginBtn />

                <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-border-main2" />
                    <span className="text-xs font-medium text-text-muted uppercase tracking-widest px-1">
                        ou
                    </span>
                    <div className="flex-1 h-px bg-border-main2" />
                </div>

                <TextField
                    {...register("email")}
                    label="E-mail"
                    variant="outlined"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={fieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdOutlineEmail
                                    color="var(--color-brand-500)"
                                    size={19}
                                />
                            </InputAdornment>
                        ),
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IoMdLock
                                        color="var(--color-brand-500)"
                                        size={19}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        className="w-full"
                    />
                    <button
                        type="button"
                        className="absolute right-3 text-text-muted hover:text-brand-500 transition-colors duration-150"
                        onClick={() => setSeePassword(!seePassword)}
                    >
                        {seePassword
                            ? <FaEyeSlash size={18} />
                            : <FaEye size={18} />
                        }
                    </button>
                </div>

                {allowRegistration && (
                    <button
                        type="button"
                        className="text-sm text-text-muted hover:text-brand-500 transition-colors duration-150
                                   text-left cursor-pointer"
                        onClick={() => setHaveAccount(false)}
                    >
                        Não tem uma conta?{" "}
                        <span className="text-brand-500 font-semibold underline underline-offset-2">
                            Criar agora
                        </span>
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        relative overflow-hidden mt-2
                        h-12 w-full rounded-xl
                        font-bold text-base tracking-wide text-white
                        bg-linear-to-r from-brand-600 to-brand-500
                        shadow-[0_4px_24px_rgba(26,215,111,0.35)]
                        sm:hover:shadow-[0_5px_28px_rgba(26,215,111,0.5)]
                        sm:hover:brightness-100
                        disabled:opacity-50 disabled:cursor-not-allowed
                        active:scale-[0.98] transition-all duration-200
                        cursor-pointer
                    "
                >
                    <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0
                                     -translate-x-full hover:translate-x-full transition-transform duration-700" />
                    {loading
                        ? <CircularProgress size={22} color="inherit" />
                        : "Entrar"
                    }
                </button>
            </form>
        </div>
    );
}
