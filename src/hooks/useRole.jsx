import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRolePermissions } from "@/context/RolePermissionsContext";
import { ROLES } from "@/lib/roles";

export function useRole() {
    const { currentUser } = useAuth();
    const { permissions } = useRolePermissions();
    const role = currentUser?.role ?? null;

    const hasRole = useCallback(
        (...roles) => roles.includes(role),
        [role]
    );

    const can = useCallback(
        (permission) => {
            if (role === ROLES.MASTER) return true;
            return permissions?.[permission]?.includes(role) ?? false;
        },
        [role, permissions]
    );

    return { role, can, hasRole };
}