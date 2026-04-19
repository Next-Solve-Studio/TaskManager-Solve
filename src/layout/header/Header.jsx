"use client";
import { BurgerButton } from "../sideMenu/sideMenuItems/BurgerBtn";

export default function Header({ onMenuClick, isMobile }) {
    if (!isMobile) return null; // só mostra no mobile

    return (
        <>
            {isMobile ? (
                <header className="w-[90%] max-w-13 mr-auto h-10 flex items-end justify-end px-4 fixed top-0 right-0 z-50 bg-transparent pb-1">
                    <BurgerButton isOpen={false} onClick={onMenuClick} />
                </header>
            ) : (
                ""
            )}
        </>
    );
}
