"use client";
// Componente de PERMISSÃO.
// Renderiza children APENAS se o usuário tiver a permissão informada.
//
// Uso básico:
//   <CanDo permission="canCreateTasks">
//     <button>Nova Tarefa</button>
//   </CanDo>
//
// Com fallback (mostrar algo para quem não tem acesso):
//   <CanDo permission="canManageUsers" fallback={<p>Sem acesso</p>}>
//     <PainelAdmin />
//   </CanDo>

import { useRole } from "@/hooks/useRole";

export default function CanDo({ permission, fallback = null, children }) {
  const { can } = useRole();
  return can(permission) ? children : fallback; // retorna true se o cargo do usuário estiver na lista de papéis autorizados para aquela permissão.
}
