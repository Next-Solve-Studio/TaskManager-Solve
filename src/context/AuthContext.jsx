// AuthContext.jsx
"use client";

import {
    createUserWithEmailAndPassword,
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
import {buildDefaultPermissions} from "@/lib/roles"
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
    const [currentUser, setCurrentUser] = useState(null); // estado de* usuário atual
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

    const justLoggedIn = useRef(false);

    const setJustLoggedIn = useCallback((val) => {
        justLoggedIn.current = val;
    }, []);

    const pendingUserData = useRef(null);

    const shouldUpdateLastSeen = useCallback((lastSeenAt) => {
        if (!lastSeenAt) return true;
        const last = lastSeenAt?.toDate?.() ?? new Date(lastSeenAt);
        return Date.now() - last.getTime() > ONE_HOUR;
    }, []);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            try {
                if (user) {
                    const token = await user.getIdToken();
                    await setSessionCookie(token);

                    let userData;
                    if (pendingUserData.current) {
                        userData = await pendingUserData.current;
                        pendingUserData.current = null;
                    } else {
                        const userRef = doc(db, "users", user.uid);
                        const userDoc = await getDoc(userRef);
                        userData = userDoc.exists() ? userDoc.data() : {};

                        if (shouldUpdateLastSeen(userData.lastSeenAt)) {
                            const now = new Date();
                            updateDoc(userRef, { lastSeenAt: now }).catch(() => {});
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
            } catch (err) {
                console.error("Erro ao carregar dados do usuário:", err);
                setCurrentUser(null);
                if (user) await setSessionCookie(null).catch(() => {});
            } finally {
                setLoading(false);
            }
        });
        return unsubscribe;
    }, [setSessionCookie, router, shouldUpdateLastSeen]);

    const loginWithEmail = useCallback(async (email, password) => {
        try {
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
    } catch (err) {
        justLoggedIn.current = false;
        throw err;
    }
    }, []);

    const loginWithGoogle = useCallback(async () => {
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
            pendingUserData.current = Promise.resolve({ ...data });
        } else {
            throw new Error(
                "Usuário não encontrado. Por favor, realize o cadastro da sua empresa.",
            );
        }
    }, []);

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

            const companyRef = doc(collection(db, "companies"));
            const companyId = companyRef.id;

            let appKey, expiresAt, confirmedPlan;
            try {
                const response = await fetch("/api/register-company", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        companyId,
                        companyName,
                        responsibleName: adminName,
                        email,
                        cpfCnpj: cnpj,
                        plan,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || errorData.message || `Erro na API: ${response.status}`);
                }
                const data = await response.json();
                appKey = data.appKey;
                expiresAt = data.expiresAt;
                confirmedPlan = data.plan || "FREE";
            } catch (err) {
                justLoggedIn.current = false;
                throw err;
            }

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

            let resolvePendingUserData, rejectPendingUserData;
            pendingUserData.current = new Promise((resolve, reject) => {
                resolvePendingUserData = resolve;
                rejectPendingUserData = reject;
            });

            if (plan !== "FREE") {
                justLoggedIn.current = false;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            try {
                await setDoc(companyRef, {
                    name: companyName,
                    cnpj,
                    endereco,
                    createdAt: new Date(),
                    plan: confirmedPlan,
                    status: "active",
                    appKey,
                    licenseExpiresAt: expiresAt,
                    ownerId: userCredential.user.uid,
                });
                await setDoc(doc(db, "users", userCredential.user.uid), userData);
                await setDoc(doc(db, "role_permissions", companyId), {
                    companyId,
                    permissions: buildDefaultPermissions(),
                    updatedAt: new Date(),
                    updatedBy: userCredential.user.uid,
                });
            } catch (firestoreErr) {
                pendingUserData.current = null;
                rejectPendingUserData(firestoreErr);
                justLoggedIn.current = false;
                await userCredential.user.delete().catch(() => {});
                throw firestoreErr;
            }

            resolvePendingUserData(userData);

            const token = await userCredential.user.getIdToken();
            await setSessionCookie(token);

            return appKey;
        },
        [setSessionCookie],
    );

    // Função para registrar um NOVO FUNCIONÁRIO
    const registerEmployee = useCallback(
        async (name, email, password, companyId, role, customData, details = {}) => {

            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Usuário não autenticado.");

            // Esta função geralmente sera chamada por uma API Route para não deslogar o admin atual
            const response = await fetch("/api/registerEmployee", {
                method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email, password, companyId, role, customData, cpf: details.cpf, endereco: details.endereco }),
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

    const inviteEmployee = useCallback(
        async (name, email, companyId, role, customData, details = {}) => {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Usuário não autenticado.");

            const response = await fetch("/api/invites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email, companyId, role, customData, cpf: details.cpf, endereco: details.endereco }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erro ao enviar convite");
            }

            return await response.json();
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            await setSessionCookie(null);
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
            inviteEmployee,
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
            inviteEmployee,
            logout,
            setJustLoggedIn,
        ],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
