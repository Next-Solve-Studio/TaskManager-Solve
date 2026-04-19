"use client";

import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { MdCheckCircle, MdPeople, MdSearch } from "react-icons/md";
import { useClients } from "@/context/ClientsContext";
import { useRole } from "@/hooks/useRole";
import useIsMobile from "@/responsive/useIsMobile";
import useIsTablet from "@/responsive/useIsTablet";
import { StatPill } from "../ui/StatPill";
import ClientCard from "./ClientCard";
import ClientDeleteModal from "./ClientDeleteModal";
import ClientForm from "./ClientForm";
import ClientsHeader from "./ClientsHeader";
import ClientsTable from "./ClientsTable";

export default function ClientsMain() {
    const { clients, loading } = useClients();
    const { can } = useRole();
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingClient, setDeletingClient] = useState(null);

    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.status === "active").length;

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
            <ClientsHeader
                onCreate={
                    can("canManageClients") ? () => handleOpenModal() : null
                }
            />

            <div className="flex flex-wrap gap-4">
                <StatPill
                    icon={MdPeople}
                    label="Total de clientes"
                    value={totalClients}
                    color="var(--color-cyan-400)"
                    bg="var(--color-surface-cyan-alt)"
                    border="var(--color-surface-cyan-md)"
                />
                <StatPill
                    icon={MdCheckCircle}
                    label={`${activeClients === 1 ? "Cliente ativo" : "Clientes ativos"}`}
                    value={activeClients}
                    color="var(--color-brand-500)"
                    bg="var(--color-surface-green-alt)"
                    border="var(--color-surface-green-md)"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <TextField
                    placeholder="Buscar parceiros ou clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    className={isMobile ? "w-full" : "w-full md:max-w-md"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdSearch className="text-white/20 text-xl" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "white",
                            backgroundColor: "rgba(255,255,255,0.02)",
                            borderRadius: "12px",
                            "& fieldset": {
                                borderColor: "rgba(255,255,255,0.05)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255,255,255,0.1)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "var(--color-brand-500)",
                            },
                        },
                    }}
                />
            </div>

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
