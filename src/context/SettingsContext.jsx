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
    useState,
} from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebaseConfig";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [userSettings, _setUserSettings] = useState(null);
    const [systemSettings, setSystemSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ouvir configurações do sistema (Global)
    useEffect(() => {
        const systemDocRef = doc(db, "system_settings", "config");
        const unsubscribe = onSnapshot(systemDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setSystemSettings(docSnap.data());
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Atualizar perfil do usuário (name, preferences, etc)
    const updateProfile = useCallback(
        async (data) => {
            if (!currentUser?.uid) return;

            try {
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, {
                    name: data.name,
                    preferences: data.preferences || {},
                    updatedAt: new Date(),
                });
                toast.success("Perfil atualizado com sucesso");
            } catch (error) {
                console.error("Erro ao atualizar perfil:", error);
                toast.error("Erro ao atualizar perfil");
                throw error;
            }
        },
        [currentUser],
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
                toast.error("Erro ao alterar senha");
            }
            throw error;
        }
    }, []);

    // Atualizar configurações globais do sistema
    const updateSystemSettings = useCallback(async (data) => {
        try {
            const systemDocRef = doc(db, "system_settings", "config");
            await setDoc(
                systemDocRef,
                {
                    ...data,
                    updatedAt: new Date(),
                },
                { merge: true },
            );
            toast.success("Configurações do sistema atualizadas");
        } catch (error) {
            console.error("Erro ao atualizar configurações:", error);
            toast.error("Erro ao atualizar configurações");
            throw error;
        }
    }, []);

    const value = {
        userSettings,
        systemSettings,
        loading,
        updateProfile,
        changePassword,
        updateSystemSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
