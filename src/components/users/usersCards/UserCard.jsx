"use client";
import { useMemo } from "react";
import { MdCalendarToday, MdDelete, MdEdit, MdEmail } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import RoleBadge from "@/components/auth/RoleBadge";
import { Avatar } from "@/components/ui/AvatarBadge";
import { AuthBadge } from "../AuthBadge";

export function UserCard({ user, onEdit, onDelete }) {
    const formattedDate = useMemo(() => {
        if (!user.createdAt) return "—";
        const date = user.createdAt?.toDate?.() ?? new Date(user.createdAt);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }, [user.createdAt]);

    return (
        <div className="bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200">
            {/* Top row: avatar + name/email + actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar
                    name={user.name}
                    uid={user.id}
                    size={44}
                    src={user.photo}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="text-text-primary font-bold text-sm m-0 mb-0.5">
                        {user.name}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <MdEmail
                            size={11}
                            className="text-text-muted shrink-0"
                        />
                        <p className="text-text-secondary text-xs m-0 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <CanDo permission="canManageUsers">
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button
                            type="button"
                            onClick={() => onEdit(user)}
                            title="Editar cargo"
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                background: "rgba(34,211,238,0.07)",
                                border: "1px solid rgba(34,211,238,0.18)",
                                color: "#22d3ee",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s",
                            }}
                        >
                            <MdEdit size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(user)}
                            title="Excluir usuário"
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                background: "rgba(239,68,68,0.07)",
                                border: "1px solid rgba(239,68,68,0.18)",
                                color: "#ef4444",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s",
                            }}
                        >
                            <MdDelete size={15} />
                        </button>
                    </div>
                </CanDo>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-main" />

            {/* Bottom row: role + auth + date */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    <RoleBadge role={user.role} />
                    <AuthBadge authMethod={user.authMethod} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MdCalendarToday size={11} className="text-text-muted" />
                    <span className="text-[11px] text-text-muted whitespace-nowrap">
                        {formattedDate}
                    </span>
                </div>
            </div>
        </div>
    );
}
