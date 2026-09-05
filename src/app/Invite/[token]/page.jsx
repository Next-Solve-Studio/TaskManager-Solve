"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress, TextField, InputAdornment } from "@mui/material";
import { MdPerson, MdLock } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { muiDark } from "@/styles/StyleInputs";
import { ROLE_LABELS } from "@/lib/roles";

export default function InvitePage() {
    const { token } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [invite, setInvite] = useState(null);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [seePassword, setSeePassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`/api/invites/${token}`)
            .then(async (res) => {
                const json = await res.json();
                if (!res.ok) throw new Error(json.message);
                setInvite(json);
            })
            .catch((err) => setError(err.message || "Convite inválido."))
            .finally(() => setLoading(false));
    }, [token]);

    const handleAccept = async () => {
        if (password.length < 6) {
            toast.error("A senha precisa ter pelo menos 6 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`/api/invites/${token}/accept`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            await signInWithEmailAndPassword(auth, invite.email, password);
            toast.success("Conta criada com sucesso!");
            router.push("/");
        } catch (err) {
            toast.error(err.message || "Erro ao aceitar convite.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <CircularProgress size={24} style={{ color: "#19CA68" }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-3 px-6 text-center">
                <h1 className="text-xl font-bold text-text-primary">Convite indisponível</h1>
                <p className="text-sm text-text-secondary max-w-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-6">
            <div className="w-full max-w-sm bg-bg-card border border-border-main rounded-2xl p-6 space-y-5">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Você foi convidado!</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {invite.invitedByName} te convidou para entrar na equipe de{" "}
                        <strong className="text-text-primary">{invite.companyName}</strong> como{" "}
                        <strong className="text-text-primary">{ROLE_LABELS[invite.role] || invite.role}</strong>.
                    </p>
                </div>

                <TextField
                    label="Nome"
                    value={invite.name}
                    fullWidth
                    disabled
                    sx={muiDark}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><MdPerson className="text-brand-500" size={18} /></InputAdornment> } }}
                />
                <TextField label="E-mail" value={invite.email} fullWidth disabled sx={muiDark} />
                <TextField
                    label="Crie sua senha"
                    type={seePassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={muiDark}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start"><MdLock className="text-brand-500" size={18} /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <button type="button" onClick={() => setSeePassword((s) => !s)} className="text-text-muted">
                                        {seePassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    label="Confirme a senha"
                    type={seePassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    sx={muiDark}
                />

                <button
                    type="button"
                    onClick={handleAccept}
                    disabled={submitting}
                    className="w-full h-12 rounded-xl font-bold text-black bg-brand-500 hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {submitting && <CircularProgress size={16} style={{ color: "#000" }} />}
                    Criar conta e entrar
                </button>
            </div>
        </div>
    );
}