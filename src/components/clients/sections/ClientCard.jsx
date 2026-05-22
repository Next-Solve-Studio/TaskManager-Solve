"use client";

import {
    MdEmail,
    MdFingerprint,
    MdMoreVert,
    MdPhone,
} from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import useIsTablet from "@/hooks/responsive/useIsTablet";

export default function ClientCard({ client, onOpenMenu }) {
    const isTablet = useIsTablet();

    return (
        <div
            className={`
            bg-bg-card border border-border-main rounded-2xl 
            ${isTablet ? "p-3 gap-2.5" : "p-4 gap-3"} 
            flex flex-col transition-all duration-200 hover:border-brand-500/20 group
        `}
        >
            {/* Top row: avatar + name/documento + actions */}
            <div
                className={`flex items-center ${isTablet ? "gap-2" : "gap-3"}`}
            >
                <div
                    className={`
                    rounded-full bg-brand-500/10 border border-brand-500/20 
                    flex items-center justify-center text-brand-500 font-bold
                    ${isTablet ? "w-9 h-9 text-sm" : "w-11 h-11 text-lg"}
                `}
                >
                    {client.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <p
                        className={`
                          text-text-primary font-bold text-base group-hover:text-brand-500 transition-colors
                        ${isTablet ? "text-xs" : "text-sm"}
                    `}
                    >
                        {client.name}
                    </p>
                    {client.documento && (
                        <div className="flex items-center gap-1">
                            <MdFingerprint
                                size={11}
                                className="text-text-muted shrink-0"
                            />
                            <p
                                className={`
                                text-text-secondary truncate
                                ${isTablet ? "text-[10px]" : "text-xs"}
                            `}
                            >
                                {client.documento}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <CanDo permission="canManageClients">
                    <div className="flex items-center justify-start">
                        <button
                            type="button"
                            onClick={(e) => onOpenMenu(e, client)}
                            title="Ações"
                            className="bg-none border-none cursor-pointer p-1 flex rounded-md text-text-muted hover:text-text-primary transition-colors"
                        >
                            <MdMoreVert size={18} />
                        </button>
                    </div>
                </CanDo>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-main" />

            {/* Bottom row: email + phone + status */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    {client.email && (
                        <div
                            className={`
                            flex items-center gap-1 text-text-secondary
                            ${isTablet ? "text-[10px]" : "text-xs"}
                        `}
                        >
                            <MdEmail
                                size={isTablet ? 12 : 14}
                                className="text-brand-500"
                            />
                            <span>{client.email}</span>
                        </div>
                    )}
                    {client.contato && (
                        <div
                            className={`
                            flex items-center gap-1 text-text-secondary
                            ${isTablet ? "text-[10px]" : "text-xs"}
                        `}
                        >
                            <MdPhone
                                size={isTablet ? 12 : 14}
                                className="text-cyan-400"
                            />
                            <span>{client.contato}</span>
                        </div>
                    )}
                </div>

                <div>
                    <span
                        className={`
                        inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest
                        ${
                            client.status === "active"
                                ? "bg-brand-500/10 text-brand-500 border border-brand-500/30"
                                : "bg-bg-surface text-text-muted border border-border-main"
                        }
                    `}
                    >
                        {client.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                </div>
            </div>
        </div>
    );
}
