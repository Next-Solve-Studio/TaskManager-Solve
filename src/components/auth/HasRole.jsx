"use client"

// Componente  de CARGO.
// Renderiza children APENAS se o usuário tiver um dos cargos informados.
//
// Uso básico (um cargo):
//   <HasRole role="administrador">
//     <PainelAdmin />
//   </HasRole>
//
// Múltiplos cargos:
//   <HasRole role={["administrador", "lider_de_projetos"]}>
//     <BotaoNovaTask />
//   </HasRole>
//
// Com fallback:
//   <HasRole role="administrador" fallback={<p>Apenas admins</p>}>
//     <ConfiguracoesSistema />
//   </HasRole>
import { useRole } from "@/hooks/useRole"

export default function HasRole({ role, fallback = null, children }) {
    const { hasRole } = useRole()
    const roles = Array.isArray(role) ? role : [role]
    return hasRole(...roles) ? children : fallback // so mostra o children se tiver o cargo na lista de roles criada acima
}
