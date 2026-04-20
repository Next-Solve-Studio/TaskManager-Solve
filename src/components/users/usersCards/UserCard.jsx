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
        <div
            style={{
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "border-color 0.2s",
            }}
        >
            {/* Top row: avatar + name/email + actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={user.name} uid={user.id} size={44} src={user.photo} />

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            color: "#f1f5f9",
                            fontWeight: 600,
                            fontSize: 14,
                            margin: 0,
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
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
                            style={{ color: "#4b5563", flexShrink: 0 }}
                        />
                        <p
                            style={{
                                color: "#6b7280",
                                fontSize: 12,
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
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
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

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
                    <MdCalendarToday size={11} style={{ color: "#4b5563" }} />
                    <span
                        style={{
                            fontSize: 11,
                            color: "#4b5563",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {formattedDate}
                    </span>
                </div>
            </div>
        </div>
    );
}
