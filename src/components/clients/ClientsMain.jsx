"use client";

import { CircularProgress, Menu, MenuItem } from "@mui/material";
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
import { MdDelete, MdEdit } from "react-icons/md";

export default function ClientsMain() {
    const { clients, loading } = useClients();
    const isTablet = useIsTablet();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingClient, setDeletingClient] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)
    const [menuClient, setMenuClient] = useState(null);

    const handleOpenMenu = useCallback((event, client) => {
            setMenuAnchorEl(event.currentTarget)
            setMenuClient(client);
        }, [])

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

    const handleClientList = () => {
        if (loading){
            return (
                <div className="flex items-center justify-center py-16 gap-3">
                    <CircularProgress
                        size={24}
                        style={{ color: "var(--color-brand-500)" }}
                    />
                    <span className="text-font-gray2 text-sm">
                        Carregando clientes...
                    </span>
                </div>
            )
        }
        if (isTablet) {
            if (filteredClients.length === 0){
                return (
                    <div className="flex flex-col gap-3">
                        <div className="py-20 text-center text-font-gray2 text-sm bg-white/2">
                            {searchTerm
                                ? "Nenhum cliente encontrado para sua busca"
                                : "Nenhum cliente cadastrado ainda"}
                        </div>
                    </div>
                    
                )
            } else {
                return (
                    <div className="flex flex-col gap-3">
                        {filteredClients.map((client) => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                onOpenMenu ={handleOpenMenu}
                            />
                        ))}
                    </div>
                )
            }
        }

        return  (
            <ClientsTable
                clients={filteredClients}
                loading={loading}
                onOpenMenu ={handleOpenMenu}
            />
        )
    }

    return (
        <div className="space-y-8">
            <ClientsHeader />

            <ClientsStats handleOpenModal={handleOpenModal} clients={clients} />

            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {handleClientList()}

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

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                slotProps={{
                    paper: {
                        sx: {
                        background: "var(--color-bg-card)",
                        backgroundImage: "none",
                        border: "1px solid var(--color-border-main)",
                        borderRadius: "10px",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                        minWidth: 140,
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        setMenuAnchorEl(null);
                        handleOpenModal(menuClient);

                    }}
                    sx={{
                        color: "var(--color-text-primary)",
                        fontSize: 13,
                        gap: "8px",
                        "&:hover": { backgroundColor: "var(--color-border-subtle)" },
                    }}
                >
                <MdEdit size={15} className="text-cyan-400" /> Editar
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setMenuAnchorEl(null);
                        handleOpenDelete(menuClient);
                    }}
                    sx={{
                        color: "var(--color-error)",
                        fontSize: 13,
                        gap: "8px",
                        "&:hover": { backgroundColor: "var(--color-border-subtle)" },
                    }}
                >
                <MdDelete size={15} /> Excluir
                </MenuItem>
            </Menu>
        </div>
    );
}
