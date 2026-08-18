import { useAuth } from "@/context/AuthContext";
import { useRolePermissions } from "@/context/RolePermissionsContext";
import { ROLES } from "@/lib/roles";

export function useRole() {
    const { currentUser } = useAuth();
    const {permissions} = useRolePermissions()
    const role = currentUser?.role ?? null; // atribui a role o valor de currentUser.role caso exista
    const hasRole = (...roles) => roles.includes(role);

    const can = (permission) => {
        if (role === ROLES.MASTER) return true
        return permissions?.[permission]?.includes(role) ?? false;
    };

    return { role, can, hasRole };
}
