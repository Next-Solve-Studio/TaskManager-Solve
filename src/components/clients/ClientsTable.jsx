"use client";

import {
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MdDelete,
  MdEdit,
  MdEmail,
  MdFingerprint,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import { useClients } from "@/context/ClientsContext";
import { useRole } from "@/hooks/useRole";

export default function ClientsTable({ clients, loading, onEdit }) {
  const { can } = useRole();
  const { deleteClient } = useClients();

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <CircularProgress sx={{ color: "var(--color-brand-500)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho de Títulos Opcional (seguindo a estética da imagem) */}
      <div className="grid grid-cols-12 px-8 mb-2">
        <div className="col-span-5">
          <Typography className="text-white/30 font-bold uppercase text-[10px] tracking-widest">
            Cliente / Identificação
          </Typography>
        </div>
        <div className="col-span-3 text-center">
          <Typography className="text-white/30 font-bold uppercase text-[10px] tracking-widest">
            Contato
          </Typography>
        </div>
        <div className="col-span-2 text-center">
          <Typography className="text-white/30 font-bold uppercase text-[10px] tracking-widest">
            Status
          </Typography>
        </div>
        <div className="col-span-2 text-right">
          <Typography className="text-white/30 font-bold uppercase text-[10px] tracking-widest">
            Gerenciar
          </Typography>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="bg-[#121212] border border-white/5 rounded-2xl py-20 text-center">
          <MdPerson size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/40 font-medium">
            Nenhum cliente cadastrado.
          </p>
        </div>
      ) : (
        clients.map((client) => (
          <div
            key={client.id}
            className="grid grid-cols-12 items-center bg-[#121212] border border-white/5 p-4 px-6 rounded-2xl transition-all duration-300 hover:border-[#19ca6833] group"
          >
            {/* IDENTIFICAÇÃO */}
            <div className="col-span-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 font-bold text-lg">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <p className="text-white font-bold text-base group-hover:text-brand-500 transition-colors">
                  {client.name}
                </p>
                {client.documento && (
                  <span className="text-white/40 text-[11px] font-medium flex items-center gap-1 uppercase tracking-wider">
                    <MdFingerprint className="text-brand-500/50" />{" "}
                    {client.documento}
                  </span>
                )}
              </div>
            </div>

            {/* CONTATOS */}
            <div className="col-span-3 flex flex-col items-center gap-1.5">
              {client.email && (
                <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
                  <MdEmail className="text-brand-500" /> {client.email}
                </div>
              )}
              {client.contato && (
                <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
                  <MdPhone className="text-cyan-400" /> {client.contato}
                </div>
              )}
            </div>

            {/* STATUS */}
            <div className="col-span-2 flex justify-center">
              <span
                className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  client.status === "active"
                    ? "bg-brand-500/10 text-brand-500 border border-brand-500/30"
                    : "bg-white/5 text-white/30 border border-white/10"
                }`}
              >
                {client.status === "active" ? "Ativo" : "Inativo"}
              </span>
            </div>

            {/* AÇÕES */}
            <div className="col-span-2 flex justify-end gap-3">
              {can("canManageClients") && (
                <>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => onEdit(client)}
                      sx={{
                        color: "var(--color-cyan-400)",
                        backgroundColor: "rgba(34,211,238,0.05)",
                        border: "1px solid rgba(34,211,238,0.1)",
                        borderRadius: "10px",
                        p: 1,
                        "&:hover": {
                          backgroundColor: "rgba(34,211,238,0.15)",
                          borderColor: "var(--color-cyan-400)",
                        },
                      }}
                    >
                      <MdEdit size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      onClick={() => deleteClient(client.id)}
                      sx={{
                        color: "var(--color-error)",
                        backgroundColor: "rgba(239,68,68,0.05)",
                        border: "1px solid rgba(239,68,68,0.1)",
                        borderRadius: "10px",
                        p: 1,
                        "&:hover": {
                          backgroundColor: "rgba(239,68,68,0.15)",
                          borderColor: "var(--color-error)",
                        },
                      }}
                    >
                      <MdDelete size={18} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
