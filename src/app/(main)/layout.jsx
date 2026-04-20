//Layout do Grupo de Rotas
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppProviders from "@/context/AppProviders";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import Header from "@/layout/header/Header";
import SideMenu from "@/layout/sideMenu/SideMenu";
import { ROLES } from "@/lib/roles";
import useIsMobile from "@/responsive/useIsMobile";

export default function MainLayout({ children }) {
    const { currentUser, loading: authLoading } = useAuth();
    const { systemSettings, loading: settingsLoading } = useSettings();
    const isMobile = useIsMobile();
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth > 680;
    });
    const router = useRouter();

    const loading = authLoading || settingsLoading;

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    useEffect(() => {
        // Se não está carregando e não há usuário logado, redireciona para o login
        if (!loading && !currentUser) {
            router.push("/login");
        }
    }, [currentUser, loading, router]);

    if (loading || !currentUser) {
        return null;
    }

    // Lógica de Manutenção: Bloqueia tudo se não for Admin
    if (systemSettings?.maintenanceMode && currentUser.role !== ROLES.ADMIN) {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-orange-500/10 border border-orange-500/20 p-8 rounded-[40px] max-w-md space-y-6 shadow-2xl shadow-orange-500/5">
                    <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🚧</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-orange-400 text-xl sm:text-3xl font-black uppercase tracking-tight animate-pulse">
                            Manutenção
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            O sistema está passando por atualizações e está
                            temporariamente indisponível.
                        </p>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-white/30 text-[11px] font-medium uppercase tracking-widest">
                            Tente novamente em breve.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AppProviders>
            <div className="flex flex-col min-h-screen">
                <Header onMenuClick={toggleSidebar} isMobile={isMobile} />
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
