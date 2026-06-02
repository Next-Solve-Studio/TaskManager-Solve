// AuthContext.jsx
"use client";

import { serialize } from "cookie";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, addDoc } from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useAppRouter } from "@/hooks/useAppRouter";
import { auth, db } from "../lib/firebaseConfig";

const ONE_HOUR = 60 * 60 * 1000;

const AuthContext = createContext(); // Criação do contexto

/**
 * Cria um "hook" personalizado, que ao invés de precisar escrever useContext(AuthContext) em todos os componentes,
 * basta simplesmente chamar useAuth()
 */
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Componente Provedor, vai "abraçar" toda a aplicação
    const [currentUser, setCurrentUser] = useState(null); // estado de usuário atual
    const [loading, setLoading] = useState(true);
    const router = useAppRouter(); // Inicia o hook de roteamento para que possamos usá-lo para redirecionar o usuário

    const setSessionCookie = useCallback((token) => {
        const cookieOptions = {
            maxAge: 30 * 24 * 60 * 60, //30 dias de duração do cookie
            path: "/", // o cookie é válido para o dommínio
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };
        // biome-ignore lint/suspicious/noDocumentCookie: <>
        document.cookie = serialize(
            "__session",
            token || "",
            token ? cookieOptions : { ...cookieOptions, maxAge: -1 },
        );
    }, []);

    // indica que o login acabou de acontecer nesta sessão, Usamos ref para não causar re-render e evitar loop
    const justLoggedIn = useRef(false);

    const setJustLoggedIn = useCallback((val) => {
        justLoggedIn.current = val;
    }, []);

    // Guarda dados do novo usuário
    const pendingUserData = useRef(null);

    const shouldUpdateLastSeen = useCallback((lastSeenAt) => {
        if (!lastSeenAt) return true;
        const last = lastSeenAt?.toDate?.() ?? new Date(lastSeenAt);
        return Date.now() - last.getTime() > ONE_HOUR;
    })

    useEffect(() => {
        // Esse bloco será executado apenas uma vez, quando o AuthProvider for renderizado pela 1° vez
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // o OnAuth... fica observando o estado de autenticação, retorna uma função unsubscribe
            if (user) {
                const token = await user.getIdToken();
                setSessionCookie(token);

                // Busca dados do usuários
                let userData;
                if (pendingUserData.current) {
                    userData = pendingUserData.current;
                    pendingUserData.current = null;
                } else {
                    const userRef = doc(db, "users", user.uid)
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    userData = userDoc.exists() ? userDoc.data() : {};

                    if (shouldUpdateLastSeen(userData.lastSeenAt)) {
                        const now = new Date()
                        await updateDoc(userRef, {lastSeenAt: now})
                        userData.lastSeenAt = now
                    }
                }

                setCurrentUser({ ...user, ...userData }); // atualiza o estado com a informação recebida do firebase

                // Isso garante que o currentUser já está populado antes do redirect,
                if (justLoggedIn.current) {
                    justLoggedIn.current = false;
                    router.goHome();
                }
            } else {
                setSessionCookie(null);
                setCurrentUser(null);
            }

            setLoading(false);
        });
        return unsubscribe; //função de "limpeza", quando o componente for desmontado, chama unsubscribe() para remover o ouvinte
    }, [setSessionCookie, router, shouldUpdateLastSeen]);

    const loginWithEmail = useCallback(async (email, password) => {
        justLoggedIn.current = true;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        const userRef = doc(db, "users", userCredential.user.uid);

        await updateDoc(userRef, {
            lastLoginAt: new Date(),
            lastSeenAt: new Date(),
        });
    }, []);


    //Login Google
    const loginWithGoogle = useCallback(async() => {
        // Sinaliza que o próximo disparo do onAuthStateChanged deve redirecionar
        justLoggedIn.current = true;
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const data = userSnap.data();
            await updateDoc(userRef, {
                lastLoginAt: new Date(),
                lastSeenAt: new Date(),
            });
            pendingUserData.current = { ...data };
        } else {
            // Se não existir, por padrão não vinculamos a empresa no Google Login direto
            // a menos que seja um convite, mas para SaaS simplificado, vamos exigir cadastro
            throw new Error("Usuário não encontrado. Por favor, realize o cadastro da sua empresa.");
        }
    }, []);

    // Função para registrar uma NOVA EMPRESA e seu primeiro Administrador
    const registerCompany = useCallback(async (companyName, adminName, email, password) => {
        justLoggedIn.current = true;

        // 1. Criar a Empresa na coleção 'companies'
        const companyRef = await addDoc(collection(db, "companies"), {
            name: companyName,
            createdAt: new Date(),
            plan: "free", // exemplo de campo SaaS
            status: "active",
            
        });

        const userData = {
            name: adminName.trim(),
            email,
            role: "administrador",
            companyId: companyRef.id, // Vínculo crucial para multi-tenancy
            createdAt: new Date(),
            lastLoginAt: new Date(),
            lastSeenAt: new Date(),
            authMethod: "email",
        };

        pendingUserData.current = userData;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), userData);

        // Atualiza a empresa com o ID do dono
        await updateDoc(companyRef, { ownerId: userCredential.user.uid });

        const token = await userCredential.user.getIdToken();
        setSessionCookie(token);
    }, [setSessionCookie]);

     // Função para registrar um NOVO FUNCIONÁRIO
    const registerEmployee = useCallback(async (name, email, password, companyId) => {
         // Esta função geralmente sera chamada por uma API Route para não deslogar o admin atual
        const response = await fetch("/api/register-employee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, companyId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erro ao registrar funcionário");
        }

        return await response.json();
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setSessionCookie(null);
            router.goLogin();
        } catch (error) {
            console.error("Erro ao fazer logout: ", error);
            throw error;
        }
    }, [setSessionCookie, router]);

    const value = useMemo(() => ({
        currentUser,
        loading,
        loginWithEmail,
        loginWithGoogle,
        registerCompany,
        registerEmployee,
        logout,
        setJustLoggedIn,
    }), [currentUser, loading, loginWithEmail, loginWithGoogle, registerCompany, registerEmployee, logout, setJustLoggedIn]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
