"use client";

import { CircularProgress } from "@mui/material";
import { FiBriefcase } from "react-icons/fi";
import {
    MdEmail,
    MdFingerprint,
    MdMoreVert,
    MdPhone,
} from "react-icons/md";
import CanDo from "@/components/auth/CanDo";

export default function ClientsTable({ clients, loading, onOpenMenu }) {

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <CircularProgress sx={{ color: "var(--color-brand-500)" }} />
            </div>
        );
    }

    const handleClientRow = () => {
        if (clients.length === 0) {
            return (
                <div className="bg-bg-card border border-border-main rounded-2xl py-20 text-center">
                    <FiBriefcase
                        size={48}
                        className="text-text-muted opacity-20 mx-auto mb-3"
                    />
                    <p className="text-text-muted font-medium">
                        Nenhum cliente cadastrado.
                    </p>
                </div>
            )
        } else {
            return (
                clients.map((client) => (
                    <div
                        key={client.id}
                        className="shadow-md grid grid-cols-12 items-center bg-bg-card border border-border-main p-4 px-6 rounded-2xl transition-all duration-300 hover:border-brand-500/30 group"
                    >
                        {/* IDENTIFICAÇÃO */}
                        <div className="col-span-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 font-bold text-lg">
                                {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-text-primary font-bold text-base group-hover:text-brand-500 transition-colors">
                                    {client.name}
                                </p>
                                {client.documento && (
                                    <span className="text-text-muted text-[11px] font-medium flex items-center gap-1 uppercase tracking-wider">
                                        <MdFingerprint className="text-brand-500/50" />{" "}
                                        {client.documento}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CONTATOS */}
                        <div className="col-span-3 flex flex-col items-center gap-1.5">
                            {client.email && (
                                <div className="flex items-center gap-2 text-text-secondary text-xs font-medium">
                                    <MdEmail className="text-brand-500" />{" "}
                                    {client.email}
                                </div>
                            )}
                            {client.contato && (
                                <div className="flex items-center gap-2 text-text-secondary text-xs font-medium">
                                    <MdPhone className="text-cyan-400" />{" "}
                                    {client.contato}
                                </div>
                            )}
                        </div>

                        {/* STATUS */}
                        <div className="col-span-2 flex justify-center">
                            <span
                                className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    client.status === "active"
                                        ? "bg-brand-500/10 text-brand-500 border border-brand-500/30"
                                        : "bg-bg-surface text-text-muted border border-border-main"
                                }`}
                            >
                                {client.status === "active"
                                    ? "Ativo"
                                    : "Inativo"}
                            </span>
                        </div>

                        {/* AÇÕES */}
                        <div className="col-span-2 flex justify-end gap-3">
                            <CanDo permission="canManageClients">
                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={(e) => onOpenMenu(e, client)}
                                        title="Ações"
                                        className="bg-none border-none cursor-pointer p-1 flex rounded-md text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <MdMoreVert size={18} />
                                    </button>
                                </div>
                            </CanDo>
                        </div>
                    </div>
                ))
            )}
        }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-12 px-8 mb-2">
                <div className="col-span-5">
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Cliente / Identificação
                    </p>
                </div>
                <div className="col-span-3 text-center">
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Contato
                    </p>
                </div>
                <div className="col-span-2 text-center">
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Status
                    </p>
                </div>
                <div className="col-span-2 text-right">
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Ações
                    </p>
                </div>
            </div>

            {handleClientRow()}
        </div>
    );
}
