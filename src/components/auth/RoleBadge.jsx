"use client";
//Exibe o cargo do usuário logado
import { useRole } from "@/hooks/useRole";
import { ROLE_LABELS, ROLES_STYLES } from "@/lib/roles";

export default function RoleBadge({ role: propRole }) {
  const { role: currentRole } = useRole();
  const role = propRole ?? currentRole;

  if (!role) return null;

  const label = ROLE_LABELS[role] ?? role;
  const colors = ROLES_STYLES[role] ?? {
    bg: "bg-bg-hover/60",
    text: "text-bg-hover2",
    border: "border-bg-hover/60",
  };

  return (
    <span
      className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                border ${colors.bg} ${colors.text} ${colors.border}
            `}
    >
      {label}
    </span>
  );
}
