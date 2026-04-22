// Botão para logar com Google Account
"use client";

import { serialize } from "cookie";
import { signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { auth, db, googleProvider } from "@/lib/firebaseConfig";
import { useAppRouter } from "@/utils/useAppRouter";

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
        <div className="flex flex-col items-center gap-4 w-full max-w-100 mx-auto">
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="
                    flex items-center justify-center gap-3
                    w-full py-3 px-4 border -mt-3
                  border-gray-300 rounded-lg bg-white
                  text-gray-700 font-medium shadow-sm transition-all cursor-pointer
                  sm:hover:bg-[#D1D1D1] sm:hover:shadow-md active:scale-[0.98] disabled:opacity-50
                "
            >
                <FcGoogle className="text-2xl " />
                {loading ? "Conectando..." : "Entrar com Google"}
            </button>
        </div>
    );
}
