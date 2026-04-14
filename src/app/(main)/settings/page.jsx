"use client";

import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import SettingsMain from "@/components/settings/SettingsMain";

export default function SettingsPage() {
  return (
    <ProtectedRoutes>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>
        <SettingsMain />
      </div>
    </ProtectedRoutes>
  );
}
