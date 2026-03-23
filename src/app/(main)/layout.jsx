'use client'

import SideMenu from "@/layout/sideMenu/SideMenu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function MainLayout ({ children }) {

    const {currentUser, loading} = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Se não está carregando e não há usuário logado, redireciona para o login
        if (!loading && !currentUser) {
            router.push ('/login')
        }
    }, [currentUser, loading, router])

    if (loading || !currentUser) {
        return null
    }

    return (
        <div className="flex min-h-screen">
            <SideMenu/>
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    )
}