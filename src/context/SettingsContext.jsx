"use client";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebaseConfig";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const { uid, companyId } = useCurrentUser();
    const [userSettings, setUserSettings] = useState(null);
    const [systemSettings, setSystemSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!companyId) return;

        const systemDocRef = doc(db, "system_settings", companyId);
        const unsubscribe = onSnapshot(systemDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setSystemSettings(docSnap.data());
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [companyId]);

    useEffect(() => {
        if (!uid) {
            setUserSettings(null);
            return;
        }
        const userRef = doc(db, "users", uid);
        const unsubscribe = onSnapshot(userRef, (snap) => {
            setUserSettings(snap.exists() ? (snap.data().preferences ?? null) : null);
        });
        return unsubscribe;
    }, [uid]);

    // Atualizar perfil do usuário (name, preferences, etc)
    const updateProfile = useCallback(
        async (data) => {
            if (!uid) return;

            try {
                const userRef = doc(db, "users", uid);
                await updateDoc(userRef, {
                    name: data.name,
                    preferences: data.preferences || {},
                    updatedAt: new Date(),
                });
                toast.success("Perfil atualizado com sucesso");
            } catch (error) {
                console.error("Erro ao atualizar perfil:", error);
                toast.error(getErrorMessage(error, "Erro ao atualizar perfil"));
                throw error;
            }
        },
        [uid],
    );

    // Trocar senha (apenas para authMethod === 'email')
    const changePassword = useCallback(async (currentPassword, newPassword) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // Reautenticação é necessária para trocar senha
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword,
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            toast.success("Senha alterada com sucesso");
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            if (error.code === "auth/wrong-password") {
                toast.error("Senha atual incorreta");
            } else {
                toast.error(getErrorMessage(error, "Erro ao alterar senha"));
            }
            throw error;
        }
    }, []);

     const requestPasswordChangeCode = useCallback(async () => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Não autenticado.");

        const res = await fetch("/api/auth/request-password-change-code", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Erro ao enviar código.");
        return json;
    }, []);

    const verifyPasswordChangeCode = useCallback(async (code, newPassword) => {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Não autenticado.");

        const res = await fetch("/api/auth/verify-password-change-code", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ code, newPassword }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Código inválido.");
        return json;
    }, []);

    // Atualizar configurações globais do sistema
    const updateSystemSettings = useCallback(async (data) => {
        if (!companyId) return;
        try {
            const systemDocRef = doc(db, "system_settings", companyId);
            await setDoc(
                systemDocRef,
                {
                    ...data,
                    companyId: companyId,
                    updatedAt: new Date(),
                },
                { merge: true },
            );
            toast.success("Configurações do sistema atualizadas");
        } catch (error) {
            console.error("Erro ao atualizar configurações:", error);
            toast.error(getErrorMessage(error, "Erro ao atualizar configurações"));
            throw error;
        }
    }, [companyId]);

    const value = useMemo(()=>({
        userSettings,
        setUserSettings,
        systemSettings,
        loading,
        updateProfile,
        changePassword,
        updateSystemSettings,
        requestPasswordChangeCode,
        verifyPasswordChangeCode,
    }), [userSettings, systemSettings, loading, updateProfile, changePassword,requestPasswordChangeCode,verifyPasswordChangeCode, updateSystemSettings]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
