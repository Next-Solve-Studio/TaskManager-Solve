"use client";
import { forwardRef } from "react";
import {
    MdClose,
    MdNotificationsNone,
} from "react-icons/md";
import NotificationsList from "./NotificationsList";

const NotificationPanel = forwardRef(function NotificationPanel(
    { onClose, notifications, loading, markRead, clearAll },
    ref
) {

    return (
        <div
            ref={ref}
            className="w-90 max-w-[calc(100vw-24px)] max-h-120 overflow-y-auto rounded-2xl border border-border-main shadow-2xl"
            style={{
                background: "var(--color-bg-card)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
        >
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
                        className="text-text-muted sm:cursor-pointer hover:text-text-primary transition-colors p-1 rounded-md hover:bg-white/5"
                    >
                        <MdClose size={16} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent animate-spin rounded-full" />
                </div>
            ) : <NotificationsList notifications={notifications} onClose={onClose} markRead={markRead}/>}
        </div>
    );
});

export default NotificationPanel;