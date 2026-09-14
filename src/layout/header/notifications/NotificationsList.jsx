import { MdNotificationsNone } from "react-icons/md"
import NotifItem from "./NotifItem"

export default function NotificationsList({notifications, markRead, onClose}){
        if (notifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mb-3">
                        <MdNotificationsNone className="text-brand-400 text-2xl" />
                    </div>
                    <p className="text-text-primary font-semibold text-sm">Tudo em dia!</p>
                    <p className="text-text-muted text-xs mt-1">
                        Nenhuma pendência ou evento próximo.
                    </p>
                </div>
            )
        } else{
            return (
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
            )
        }
    }
