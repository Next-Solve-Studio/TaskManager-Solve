"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdInfoOutline, MdLock, MdMailOutline } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import { auth } from "@/lib/firebaseConfig";
import { muiDark } from "@/styles/StyleInputs";
import ShowPassword from "@/components/ui/Buttons/ShowPassword";

const schema = yup.object().shape({
    currentPassword: yup.string().required("Senha atual é obrigatória"),
    newPassword: yup
        .string()
        .min(6, "Mínimo de 6 caracteres")
        .required("Nova senha é obrigatória"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "As senhas não coincidem")
        .required("Confirme a nova senha"),
});

const CODE_DURATION_SECONDS = 15 * 60;

export default function SecuritySettings() {
    const [seePassword, setSeePassword] = useState(false);
    const [seePassword2, setSeePassword2] = useState(false);
    const [seePassword3, setSeePassword3] = useState(false);
    const { currentUser } = useAuth();
    const { requestPasswordChangeCode, verifyPasswordChangeCode } = useSettings();
    const isMobile = useIsMobile();

    const [step, setStep] = useState("form"); // form | code
    const [pendingPassword, setPendingPassword] = useState(null);
    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(CODE_DURATION_SECONDS);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (step !== "code") return;
        if (secondsLeft <= 0) {
            toast.error("Código expirado. O processo foi cancelado.");
            setStep("form");
            setCode("");
            return;
        }
        const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [step, secondsLeft]);

    const onSubmit = async (data) => {
        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                data.currentPassword,
            );
            await reauthenticateWithCredential(auth.currentUser, credential);

            await requestPasswordChangeCode();
            setPendingPassword(data.newPassword);
            setSecondsLeft(CODE_DURATION_SECONDS);
            setStep("code");
            setCode("");
            toast.success("Código enviado para o seu e-mail.");
        } catch (err) {
            console.error("Erro ao solicitar troca de senha:", err);
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                toast.error("Senha atual incorreta.");
            } else {
                toast.error(err.message || "Erro ao solicitar troca de senha.");
            }
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await requestPasswordChangeCode();
            setSecondsLeft(CODE_DURATION_SECONDS);
            setCode("");
            toast.success("Novo código enviado.");
        } catch (err) {
            toast.error(err.message || "Erro ao reenviar código.");
        } finally {
            setResending(false);
        }
    };

    const handleVerify = async () => {
        if (code.length !== 6) {
            toast.error("Digite o código de 6 caracteres.");
            return;
        }
        setVerifying(true);
        try {
            await verifyPasswordChangeCode(code, pendingPassword);
            toast.success("Senha alterada com sucesso!");
            reset();
            setStep("form");
            setCode("");
            setPendingPassword(null);
        } catch (err) {
            toast.error(err.message || "Código inválido.");
            if (err.message?.includes("cancelado") || err.message?.includes("expirado") || err.message?.includes("Solicite um novo")) {
                setStep("form");
                setCode("");
            }
        } finally {
            setVerifying(false);
        }
    };

    const handleCancel = () => {
        setStep("form");
        setCode("");
        setPendingPassword(null);
    };

    if (currentUser?.authMethod === "google") {
        return (
            <div
                className={`bg-cyan-500/5 border border-cyan-500/20 rounded-2xl ${isMobile ? "p-4 flex-col text-center" : "p-6"} flex items-center gap-4`}
            >
                <MdInfoOutline
                    className={`text-cyan-400 ${isMobile ? "text-2xl" : "text-3xl"} shrink-0`}
                />
                <div
                    className={`space-y-1 ${isMobile ? "text-center" : "text-left"}`}
                >
                    <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">
                        Autenticação Social Ativa
                    </h3>
                    <p className="text-cyan-400/70 text-xs leading-relaxed">
                        Você está autenticado através do Google. Para sua
                        segurança, a senha deve ser gerenciada diretamente nas
                        configurações da sua conta Google.
                    </p>
                </div>
            </div>
        );
    }

    if (step === "code") {
        const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
        const ss = String(secondsLeft % 60).padStart(2, "0");

        return (
            <div className={`space-y-6 ${isMobile ? "w-full" : "max-w-md"}`}>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20">
                    <MdMailOutline className="text-brand-500 text-2xl shrink-0" />
                    <p className="text-sm text-text-secondary">
                        Enviamos um código de 6 caracteres para{" "}
                        <strong className="text-text-primary">{currentUser?.email}</strong>.
                    </p>
                </div>

                <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1">
                        Código de Verificação
                    </span>
                    <TextField
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                        fullWidth
                        variant="outlined"
                        placeholder="Ex: A3F9K2"
                        inputProps={{ maxLength: 6, style: { letterSpacing: "0.3em", textAlign: "center", fontWeight: 700 } }}
                        sx={muiDark}
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                        Expira em: <strong className={secondsLeft < 60 ? "text-red-400" : "text-brand-500"}>{mm}:{ss}</strong>
                    </span>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="text-brand-500 hover:underline disabled:opacity-50 cursor-pointer"
                    >
                        {resending ? "Reenviando..." : "Reenviar código"}
                    </button>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handleCancel}
                        className={isMobile ? "flex-1" : ""}
                        sx={{ height: "44px", borderRadius: "12px", textTransform: "none", fontWeight: 700 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        onClick={handleVerify}
                        disabled={verifying || code.length !== 6}
                        startIcon={verifying ? <CircularProgress size={16} color="inherit" /> : <MdLock />}
                        className={isMobile ? "flex-1" : ""}
                        sx={{
                            height: "44px",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 700,
                            color: "white",
                            background: "linear-gradient(to right, var(--color-brand-700), var(--color-brand-600))",
                        }}
                    >
                        {verifying ? "Verificando..." : "Confirmar Código"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={`space-y-6 ${isMobile ? "w-full" : "max-w-md"}`}
        >
            <div className="space-y-1.5">
                <label
                    htmlFor="currentPassword"
                    className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1"
                >
                    Senha Atual
                </label>
                <div className="flex w-full relative items-center">
                    <TextField
                        {...register("currentPassword")}
                        type={seePassword ? "text" : "password"}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword?.message}
                        fullWidth
                        variant="outlined"
                        sx={muiDark}
                    />
                    <ShowPassword setSeePassword={setSeePassword} seePassword={seePassword}/>
                </div>
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="newPassword"
                    className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1"
                >
                    Nova Senha
                </label>
                <div className="flex w-full relative items-center">
                    <TextField
                        {...register("newPassword")}
                        type={seePassword2 ? "text" : "password"}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                        fullWidth
                        variant="outlined"
                        sx={muiDark}
                    />
                    <ShowPassword setSeePassword={setSeePassword2} seePassword={seePassword2}/>
                </div>
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="confirmPassword"
                    className="text-xs font-bold uppercase tracking-wider text-font-gray2 ml-1"
                >
                    Confirmar Nova Senha
                </label>
                <div className="flex w-full relative items-center">
                    <TextField
                        {...register("confirmPassword")}
                        type={seePassword3 ? "text" : "password"}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        fullWidth
                        variant="outlined"
                        sx={muiDark}
                    />
                    <ShowPassword setSeePassword={setSeePassword3} seePassword={seePassword3}/>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isDirty}
                    startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <MdLock />}
                    className={`${isMobile ? "w-full" : ""} shadow-lg shadow-brand-500/20`}
                    sx={{
                        height: "44px",
                        px: 3,
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        color: "white",
                        background: "linear-gradient(to right, var(--color-brand-700), var(--color-brand-600))",
                        boxShadow: "0 4px 20px rgba(26, 215, 111, 0.3)",
                        transition: "all 150ms ease-in-out",
                        cursor: "pointer",
                        "&:hover": {
                            background: "linear-gradient(to right, var(--color-brand-700), var(--color-brand-600))",
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 24px rgba(26, 215, 111, 0.4)",
                        },
                        "&:active": {
                            transform: "scale(0.97)",
                        },
                        "&.Mui-disabled": {
                            opacity: 0.5,
                            color: "white",
                            cursor: "not-allowed",
                            pointerEvents: "auto",
                            boxShadow: "none",
                        }
                    }}
                >
                    {isSubmitting ? "Enviando código..." : "Alterar Senha"}
                </Button>
            </div>
        </Box>
    );
}