"use client";

import { CircularProgress } from "@mui/material";
import { useState } from "react";

import { useClients } from "@/context/ClientsContext";

import useIsTablet from "@/hooks/responsive/useIsTablet";
import ClientDeleteModal from "./modals/ClientDeleteModal";
import ClientForm from "./modals/ClientForm";
import ClientCard from "./sections/ClientCard";
import ClientsHeader from "./sections/ClientsHeader";
import ClientsStats from "./sections/ClientsStats";
import ClientsTable from "./sections/ClientsTable";
import SearchInput from "./sections/SearchInput";

export default function ClientsMain() {
    const { clients, loading } = useClients();
    const isTablet = useIsTablet();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingClient, setDeletingClient] = useState(null);

    const filteredClients = clients.filter(
        (client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleOpenModal = (client = null) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleOpenDelete = (client) => {
        setDeletingClient(client);
        setDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <ClientsHeader />

            <ClientsStats handleOpenModal={handleOpenModal} clients={clients} />

            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {loading ? (
                <div className="flex items-center justify-center py-16 gap-3">
                    <CircularProgress
                        size={24}
                        style={{ color: "var(--color-brand-500)" }}
                    />
                    <span className="text-font-gray2 text-sm">
                        Carregando clientes...
                    </span>
                </div>
            ) : isTablet ? (
                <div className="flex flex-col gap-3">
                    {filteredClients.length === 0 ? (
                        <div className="py-20 text-center text-font-gray2 text-sm bg-white/2">
                            {searchTerm
                                ? "Nenhum cliente encontrado para sua busca"
                                : "Nenhum cliente cadastrado ainda"}
                        </div>
                    ) : (
                        filteredClients.map((client) => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                onEdit={handleOpenModal}
                                onDelete={handleOpenDelete}
                            />
                        ))
                    )}
                </div>
            ) : (
                <ClientsTable
                    clients={filteredClients}
                    loading={loading}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDelete}
                />
            )}

            {isModalOpen && (
                <ClientForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    client={selectedClient}
                />
            )}

            <ClientDeleteModal
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeletingClient(null);
                }}
                client={deletingClient}
            />
        </div>
    );
}
