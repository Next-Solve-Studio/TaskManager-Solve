"use client";
import { useMemo } from "react";
import { MdMoreVert } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import RoleBadge from "@/components/auth/RoleBadge";
import { Avatar } from "@/components/ui/AvatarBadge";

export default function UserRow({ user, onOpenMenu }) {
    const formattedDate = useMemo(() => {
        if (!user.createdAt) return "—";
        const date = user.createdAt?.toDate?.() ?? new Date(user.createdAt);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }, [user.createdAt]);

    /* const authLabel = user.authMethod === "google" ? "Google" : "E-mail";
    const authColor =
        user.authMethod === "google" ? "#ea4335" : "var(--color-cyan-400)";
    const authBg =
        user.authMethod === "google"
            ? "rgba(234,67,53,0.1)"
    //         : "rgba(34,211,238,0.1)";*/
   // Exibe o acesso mais recente 
    const lastSeen = user.lastSeenAt?.toDate?.()?.toLocaleDateString("pt-BR") ?? "—";

    return (
        <div
            className="grid grid-cols-[48px_1fr_160px_100px_100px_72px] 
            gap-4 items-center px-5 py-3 bg-bg-card
            rounded-xl border border-border-main shadow-sm
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
            <div>
                <p className="text-text-primary font-bold text-sm m-0 mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.name}
                </p>
                <p className="text-text-secondary text-xs m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.email}
                </p>
            </div>

            {/* Cargo */}
            <div className="flex items-center justify-start">
                <RoleBadge role={user.role} />
            </div>

            {/* último login */}
            <div className="flex items-center justify-center">
                <span className="text-[11px] text-text-muted whitespace-nowrap">
                    {lastSeen}
                </span>
            </div>

            {/* Data de entrada */}
            <div className="flex items-center justify-center">
                <span className="text-[11px] text-text-muted whitespace-nowrap">
                    {formattedDate}
                </span>
            </div>

            

            {/* Ações */}
            <CanDo permission="canManageUsers">
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={(e) => onOpenMenu(e, user)}
                        title="Ações"
                        className="bg-none border-none cursor-pointer p-1 flex rounded-md text-text-muted hover:text-text-primary transition-colors"
                    >
                        <MdMoreVert size={18} />
                    </button>
                </div>
            </CanDo>
        </div>
    );
}
