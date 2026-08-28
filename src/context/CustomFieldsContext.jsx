"use client";
import {
    doc,
    onSnapshot,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebaseConfig";
import { logActivity } from "@/utils/ActivityLogger";

const CustomFieldsContext = createContext();

export const useCustomFields = () => useContext(CustomFieldsContext);

export const CustomFieldsProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [clientFields, setClientFields] = useState([]);
    const [projectFields, setProjectFields] = useState([]);
    const [taskFields, setTaskFields] = useState([]);
    const [userFields, setUserFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.companyId) {
            setClientFields([]);
            setProjectFields([]);
            setTaskFields([]);
            setUserFields([]);
            setLoading(false);
            return;
        }

        const entities = [
            { name: "client", setter: setClientFields },
            { name: "project", setter: setProjectFields },
            { name: "task", setter: setTaskFields },
            { name: "user", setter: setUserFields },
        ];

        const unsubscribers = entities.map(({ name, setter }) => {
            // customFields/{companyId}/{entity}/customData
            const ref = doc(db, "customFields", currentUser.companyId, name, "customData");
            return onSnapshot(
                ref,
                (snapshot) => {
                    if (snapshot.exists()) {
                        setter(snapshot.data().fields || []);
                    } else {
                        setter([]);
                    }
                },
                (error) => {
                    console.error(`Erro ao ouvir campos de ${name}`, error);
                }
            );
        });
        
        setLoading(false);

        return () => {
            unsubscribers.forEach((unsub) => unsub());
        };
    }, [currentUser?.companyId]);

    const saveCustomFields = useCallback(
        async (entity, fields) => {
            if (!currentUser?.companyId) throw new Error("Usuário não vinculado a uma empresa");

            try {
                const ref = doc(db, "customFields", currentUser.companyId, entity, "customData");
                await setDoc(ref, {
                    fields,
                    updatedAt: serverTimestamp(),
                    updatedBy: currentUser.uid,
                }, { merge: true });

                await logActivity({
                    userId: currentUser.uid,
                    userName: currentUser.name || currentUser.displayName,
                    companyId: currentUser.companyId,
                    userPhoto: currentUser.photo || currentUser.photoURL,
                    action: "update",
                    resourceType: "customFields",
                    resourceId: entity,
                    resourceName: `Campos de ${entity}`,
                });

                toast.success("Campos atualizados com sucesso");
            } catch (error) {
                console.error("Erro ao salvar campos personalizados:", error);
                toast.error(getErrorMessage(error, "Erro ao salvar campos personalizados"));
                throw error;
            }
        },
        [currentUser],
    );

    const value = useMemo(() => ({
        clientFields,
        projectFields,
        taskFields,
        userFields,
        loading,
        saveCustomFields,
    }), [clientFields, projectFields, taskFields, userFields, loading, saveCustomFields]);

    return (
        <CustomFieldsContext.Provider value={value}>
            {children}
        </CustomFieldsContext.Provider>
    );
};
