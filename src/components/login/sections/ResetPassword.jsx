"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose, MdLock, MdMailOutline, MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import ShowPassword from "@/components/ui/Buttons/ShowPassword";
import { muiDark } from "@/styles/StyleInputs";

const CODE_DURATION_SECONDS = 15 * 60;

const passwordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .min(6, "Mínimo de 6 caracteres")
        .required("Nova senha é obrigatória"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "As senhas não coincidem")
        .required("Confirme a nova senha"),
});

export default function ResetPassword() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState("email"); // email | code
    const [email, setEmail] = useState("");
    const [requesting, setRequesting] = useState(false);
    const [resending, setResending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(CODE_DURATION_SECONDS);
    const [seePassword, setSeePassword] = useState(false);
    const [seePassword2, setSeePassword2] = useState(false);

    const {
        register,
        handleSubmit,
        reset: resetPasswordForm,
        formState: { errors },
    } = useForm({ resolver: yupResolver(passwordSchema) });

    const resetAll = () => {
        setStep("email");
        setEmail("");
        setCode("");
        resetPasswordForm();
    };

    const handleClose = () => {
        if (requesting || verifying) return;
        setOpen(false);
        resetAll();
    };

    useEffect(() => {
        if (step !== "code") return;
        if (secondsLeft <= 0) {
            toast.error("Código expirado. Solicite um novo.");
            setStep("email");
            setCode("");
            return;
        }
        const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [step, secondsLeft]);

    const requestCode = async () => {
        const res = await fetch("/api/auth/request-password-reset-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Erro ao enviar código.");
        return json;
    };

    const handleSendCode = async () => {
        if (!email) {
            toast.error("Digite o e-mail da sua conta.");
            return;
        }
        setRequesting(true);
        try {
            await requestCode();
            setSecondsLeft(CODE_DURATION_SECONDS);
            setCode("");
            setStep("code");
            toast.success(
                "Se esse e-mail estiver cadastrado, você vai receber um código em instantes.",
            );
        } catch (err) {
            toast.error(err.message || "Erro ao enviar código.");
        } finally {
            setRequesting(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await requestCode();
            setSecondsLeft(CODE_DURATION_SECONDS);
            setCode("");
            toast.success("Novo código enviado.");
        } catch (err) {
            toast.error(err.message || "Erro ao reenviar código.");
        } finally {
            setResending(false);
        }
    };

    const onConfirmNewPassword = async (data) => {
        if (code.length !== 6) {
            toast.error("Digite o código de 6 caracteres.");
            return;
        }
        setVerifying(true);
        try {
            const res = await fetch("/api/auth/verify-password-reset-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    code,
                    newPassword: data.newPassword,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Código inválido.");

            toast.success(
                "Senha redefinida com sucesso! Faça login com a nova senha.",
            );
            setOpen(false);
            resetAll();
        } catch (err) {
            toast.error(err.message || "Código inválido.");
            if (
                err.message?.includes("cancelado") ||
                err.message?.includes("expirado") ||
                err.message?.includes("Solicite um novo")
            ) {
                setStep("email");
                setCode("");
            }
        } finally {
            setVerifying(false);
        }
    };

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
        "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--color-brand-500)",
        },
    };

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                type="button"
                className="cursor-pointer text-start text-sm text-text-muted hover:text-brand-500 transition-colors"
            >
                Esqueceu a senha? Clique aqui
            </button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            background: "var(--color-bg-card)",
                            backgroundImage: "none",
                            border: "1px solid var(--color-border-main)",
                            borderRadius: "20px",
                            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                            p: 1,
                        },
                    },
                }}
            >
                <div className="flex items-center justify-between p-4 pb-2">
                    <DialogTitle
                        sx={{
                            p: 0,
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                        }}
                    >
                        Recuperar Senha
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={requesting || verifying}
                        className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-surface transition-all"
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                {step === "email" ? (
                    <>
                        <DialogContent
                            sx={{
                                p: 4,
                                pt: 2,
                                pb: 3,
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                            }}
                        >
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Digite o endereço de e-mail associado à sua
                                conta. Enviaremos um código de 6 caracteres para
                                você redefinir sua senha.
                            </p>

                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="E-mail"
                                variant="outlined"
                                type="email"
                                sx={fieldSx}
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
                        </DialogContent>

                        <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={requesting}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-text-primary bg-bg-surface hover:bg-bg-hover transition-colors border border-border-main"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSendCode}
                                disabled={requesting}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                            >
                                {requesting ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : (
                                    "Enviar Código"
                                )}
                            </button>
                        </DialogActions>
                    </>
                ) : (
                    <DialogContent
                        sx={{
                            p: 4,
                            pt: 2,
                            pb: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20">
                            <MdMailOutline className="text-brand-500 text-2xl shrink-0" />
                            <p className="text-sm text-text-secondary">
                                Enviamos um código de 6 caracteres para{" "}
                                <strong className="text-text-primary">
                                    {email}
                                </strong>
                                .
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1">
                                Código de Verificação
                            </span>
                            <TextField
                                value={code}
                                onChange={(e) =>
                                    setCode(
                                        e.target.value
                                            .toUpperCase()
                                            .slice(0, 6),
                                    )
                                }
                                fullWidth
                                variant="outlined"
                                placeholder="Ex: A3F9K2"
                                inputProps={{
                                    maxLength: 6,
                                    style: {
                                        letterSpacing: "0.3em",
                                        textAlign: "center",
                                        fontWeight: 700,
                                    },
                                }}
                                sx={muiDark}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-text-muted">
                                Expira em:{" "}
                                <strong
                                    className={
                                        secondsLeft < 60
                                            ? "text-red-400"
                                            : "text-brand-500"
                                    }
                                >
                                    {mm}:{ss}
                                </strong>
                            </span>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="text-brand-500 hover:underline disabled:opacity-50 cursor-pointer"
                            >
                                {resending
                                    ? "Reenviando..."
                                    : "Reenviar código"}
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1">
                                Nova Senha
                            </span>
                            <div className="flex w-full relative items-center">
                                <TextField
                                    {...register("newPassword")}
                                    type={seePassword ? "text" : "password"}
                                    error={!!errors.newPassword}
                                    helperText={errors.newPassword?.message}
                                    fullWidth
                                    variant="outlined"
                                    sx={muiDark}
                                />
                                <ShowPassword
                                    setSeePassword={setSeePassword}
                                    seePassword={seePassword}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1">
                                Confirmar Nova Senha
                            </span>
                            <div className="flex w-full relative items-center">
                                <TextField
                                    {...register("confirmPassword")}
                                    type={seePassword2 ? "text" : "password"}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    fullWidth
                                    variant="outlined"
                                    sx={muiDark}
                                />
                                <ShowPassword
                                    setSeePassword={setSeePassword2}
                                    seePassword={seePassword2}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => {
                                    setStep("email");
                                    setCode("");
                                }}
                                disabled={verifying}
                                className="flex-1"
                                sx={{
                                    height: "44px",
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    fontWeight: 700,
                                }}
                            >
                                Voltar
                            </Button>
                            <Button
                                type="button"
                                variant="contained"
                                onClick={handleSubmit(onConfirmNewPassword)}
                                disabled={verifying || code.length !== 6}
                                startIcon={
                                    verifying ? (
                                        <CircularProgress
                                            size={16}
                                            color="inherit"
                                        />
                                    ) : (
                                        <MdLock />
                                    )
                                }
                                className="flex-1"
                                sx={{
                                    height: "44px",
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    color: "white",
                                    background:
                                        "linear-gradient(to right, var(--color-brand-700), var(--color-brand-600))",
                                }}
                            >
                                {verifying
                                    ? "Redefinindo..."
                                    : "Redefinir Senha"}
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
