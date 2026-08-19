"use client"
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { PERMISSIONS, ROLES } from "@/lib/roles";

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
    const {currentUser} = useAuth()
    const [permissions, setPermissions] = useState(null)
    const [loadingPermissions, setLoadingPermissions] = useState(true)

    useEffect(()=>{
        if( !currentUser?.companyId) {
            setPermissions(null)
            setLoadingPermissions(false)
            return;
        }

        const q = doc(db, "role_permissions", currentUser.companyId)
        const unsubscribe = onSnapshot (
            q,
            (snapshot) => {
                setPermissions(snapshot.exists() ? snapshot.data().permissions : null)
            },
            (error) => {
                console.error("Erro ao carregar permissões da empresa: ", error);
                toast.error("Erro ao carregar permissões da empresa !")
                setPermissions(null)
                setLoadingPermissions(false)
            },
        )
        return unsubscribe
    },[currentUser?.companyId])

    const updatePermission = useCallback(async (permissionKey, roles) => {
        if (!currentUser.companyId) throw new Error("Usuário não vinculado a uma empresa")
        if (currentUser.role !== ROLES.MASTER) throw new Error ("Apenas o master pode alterar permissões.")
            
        const q = doc (db, "role_permissions", currentUser.companyId)
        const base = permissions ?? buildDefaultPermissions()

        await setDoc(
            q,
            {
                companyId: currentUser.companyId,
                permissions: { ...base, [permissionKey]: roles},
                updateAt: new Date(),
                updateBy: currentUser.uid,
            },
            { merge:true },
        )
    }, [currentUser.companyId, currentUser.role, currentUser.uid, permissions])

    const value = useMemo(
        () => ({
            permissions: permissions ?? buildDefaultPermissions(),
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