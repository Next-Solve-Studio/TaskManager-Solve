"use client"
import { doc, onSnapshot, } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { PERMISSIONS, ROLES } from "@/lib/roles";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useCurrentUser } from "@/hooks/useCurrentUser";


const RolePermissionsContext = createContext()

export const useRolePermissions = () => useContext(RolePermissionsContext)

const buildDefaultPermissions = () => {
    const result = {};
    for (const [key, roles] of Object.entries(PERMISSIONS)) {
        result[key] = roles.filter((r) => r !== ROLES.MASTER);
    }
    return result;
};

export const RolePermissionsProvider = ({children}) => {
    const { companyId, role } = useCurrentUser();
    const [permissions, setPermissions] = useState(null)
    const [loadingPermissions, setLoadingPermissions] = useState(true)

    useEffect(()=>{
        if( !companyId) {
            setPermissions(null)
            setLoadingPermissions(false)
            return;
        }

        const q = doc(db, "role_permissions", companyId)
        const unsubscribe = onSnapshot (
            q,
            (snapshot) => {
                setPermissions(snapshot.exists() ? snapshot.data().permissions : null)
                setLoadingPermissions(false);
            },
            (error) => {
                console.error("Erro ao carregar permissões da empresa: ", error);
                toast.error(getErrorMessage(error, "Erro ao carregar permissões da empresa"));
                setPermissions(null)
                setLoadingPermissions(false)
            },
        )
        return unsubscribe
    },[companyId])

    const updatePermission = useCallback(async (permissionKey, roles) => {
        if (!companyId) throw new Error("Usuário não vinculado a uma empresa");
        if (role !== ROLES.MASTER) throw new Error("Apenas o master pode alterar permissões.");

        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Não autenticado.");

        const res = await fetch("/api/role-permissions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ permissionKey, roles }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Erro ao atualizar permissão.");
        }
    }, [companyId, role]);

    const value = useMemo(
        () => ({
            permissions: permissions ? { ...buildDefaultPermissions(), ...permissions } : buildDefaultPermissions(),
            loadingPermissions,
            updatePermission,
        }),[permissions,loadingPermissions, updatePermission]
    )

    return (
        <RolePermissionsContext.Provider value={value}>
            {children}
        </RolePermissionsContext.Provider>
    )
}