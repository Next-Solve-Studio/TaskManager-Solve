"use client";

import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import SettingsMain from "@/components/settings/SettingsMain";

export default function SettingsPage() {
    return (
        <ProtectedRoutes>
            <div className="py-6">
                <SettingsMain />
            </div>
        </ProtectedRoutes>
    );
}
