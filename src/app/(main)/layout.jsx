import SideMenu from "@/layout/sideMenu/SideMenu";
import { Toaster } from "sonner"

export default function MainLayout ({ children }) {
    return (
        <div className="flex min-h-screen">
            <SideMenu/>
            <main className="flex-1 p-4">
                {children}
                <Toaster/>
            </main>
        </div>
    )
}