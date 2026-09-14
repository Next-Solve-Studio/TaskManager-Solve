'use client'
import RoleBadge from "@/components/auth/RoleBadge";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";


export default function UserInfo({effectiveOpen}) {
    const { currentUser } = useAuth();

    const displayName = currentUser?.name || currentUser?.displayName || "";
    const initial = displayName ? displayName.charAt(0).toUpperCase() : "";

    return (
        <div className="mb-6 flex items-center min-h-10 w-full">
            <div className="w-20 flex justify-center shrink-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border-main shadow-inner bg-bg-surface flex items-center justify-center">
                    {currentUser?.photoURL ? (
                        <Image
                            src={currentUser.photoURL}
                            alt="Foto de perfil"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-text-primary text-base sm:text-lg font-bold">
                            {initial}
                        </span>
                    )}
                </div>
            </div>
            <div
                className={`ml-2 transition-all duration-300 ease-in-out overflow-hidden ${effectiveOpen ? "opacity-100 w-32" : "opacity-0 w-0"}`}
            >
                <p className="text-text-primary text-sm font-bold whitespace-nowrap truncate">
                    {displayName || "sem nome"}
                </p>
                <div className="mt-1">
                    <RoleBadge />
                </div>
            </div>
        </div>
    )
}
