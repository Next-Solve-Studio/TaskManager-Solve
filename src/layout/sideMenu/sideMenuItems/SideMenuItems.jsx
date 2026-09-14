"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";
import { BurgerButton } from "./BurgerBtn";
import { menuItems } from "./MenuItems";
import LogoutButton from "./LogoutButton";
import UserInfo from "./UserInfo";

export default function SideMenuItems({ isOpen, onToggle, isMobile }) {
    const [hoverOpen, setHoverOpen] = useState(false);
    // No desktop, o menu abre com hover (ou se isOpen for true, mas isOpen só é usado no mobile)
    const effectiveOpen = isMobile ? isOpen : hoverOpen;
    const { role } = useRole();
    const { logout } = useAuth();
    const pathname = usePathname();

    const handleMouseEnter = isMobile ? undefined : () => setHoverOpen(true);
    const handleMouseLeave = isMobile ? undefined : () => setHoverOpen(false);

    //filtrar os itens com base no cargo do usuário
    const visibleItems = menuItems.filter(
        (item) => !item.roles || item.roles.includes(role),
    );

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const isOpenView = () => {
        if (isOpen) {
            return "translate-x-0"
        } else {
            return "translate-x-full"
        }
    }

    const effectiveOpenView = () => {
        if (effectiveOpen) {
            return "w-58 items-start"
        } else {
            return "w-20 items-center"
        }
    }

    const containerClasses = isMobile
        ? `fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
       bg-gradient-to-br from-bg-main via-bg-card to-bg-main shadow-xl
       ${isOpenView()}`
        : `fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out
            bg-gradient-to-br from-bg-main via-bg-card to-bg-main shadow-xl
            ${effectiveOpenView()}`;


    return (
        <nav
            className={containerClasses}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Menu lateral"
        >
            <div className={` max-h-screen flex flex-col gap-3 py-10 `}>
                {isMobile && isOpen && (
                    <div className="flex justify-end mb-5 w-full pr-4">
                        <BurgerButton isOpen={isOpen} onClick={onToggle} />
                    </div>
                )}
                <UserInfo effectiveOpen={effectiveOpen}/>
                <div
                    className={`h-px rouned-[5px] bg-border-main my-1 mx-auto ${effectiveOpen ? "w-[90%]" : "w-[70%]"}`}
                />
                <div className="flex flex-col items-center gap-2 w-full sm:px-4">
                    {visibleItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={isMobile ? onToggle : undefined}
                                className={`h-12 flex items-center text-text-secondary sm:hover:text-text-primary sm:hover:bg-bg-surface rounded-lg transition-colors duration-200 group
                                    ${
                                        active
                                            ? "text-text-primary bg-bg-surface"
                                            : "text-text-secondary sm:hover:text-text-primary sm:hover:bg-bg-surface"
                                    }`}
                            >
                                <div className="w-12 flex justify-center shrink-0">
                                    <item.icon
                                        className={`text-xl transition-transform duration-200 sm:group-hover:scale-110
                                        ${active ? "text-primary" : ""}`}
                                    />
                                </div>

                                <div
                                    className={`sm:ml-1 transition-all duration-300 ease-in-out overflow-hidden ${effectiveOpen ? "opacity-100 w-40" : "opacity-0 w-0"}`}
                                >
                                    <span className="text-sm font-medium whitespace-nowrap tracking-wide">
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <LogoutButton logout={logout} effectiveOpen={effectiveOpen}/>
            </div>
        </nav>
    );
}
