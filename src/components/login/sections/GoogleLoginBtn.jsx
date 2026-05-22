// Botão para logar com Google Account
"use client";

import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function GoogleLoginBtn() {
    const { loginWithGoogle, loading } = useAuth();


    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            // O redirecionamento é automático (justLoggedIn + onAuthStateChanged)
            // Pode colocar um toast de boas-vindas se quiser
        } catch (error) {
            console.error(" ERRO DETALHADO NO LOGIN:", error);
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
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="
                group relative flex items-center justify-center gap-3
                w-full h-11 px-4
                rounded-xl border border-border-main2
                bg-bg-surface
                text-text-primary text-sm font-semibold
                hover:border-brand-500/40
                hover:bg-bg-card
                hover:shadow-[0_0_16px_rgba(26,215,111,0.12)]
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-[0.98]
                transition-all duration-200
                cursor-pointer
            "
        >
            <span
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                    bg-linear-to-r from-brand-500/5 to-cyan-400/5
                    transition-opacity duration-200"
            />

            <FcGoogle size={20} className="shrink-0 relative z-10" />
            <span className="relative z-10">
                {loading ? "Conectando..." : "Continuar com Google"}
            </span>
        </button>
    );
}
