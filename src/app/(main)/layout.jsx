//Layout do Grupo de Rotas
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppProviders from "@/context/AppProviders";
import { useAuth } from "@/context/AuthContext";
import SideMenu from "@/layout/sideMenu/SideMenu";
import Header from "@/layout/header/Header";
import useIsMobile from "@/responsive/useIsMobile";

export default function MainLayout({ children }) {
    const { currentUser, loading } = useAuth();
    const isMobile = useIsMobile();
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth > 680;
    });
    const router = useRouter();

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    useEffect(() => {
        // Se não está carregando e não há usuário logado, redireciona para o login
        if (!loading && !currentUser) {
            router.push("/login");
        }
    }, [currentUser, loading, router]);

    if (loading || !currentUser) {
        return null;
    }

    return (
        <AppProviders>
            <div className="flex flex-col min-h-screen">
                <Header onMenuClick={toggleSidebar} isMobile={isMobile}/>
                <div className="flex">
                    <SideMenu 
                        isOpen={isSidebarOpen} 
                        onToggle={toggleSidebar} 
                        isMobile={isMobile} 
                    />
                    <main className="w-full px-10">{children}</main>
                </div>
            </div>
        </AppProviders>
    );
}
