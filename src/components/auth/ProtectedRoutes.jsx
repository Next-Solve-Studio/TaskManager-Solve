"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRole } from "@/hooks/useRole";

/**
 * Protege uma rota por Permissão
 * Se o usuário não tiver a permissão, redirenciona para "/"
 *
 * Uso:
 *  <ProtectedRoutes permission="canViewReports">
 *      <MeuComponent/>
 *  </ProtectedRoutes>
 */

export default function ProtectedRoutes({
  permission,
  role,
  redirectTo = "/",
  children,
}) {
  const { can, hasRole } = useRole();
  const router = useRouter();

  // Determina se tem permissão para o acesso
  const allowed = permission ? can(permission) : role ? hasRole(role) : true;

  useEffect(() => {
    // Se allowed for falso, chama redirectTo para redirecionar o usuário
    if (!allowed) {
      router.replace(redirectTo);
    }
  }, [allowed, router, redirectTo]);

  if (!allowed) return null; // Se o acesso não for permitido, o componente não renderiza nada

  return children; // Se for permitido, o componente será renderizado
}
