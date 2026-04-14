"use client";

import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import ClientsMain from "@/components/clients/ClientsMain";

export default function ClientsPage() {
  return (
    <ProtectedRoutes permission="canViewClients">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Clientes</h1>
        <ClientsMain />
      </div>
    </ProtectedRoutes>
  );
}
