import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/roles";

export function useRole() {
    const { currentUser } = useAuth()
    const role = currentUser?.role ?? null

    const can = (permission)  =>  {
        return PERMISSIONS[permission]?.includes(role) ?? false
    }

    return { role, can}
}