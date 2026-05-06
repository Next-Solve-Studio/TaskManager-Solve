// Botão para logar com Google Account
"use client";

import { serialize } from "cookie";
import { signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useAppRouter } from "@/hooks/useAppRouter";
import { auth, db, googleProvider } from "@/lib/firebaseConfig";

export default function GoogleLoginBtn() {
    const [loading, setLoading] = useState(false);
    const router = useAppRouter();

    async function handleGoogleLogin() {
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            //Define o cookie para o middleware usando a biblioteca 'cookie'
            const cookieOptions = {
                maxAge: 30 * 24 * 60 * 60, //30 dias de duração do cookie
                path: "/", // o cookie é válido para todo o dommínio
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            };
            // biome-ignore lint/suspicious/noDocumentCookie: <>
            document.cookie = serialize("__session", token, cookieOptions);

            //verificar se o user já existe
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            //Verifica se é o primeiro usuário
            const usersSnapshot = await getDocs(collection(db, "users"));
            const isFirstUser = usersSnapshot.empty;
            console.log(isFirstUser);
            if (!userSnap.exists()) {
                //se for um novo, cria o documento novo
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    role: isFirstUser ? "administrador" : "desenvolvedor",
                    photo: user.photoURL,
                    createdAt: new Date(),
                    authMethod: "google",
                });
            }
            console.log(userRef);

            router.goHome();
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
        }
    }

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
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                             bg-linear-to-r from-brand-500/5 to-cyan-400/5
                             transition-opacity duration-200" />

            <FcGoogle size={20} className="shrink-0 relative z-10" />
            <span className="relative z-10">
                {loading ? "Conectando..." : "Continuar com Google"}
            </span>
        </button>
    );
}
