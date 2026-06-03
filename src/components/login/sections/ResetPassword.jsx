"use client";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, InputAdornment } from "@mui/material";
import { MdClose, MdOutlineEmail } from "react-icons/md";

export default function ResetPassword() {
    const [open, setOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if (!loading) {
            setOpen(false);
            setResetEmail("");
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail) {
            return toast.error("Por favor, digite o e-mail da sua conta.");
        }

        setLoading(true);
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, resetEmail);
            toast.success(
                "E-mail de recuperação enviado! Verifique sua caixa de entrada.",
            );
            handleClose();
        } catch (error) {
            console.error(error);
            if (error.code === "auth/user-not-found") {
                toast.error("Usuário não encontrado.");
            } else {
                toast.error("Erro ao enviar e-mail de recuperação.");
            }
        } finally {
            setLoading(false);
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
        "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-brand-500)" },
    };

    return (
        <>
            <button 
                onClick={handleOpen} 
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
                    <DialogTitle sx={{ p: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Recuperar Senha
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-surface transition-all"
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                <DialogContent sx={{ p: 4, pt: 2, pb: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        Digite o endereço de e-mail associado à sua conta. Enviaremos um link seguro para você redefinir sua senha.
                    </p>
                    
                    <TextField
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        label="E-mail"
                        variant="outlined"
                        type="email"
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
                </DialogContent>

                <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-text-primary bg-bg-surface hover:bg-bg-hover transition-colors border border-border-main"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar Link"}
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
}

