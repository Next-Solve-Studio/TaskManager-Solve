//Layout do Grupo de Rotas
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppProviders from "@/context/AppProviders";
import { useAuth } from "@/context/AuthContext";
import SideMenu from "@/layout/sideMenu/SideMenu";

export default function MainLayout({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

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
      <div className="flex min-h-screen pr-10">
        <SideMenu />
        <main className="w-full">{children}</main>
      </div>
    </AppProviders>
  );
}
