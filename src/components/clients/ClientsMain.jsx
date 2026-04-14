"use client";

import { Button, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { useClients } from "@/context/ClientsContext";
import { useRole } from "@/hooks/useRole";
import ClientsTable from "./ClientsTable";
import ClientForm from "./modals/ClientForm";

export default function ClientsMain() {
  const { clients, loading } = useClients();
  const { can } = useRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenModal = (client = null) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <TextField
          placeholder="Buscar parceiros ou clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          className="w-full md:max-w-md"
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
              "& fieldset": { borderColor: "rgba(255,255,255,0.05)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.1)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-brand-500)",
              },
            },
          }}
        />

        {can("canManageClients") && (
          <Button
            variant="contained"
            startIcon={<MdAdd />}
            onClick={() => handleOpenModal()}
            className="shadow-lg shadow-brand-500/20"
            sx={{
              backgroundColor: "var(--color-brand-500)",
              "&:hover": { backgroundColor: "var(--color-brand-600)" },
              textTransform: "none",
              color: "black",
              borderRadius: "12px",
              fontWeight: 700,
              px: 3,
              py: 1.2,
            }}
          >
            Novo Cliente
          </Button>
        )}
      </div>

      <div className="mt-4">
        <ClientsTable
          clients={filteredClients}
          loading={loading}
          onEdit={handleOpenModal}
        />
      </div>

      {isModalOpen && (
        <ClientForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          client={selectedClient}
        />
      )}
    </div>
  );
}
