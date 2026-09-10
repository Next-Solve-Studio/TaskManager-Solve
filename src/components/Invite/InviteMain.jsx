"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { MdOutlineWarningAmber } from "react-icons/md";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import InviteInfo from "./sections/InviteInfo";
import RegistrationDetails from "./sections/RegistrationDetails";
import SetPassword from "./sections/SetPassword";

export default function InviteMain() {
    const { token } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [invite, setInvite] = useState(null);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-sm bg-bg-card border border-border-main rounded-2xl p-7 shadow-2xl">

                <InviteInfo invite={invite}/>

                <RegistrationDetails invite={invite}/>

                <div className="w-full h-px bg-border-main mb-5" />

                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Defina sua senha</p>

                <SetPassword confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} setPassword={setPassword} password={password}/>

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