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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    userData = userDoc.exists() ? userDoc.data() : {};
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
    }, [setSessionCookie, router]);

    /**
     * Verifica se o usuário é o primeiro cadastrado no Firestore.
     * Retorna true se a coleção 'users' estiver vazia.
     */
    const isFirstUser = async () => {
        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.empty;
    };

    /**
     * Cria/atualiza o documento do usuário no Firestore após autenticação.
     * Se for um novo usuário, define o papel como "administrador" se for o primeiro,
     * caso contrário "desenvolvedor". Para logins subsequentes, apenas atualiza o lastLoginAt.
     */
    const handleUserDocument = async (user, extraData = {}) => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            // Atualiza último login
            await updateDoc(userRef, { lastLoginAt: new Date() });
            return userSnap.data();

        } else {

            const first = await isFirstUser();
            const userData = {
                name: user.displayName || extraData.name || "",
                email: user.email,
                role: first ? "administrador" : "desenvolvedor",
                photo: user.photoURL || null,
                createdAt: new Date(),
                lastLoginAt: new Date(),
                authMethod: extraData.authMethod || "email",
            };
                await setDoc(userRef, userData);
                return userData;
        }
    };

    const loginWithEmail = useCallback(async (email, password) => {
        // Sinaliza que o próximo disparo do onAuthStateChanged deve redirecionar
        justLoggedIn.current = true;

        // Recebe email e password, chama a função do firebase, e se for bem-sucedido, redireciona para o home
        await signInWithEmailAndPassword(auth, email, password);

        // Salva o último login
        await updateDoc(doc(db, "users", userCredential.user.uid), {
            lastLoginAt: new Date(),
        })
    });

    //Login Google
    const loginWithGoogle = useCallback(async() => {
        // Sinaliza que o próximo disparo do onAuthStateChanged deve redirecionar
        justLoggedIn.current = true;

        const provider = new GoogleAuthProvider();
        // Recebe provider, chama a função do firebase, e se for bem-sucedido, redireciona para o home
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Salva dados pendentes para o onAuthStateChanged usar (evita leitura extra)
        const userData = await handleUserDocument(user, { authMethod: "google" });
        pendingUserData.current = userData;
    })

    const register = useCallback(async (name, email, password) => {
        // dados do novo user
        const userData = {
            name: name.trim(),
            email,
            role: "desenvolvedor",
            createdAt: new Date(),
            lastLoginAt: new Date(),
            authMethod: "email",
        };

        // Cria o documento do usuário na coleção users do firestore
        // Salva em memória ANTES do setDoc — onAuthStateChanged vai consumir isso
        pendingUserData.current = userData;
        justLoggedIn.current = true; // deixa o onAuthStateChanged fazer o redirect

        // Função de registro, cria um novo usuário no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );

        await setDoc(doc(db, "users", userCredential.user.uid), userData);

        const token = await userCredential.user.getIdToken();
        setSessionCookie(token);
    });

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

    const value = useMemo(()=>({
        currentUser,
        loading,
        loginWithEmail,
        loginWithGoogle,
        register,
        logout,
        justLoggedIn,
        setJustLoggedIn,
    }),[currentUser, loginWithEmail,loading, loginWithGoogle, register, logout, setJustLoggedIn]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
