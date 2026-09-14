'use client'
import Link from "next/link";
import { TYPE_CONFIG } from "./NotificationType";
import { MdClose } from "react-icons/md";

export default function NotifItem({ notif, onClose, markRead }){
    const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.task_soon;
    const Icon = cfg.icon;

    const handleDismiss = (e) => {
        e.preventDefault();
        e.stopPropagation();
        markRead(notif.id);
    };

    return (
        <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
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