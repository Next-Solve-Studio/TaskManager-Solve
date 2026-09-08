"use client";
import { useState } from "react";
import { MdNotificationsNone, MdSearch } from "react-icons/md";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { BurgerButton } from "../sideMenu/sideMenuItems/BurgerBtn";
import GlobalSearch from "./GlobalSearch";
import { useAuth } from "@/context/AuthContext";
import { menuItems } from "../sideMenu/sideMenuItems/MenuItems";

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

export default function Header({ onMenuClick, isMobile }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();
    const { currentUser } = useAuth();

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
                    {/* Esquerda: título da página */}
                    <div className="w-44 shrink-0">
                        <PageTitle pathname={pathname} />
                    </div>

                    {/* Centro: busca centralizada */}
                    <div className="flex-1 flex justify-center">
                        <div className="w-full max-w-110">
                            <GlobalSearch isMobile={false} searchOpen={true} setSearchOpen={() => {}} />
                        </div>
                    </div>

                    {/* Direita: sino + avatar */}
                    <div className="w-44 shrink-0 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            title="Notificações (em breve)"
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                        >
                            <MdNotificationsNone size={21} />
                        </button>
                        <UserAvatar currentUser={currentUser} />
                    </div>
                </div>
            )}

            {/* ── MOBILE ── */}
            {isMobile && (
                <div className="relative flex items-center w-full h-full px-3 gap-2">
                    {/* Estado normal */}
                    <div className={`absolute inset-0 flex items-center px-3 gap-2 transition-all duration-300 ${searchOpen ? "opacity-0 pointer-events-none translate-y-1" : "opacity-100 translate-y-0"}`}>
                        <button type="button" title="Notificações (em breve)"
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                            <MdNotificationsNone size={21} />
                        </button>
                        <div className="flex-1" />
                        <button type="button" onClick={() => setSearchOpen(true)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                            <MdSearch size={20} />
                        </button>
                        <BurgerButton isOpen={false} onClick={onMenuClick} />
                    </div>

                    {/* Estado de busca */}
                    <div className={`absolute inset-0 flex items-center px-3 gap-2 transition-all duration-300 ${searchOpen ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-1"}`}>
                        <GlobalSearch isMobile={true} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
                    </div>
                </div>
            )}
        </header>
    );
}