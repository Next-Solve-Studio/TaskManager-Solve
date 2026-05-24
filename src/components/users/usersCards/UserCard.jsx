"use client";
import { useMemo } from "react";
import { MdCalendarToday, MdEmail, MdMoreVert } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import RoleBadge from "@/components/auth/RoleBadge";
import { Avatar } from "@/components/ui/AvatarBadge";
import { AuthBadge } from "../AuthBadge";

export function UserCard({ user, onOpenMenu }) {
    const formattedDate = useMemo(() => {
        if (!user.createdAt) return "—";
        const date = user.createdAt?.toDate?.() ?? new Date(user.createdAt);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }, [user.createdAt]);

    // Exibe o acesso mais recente
    const lastSeen = user.lastSeenAt?.toDate?.()?.toLocaleDateString("pt-BR") ?? "—";

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
                    <button
                        type="button"
                        onClick={(e) => onOpenMenu(e, user)}
                        title="Ações"
                        className="bg-none border-none cursor-pointer p-1 flex rounded-md text-text-muted hover:text-text-primary transition-colors shrink-0"
                    >
                        <MdMoreVert size={18} />
                    </button>
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
                
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[11px] text-text-muted">Últ. Acesso</span>
                        <div className="flex items-center gap-1">
                            <MdCalendarToday size={11} className="text-text-muted" />
                            <span className="text-[11px] text-text-muted whitespace-nowrap">
                                {lastSeen}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[11px] text-text-muted">Entrada</span>
                        <div className="flex items-center gap-1">
                            <MdCalendarToday size={11} className="text-text-muted" />
                            <span className="text-[11px] text-text-muted whitespace-nowrap">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
