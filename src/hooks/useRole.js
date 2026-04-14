import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/roles";

export function useRole() {
  const { currentUser } = useAuth();
  const role = currentUser?.role ?? null; // atribui a role o valor de currentUser.role caso exista
  const hasRole = (...roles) => roles.includes(role);

  const can = (permission) => {
    return PERMISSIONS[permission]?.includes(role) ?? false;
  };

  return { role, can, hasRole };
}
