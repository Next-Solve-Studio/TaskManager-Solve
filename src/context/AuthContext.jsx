// AuthContext.jsx
"use client";

import {
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
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

    const setSessionCookie = useCallback(async (token) => {
        if (token) {
            await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
        } else {
            await fetch("/api/auth/session", { method: "DELETE" });
        }
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
    });

    useEffect(() => {
        // Esse bloco será executado apenas uma vez, quando o AuthProvider for renderizado pela 1° vez
        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                await setSessionCookie(token);

                let userData;
                if (pendingUserData.current) {
                    userData = pendingUserData.current;
                    pendingUserData.current = null;
                } else {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    userData = userDoc.exists() ? userDoc.data() : {};

                    if (shouldUpdateLastSeen(userData.lastSeenAt)) {
                        const now = new Date();
                        await updateDoc(userRef, { lastSeenAt: now });
                        userData.lastSeenAt = now;
                    }
                }

                setCurrentUser({ ...user, ...userData });

                if (justLoggedIn.current) {
                    justLoggedIn.current = false;
                    router.goHome();
                }
            } else {
                await setSessionCookie(null);
                setCurrentUser(null);
            }

            setLoading(false);
        });
        return unsubscribe; //função de "limpeza", quando o componente for desmontado, chama unsubscribe() para remover o ouvinte
    }, [setSessionCookie, router, shouldUpdateLastSeen]);

    const loginWithEmail = useCallback(async (email, password) => {
        justLoggedIn.current = true;

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );

        const userRef = doc(db, "users", userCredential.user.uid);
        await updateDoc(userRef, {
            lastLoginAt: new Date(),
            lastSeenAt: new Date(),
        });
    }, []);

    //Login Google
    const loginWithGoogle = useCallback(async () => {
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
            throw new Error(
                "Usuário não encontrado. Por favor, realize o cadastro da sua empresa.",
            );
        }
    }, []);

    // Função para registrar uma NOVA EMPRESA e seu primeiro Administrador
    const registerCompany = useCallback(
        async (
            companyName,
            adminName,
            email,
            password,
            plan = "FREE",
            cnpj = "",
            endereco = "",
        ) => {
            justLoggedIn.current = true;

            const companyRef = doc(collection(db, "companies"))
            const companyId = companyRef.id
            
            //  Registrar licença na API (não bloqueia o cadastro se falhar)
            let appKey, expiresAt
            try {
                const response = await fetch("/api/register-company", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        companyId,
                        companyName,
                        responsibleName: adminName,
                        email,
                        plan,
                    }),
                });

                 if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message ||
                            `Erro na API: ${response.status}`
                    );
                }
                const data = await response.json();
                appKey = data.appKey;
                expiresAt = data.expiresAt;

            } catch (err) {
                justLoggedIn.current = false;
                console.error(
                    "[auth] Licença não registrada (não crítico):",
                    err,
                );
                throw err;
            }

            // Criar a Empresa na coleção 'companies'
            await setDoc(companyRef, {
                name: companyName,
                cnpj: cnpj,
                endereco: endereco,
                createdAt: new Date(),
                plan,
                status: "active",
                appKey,
                licenseExpiresAt: expiresAt,
            });

            const userData = {
                name: adminName.trim(),
                email,
                role: "master",
                companyId: companyRef.id,
                createdAt: new Date(),
                lastLoginAt: new Date(),
                lastSeenAt: new Date(),
                authMethod: "email",
            };

            pendingUserData.current = userData;

            //  Criar usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            await updateDoc(companyRef, { ownerId: userCredential.user.uid });

            const token = await userCredential.user.getIdToken();
            setSessionCookie(token);
        },
        [setSessionCookie],
    );

    // Função para registrar um NOVO FUNCIONÁRIO
    const registerEmployee = useCallback(
        async (name, email, password, companyId, role) => {

            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Usuário não autenticado.");

            // Esta função geralmente sera chamada por uma API Route para não deslogar o admin atual
            const response = await fetch("/api/registerEmployee", {
                method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email, password, companyId, role }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Erro ao registrar funcionário",
                );
            }

            return await response.json();
        },
        [],
    );

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

    const value = useMemo(
        () => ({
            currentUser,
            loading,
            loginWithEmail,
            loginWithGoogle,
            registerCompany,
            registerEmployee,
            logout,
            setJustLoggedIn,
        }),
        [
            currentUser,
            loading,
            loginWithEmail,
            loginWithGoogle,
            registerCompany,
            registerEmployee,
            logout,
            setJustLoggedIn,
        ],
    );

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
