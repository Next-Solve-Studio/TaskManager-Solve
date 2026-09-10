"use client";
import Link from "next/link";
import { forwardRef } from "react";
import {
    MdAccessTime,
    MdCalendarToday,
    MdClose,
    MdEvent,
    MdFolder,
    MdNotificationsNone,
    MdWarning,
} from "react-icons/md";

const TYPE_CONFIG = {
    task_overdue: {
        icon: MdWarning,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        label: "Tarefa vencida",
    },
    task_soon: {
        icon: MdAccessTime,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        label: "Vence em breve",
    },
    project_overdue: {
        icon: MdWarning,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        label: "Projeto vencido",
    },
    project_soon: {
        icon: MdFolder,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        label: "Prazo próximo",
    },
    event_today: {
        icon: MdEvent,
        color: "text-brand-400",
        bg: "bg-brand-500/10",
        border: "border-brand-500/20",
        label: "Evento hoje",
    },
    event_upcoming: {
        icon: MdCalendarToday,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        label: "Em breve",
    },
};

function NotifItem({ notif, onClose, markRead }) {
    const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.task_soon;
    const Icon = cfg.icon;

    const handleDismiss = (e) => {
        e.preventDefault();
        e.stopPropagation();
        markRead(notif.id);
    };

    return (
        <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
            {/* Conteúdo clicável navega para a página */}
            <Link
                href={notif.href}
                onClick={onClose}
                className="flex items-start gap-3 flex-1 min-w-0"
            >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                    <Icon className={`${cfg.color} text-[15px]`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-[13px] font-semibold truncate group-hover:text-brand-400 transition-colors">
                        {notif.title}
                    </p>
                    <p className="text-text-muted text-[11px] mt-0.5">{notif.subtitle}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${cfg.bg} ${cfg.color} whitespace-nowrap`}>
                    {cfg.label}
                </span>
            </Link>

            {/* Botão dispensar — aparece no hover */}
            <button
                type="button"
                onClick={handleDismiss}
                title="Marcar como lida"
                className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-white/10"
            >
                <MdClose size={13} />
            </button>
        </div>
    );
}

const NotificationPanel = forwardRef(function NotificationPanel(
    { onClose, notifications, loading, markRead, clearAll },
    ref
) {
    return (
        <div
            ref={ref}
            className="w-[360px] max-w-[calc(100vw-24px)] max-h-[480px] overflow-y-auto rounded-2xl border border-border-main shadow-2xl"
            style={{
                background: "var(--color-bg-card)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
        >
            {/* Cabeçalho */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b border-border-main sticky top-0 z-10"
                style={{ background: "var(--color-bg-card)" }}
            >
                <div className="flex items-center gap-2">
                    <MdNotificationsNone className="text-brand-400 text-lg" />
                    <span className="text-text-primary font-bold text-sm">Notificações</span>
                    {notifications.length > 0 && (
                        <span className="bg-brand-500/15 text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {notifications.length}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {notifications.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-[11px] font-semibold text-text-muted hover:text-text-primary transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                        >
                            Limpar tudo
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-white/5"
                    >
                        <MdClose size={16} />
                    </button>
                </div>
            </div>

            {/* Conteúdo */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent animate-spin rounded-full" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mb-3">
                        <MdNotificationsNone className="text-brand-400 text-2xl" />
                    </div>
                    <p className="text-text-primary font-semibold text-sm">Tudo em dia!</p>
                    <p className="text-text-muted text-xs mt-1">
                        Nenhuma pendência ou evento próximo.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-border-main/50">
                    {notifications.map((n) => (
                        <NotifItem
                            key={n.id}
                            notif={n}
                            onClose={onClose}
                            markRead={markRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default NotificationPanel;