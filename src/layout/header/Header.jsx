"use client";
import { useState, useRef, useEffect } from "react";
import { MdNotificationsNone, MdSearch } from "react-icons/md";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { BurgerButton } from "../sideMenu/sideMenuItems/BurgerBtn";
import GlobalSearch from "./GlobalSearch";
import NotificationPanel from "./NotificationPanel";
import { useAuth } from "@/context/AuthContext";
import { menuItems } from "../sideMenu/sideMenuItems/MenuItems";
import { useNotifications } from "@/hooks/useNotifications";

function PageTitle({ pathname }) {
    const item = menuItems.find(m =>
        m.href === "/" ? pathname === "/" : pathname.startsWith(m.href)
    );
    return (
        <span className="text-sm font-semibold text-text-secondary truncate">
            {item?.label ?? ""}
        </span>
    );
}

function UserAvatar({ currentUser }) {
    const name = currentUser?.name || currentUser?.displayName || "";
    const initial = name.charAt(0).toUpperCase();
    return (
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border-main bg-bg-surface flex items-center justify-center shrink-0">
            {currentUser?.photoURL ? (
                <Image src={currentUser.photoURL} alt="avatar" width={32} height={32} className="object-cover" />
            ) : (
                <span className="text-xs font-bold text-text-primary">{initial}</span>
            )}
        </div>
    );
}

function BellButton({ count, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title="Notificações"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
        >
            <MdNotificationsNone size={21} />
            {count > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black leading-none px-0.5">
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </button>
    );
}

export default function Header({ onMenuClick, isMobile }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const pathname = usePathname();
    const { currentUser } = useAuth();
    const { notifications, loading, count, markRead, clearAll } = useNotifications();
    const bellRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!notifOpen) return;
        function handleClickOutside(e) {
            const inBell = bellRef.current?.contains(e.target);
            const inPanel = panelRef.current?.contains(e.target);
            if (!inBell && !inPanel) setNotifOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notifOpen]);

    const toggleNotif = () => setNotifOpen(o => !o);

    const panelProps = { notifications, loading, markRead, clearAll, onClose: () => setNotifOpen(false) };

    return (
        <header
            className={`fixed top-0 ${isMobile ? "left-0" : "left-20"} right-0 z-30 h-14 flex items-center`}
            style={{
                background: "",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.25)",
            }}
        >
            {/* ── DESKTOP ── */}
            {!isMobile && (
                <div className="flex items-center w-full px-5 gap-4">
                    <div className="w-44 shrink-0">
                        <PageTitle pathname={pathname} />
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="w-full max-w-110">
                            <GlobalSearch isMobile={false} searchOpen={true} setSearchOpen={() => {}} />
                        </div>
                    </div>

                    <div className="w-44 shrink-0 flex items-center justify-end gap-2">
                        <div className="relative">
                            <div ref={bellRef}>
                                <BellButton count={count} onClick={toggleNotif} />
                            </div>
                            {notifOpen && (
                                <div className="absolute top-full right-0 mt-2 z-50">
                                    <NotificationPanel ref={panelRef} {...panelProps} />
                                </div>
                            )}
                        </div>
                        <UserAvatar currentUser={currentUser} />
                    </div>
                </div>
            )}

            {/* ── MOBILE ── */}
            {isMobile && (
                <div className="relative flex items-center w-full h-full px-3 gap-2">
                    <div className={`absolute inset-0 flex items-center px-3 gap-2 transition-all duration-300 ${searchOpen ? "opacity-0 pointer-events-none translate-y-1" : "opacity-100 translate-y-0"}`}>
                        <div ref={bellRef}>
                            <BellButton count={count} onClick={toggleNotif} />
                        </div>
                        <div className="flex-1" />
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                        >
                            <MdSearch size={20} />
                        </button>
                        <BurgerButton isOpen={false} onClick={onMenuClick} />
                    </div>

                    <div className={`absolute inset-0 flex items-center px-3 gap-2 transition-all duration-300 ${searchOpen ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-1"}`}>
                        <GlobalSearch isMobile={true} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
                    </div>

                    {notifOpen && !searchOpen && (
                        <div className="fixed top-14 left-3 right-3 z-50">
                            <NotificationPanel ref={panelRef} {...panelProps} />
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}