"use client";
import { useMemo } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import RoleBadge from "@/components/auth/RoleBadge";
import { Avatar } from "@/components/ui/AvatarBadge";

export default function UserRow({ user, onEdit, onDelete }) {
    const formattedDate = useMemo(() => {
        if (!user.createdAt) return "—";
        const date = user.createdAt?.toDate?.() ?? new Date(user.createdAt);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }, [user.createdAt]);

    const authLabel = user.authMethod === "google" ? "Google" : "E-mail";
    const authColor =
        user.authMethod === "google" ? "#ea4335" : "var(--color-cyan-400)";
    const authBg =
        user.authMethod === "google"
            ? "rgba(234,67,53,0.1)"
            : "rgba(34,211,238,0.1)";

    return (
        <div
            className="grid grid-cols-[48px_1fr_160px_100px_100px_72px] 
            gap-4 items-center px-5 py-3 bg-bg-card
            rounded-xl border border-border-main
            transition-[border-color_0.2s,transform_0.2s] hover:border-brand-500/30 group sm:hover:-translate-y-px"
        >
            {/* Avatar */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                    name={user.name}
                    uid={user.id}
                    size={36}
                    src={user.photo}
                />
            </div>

            {/* Nome + Email */}
            <div style={{ minWidth: 0 }}>
                <p className="text-text-primary font-bold text-sm m-0 mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.name}
                </p>
                <p className="text-text-secondary text-xs m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.email}
                </p>
            </div>

            {/* Cargo */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <RoleBadge role={user.role} />
            </div>

            {/* Auth method */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: authBg,
                        fontSize: 11,
                        fontWeight: 600,
                        color: authColor,
                        whiteSpace: "nowrap",
                    }}
                >
                    {authLabel}
                </span>
            </div>

            {/* Data de entrada */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <span className="text-[11px] text-text-muted whitespace-nowrap">
                    {formattedDate}
                </span>
            </div>

            {/* Ações */}
            <CanDo permission="canManageUsers">
                <div
                    style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Editar cargo"
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "rgba(34,211,238,0.07)",
                            border: "1px solid rgba(34,211,238,0.15)",
                            color: "#22d3ee",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "rgba(34,211,238,0.15)";
                            e.currentTarget.style.borderColor =
                                "rgba(34,211,238,0.35)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "rgba(34,211,238,0.07)";
                            e.currentTarget.style.borderColor =
                                "rgba(34,211,238,0.15)";
                        }}
                    >
                        <MdEdit size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(user)}
                        title="Excluir usuário"
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "rgba(239,68,68,0.07)",
                            border: "1px solid rgba(239,68,68,0.15)",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "rgba(239,68,68,0.15)";
                            e.currentTarget.style.borderColor =
                                "rgba(239,68,68,0.35)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "rgba(239,68,68,0.07)";
                            e.currentTarget.style.borderColor =
                                "rgba(239,68,68,0.15)";
                        }}
                    >
                        <MdDelete size={14} />
                    </button>
                </div>
            </CanDo>
        </div>
    );
}
