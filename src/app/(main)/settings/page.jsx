"use client";

import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import SettingsMain from "@/components/settings/SettingsMain";

export default function SettingsPage() {
    return (
        <ProtectedRoutes>
            <div className="p-6">
                <SettingsMain />
            </div>
        </ProtectedRoutes>
    );
}
