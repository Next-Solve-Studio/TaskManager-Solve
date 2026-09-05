"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress, TextField, InputAdornment } from "@mui/material";
import { MdLock, MdOutlineMailOutline, MdOutlinePersonAddAlt, MdOutlineWarningAmber } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { muiDark } from "@/styles/StyleInputs";
import { ROLE_LABELS, ROLES_STYLES } from "@/lib/roles";

export default function InvitePage() {
    const { token } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [invite, setInvite] = useState(null);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirm, setSeeConfirm] = useState(false);
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
                <CircularProgress size={26} style={{ color: "#19CA68" }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center px-6">
                <div className="w-full max-w-sm bg-bg-card border border-border-main rounded-2xl p-8 text-center space-y-4 shadow-2xl">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 flex items-center justify-center">
                        <MdOutlineWarningAmber size={26} className="text-amber-500" />
                    </div>
                    <h1 className="text-lg font-bold text-text-primary">Convite indisponível</h1>
                    <p className="text-sm text-text-secondary">{error}</p>
                </div>
            </div>
        );
    }

    const roleStyle = ROLES_STYLES[invite.role] || {};
    const RoleIcon = roleStyle.icon;

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-sm bg-bg-card border border-border-main rounded-2xl p-7 shadow-2xl">
                <div className="flex flex-col items-center text-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-500 to-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(26,215,111,0.35)]">
                        <MdOutlinePersonAddAlt size={26} color="white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">Você foi convidado!</h1>
                        <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                            <strong className="text-text-primary">{invite.invitedByName}</strong> te chamou para a equipe de{" "}
                            <strong className="text-text-primary">{invite.companyName}</strong>
                        </p>
                    </div>
                    {RoleIcon && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.color} border ${roleStyle.border}`}>
                            <RoleIcon size={14} />
                            {ROLE_LABELS[invite.role] || invite.role}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-5">
                    <div className="rounded-xl bg-bg-surface border border-border-main2 px-3.5 py-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-text-muted mb-0.5">Nome</p>
                        <p className="text-sm font-medium text-text-primary truncate">{invite.name}</p>
                    </div>
                    <div className="rounded-xl bg-bg-surface border border-border-main2 px-3.5 py-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-text-muted mb-0.5 flex items-center gap-1">
                            <MdOutlineMailOutline size={11} /> E-mail
                        </p>
                        <p className="text-sm font-medium text-text-primary truncate">{invite.email}</p>
                    </div>
                </div>

                <div className="w-full h-px bg-border-main mb-5" />

                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Defina sua senha</p>

                <div className="flex flex-col gap-3.5">
                    <TextField
                        label="Senha"
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
                                        <button type="button" onClick={() => setSeePassword((s) => !s)} className="text-text-muted hover:text-brand-500">
                                            {seePassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        label="Confirme a senha"
                        type={seeConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        sx={muiDark}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start"><MdLock className="text-brand-500" size={18} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <button type="button" onClick={() => setSeeConfirm((s) => !s)} className="text-text-muted hover:text-brand-500">
                                            {seeConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleAccept}
                    disabled={submitting}
                    className="w-full h-12 mt-6 rounded-xl font-bold text-black bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_20px_rgba(26,215,111,0.3)] hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                    {submitting && <CircularProgress size={16} style={{ color: "#000" }} />}
                    Criar conta e entrar
                </button>
            </div>
        </div>
    );
}