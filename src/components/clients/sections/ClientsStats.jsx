"use client";

import { MdCheckCircle, MdPeople, MdExtension, MdViewList, MdViewModule } from "react-icons/md";
import { StatPill } from "@/components/ui/StatPill";
import { useRole } from "@/hooks/useRole";
import CanDo from "@/components/auth/CanDo";
import NewClient from "../button/NewClient";

export default function ClientsStats({ clients, handleOpenModal, onOpenCustomFields, viewMode, setViewMode }) {
    const { can } = useRole();

    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.status === "active").length;

    return (
        <section className="flex flex-wrap flex-col sm:flex-row justify-between gap-4">
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
            <div className="flex items-center gap-2">
                <div className="flex bg-bg-surface border border-border-main2 rounded-xl overflow-hidden h-[40px]">
                    <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`px-3 flex items-center justify-center transition-all ${viewMode === "table" ? "bg-bg-card border-r border-border-main2 text-brand-500" : "text-text-muted hover:text-text-primary"}`}
                        title="Visualização em Tabela"
                    >
                        <MdViewList size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`px-3 flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-bg-card border-l border-border-main2 text-brand-500" : "text-text-muted hover:text-text-primary"}`}
                        title="Visualização em Grade"
                    >
                        <MdViewModule size={20} />
                    </button>
                </div>
                <CanDo permission="canManageCustomFields">
                    <button
                        type="button"
                        onClick={onOpenCustomFields}
                        className="h-10 px-3 bg-bg-surface border border-border-main2 rounded-xl text-text-muted hover:text-brand-500 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-center"
                        title="Gerenciar campos personalizados"
                    >
                        <MdExtension size={20} />
                    </button>
                </CanDo>
                <NewClient
                    onCreate={
                        can("canManageClients") ? () => handleOpenModal() : null
                    }
                />
            </div>
        </section>
    );
}
