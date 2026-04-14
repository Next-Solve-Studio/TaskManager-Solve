"use client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import RoleBadge from "@/components/auth/RoleBadge";
import { useRole } from "@/hooks/useRole";
import { auth, db } from "@/lib/firebaseConfig";
import useIsMobile from "@/responsive/useIsMobile";
import { BurgerButton } from "./BurgerBtn";
import { menuItems } from "./MenuItems";
import { useAuth } from "@/context/AuthContext";

export default function SideMenuItems() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const isMobile = useIsMobile();
    const { role } = useRole();
    const { logout } = useAuth()

    //filtrar os itens com base no cargo do usuário
    const visibleItems = menuItems.filter(
        (item) => !item.roles || item.roles.includes(role),
    );

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (!firebaseUser) {
                setDisplayName("");
                return;
            }

            // Se for login pelo google
            if (firebaseUser.displayName) {
                setDisplayName(firebaseUser.displayName);
                return;
            }

            // Se for email e senha, busca o nome da coleção users
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) {
                setDisplayName(snap.data().name);
            }
        });
        return () => unsub();
    }, []);

    const initial = displayName ? displayName.charAt(0).toUpperCase() : "";

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: <>
        <div
            className={`bg-linear-to-br from-bg-pure via-background-page to-bg-pure h-full overflow-hidden ${isOpen ? "w-58 items-start" : "w-20 items-center"} transition-all duration-300 ease-in-out  shadow-xl z-50`}
            onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
            onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
        >
            <div className={` max-h-screen top-0 left-0 flex flex-col gap-3 py-10 `}>
                <div
                    className={`flex mb-5 w-[95%] ] ${isOpen ? " justify-end" : "w-15 justify-center"}`}
                >
                    {isMobile && (
                        <BurgerButton
                            isOpen={isOpen}
                            onClick={() => setIsOpen((prev) => !prev)}
                        />
                    )}
                </div>
                <div className="mb-6 flex items-center min-h-10 w-full">
                    <div className="w-20 flex justify-center shrink-0">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-800 shadow-inner bg-gray-900 flex items-center justify-center">
                            {user?.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt="Foto de perfil"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-white text-base sm:text-lg font-bold">
                                    {initial}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={`ml-2 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "opacity-100 w-32" : "opacity-0 w-0"}`}
                    >
                        <p className="text-white text-sm font-bold whitespace-nowrap truncate">
                            {displayName}
                        </p>
                        <div className="mt-1">
                            <RoleBadge />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        width: isOpen ? "90%" : "70%",
                        height: "1px",
                        borderRadius: "5px",
                        background: "rgba(73, 73, 73, 0.41)",
                        margin: "4px auto",
                    }}
                />
                <nav className="flex flex-col items-center gap-2 w-full sm:px-4">
                    {visibleItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="h-12 flex items-center text-[#6d6d6d] sm:hover:text-white sm:hover:bg-[#1a1a1a] rounded-lg transition-colors duration-200 group"
                        >
                            <div className="w-12 flex justify-center shrink-0">
                                <item.icon className="text-xl transition-transform duration-200 sm:group-hover:scale-110" />
                            </div>

                            <div
                                className={`sm:ml-1 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "opacity-100 w-40" : "opacity-0 w-0"}`}
                            >
                                <span className="text-sm font-medium whitespace-nowrap tracking-wide">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto flex flex-col items-center gap-2 w-full sm:px-4">
                    <button
                        type="button"
                        onClick={logout}
                        className="h-12 flex items-center text-error sm:hover:bg-error/10 rounded-lg transition-colors duration-200 group cursor-pointer"
                    >
                        <div className="w-12 flex justify-center shrink-0">
                            <CiLogout className="text-[27px] transition-transform duration-200 sm:group-hover:scale-110" />
                        </div>

                        <div
                            className={`sm:ml-1 flex justify-start transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "opacity-100 w-40" : "opacity-0 w-0"}`}
                        >
                            <span className="text-sm font-medium whitespace-nowrap tracking-wide">
                                Sair
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
