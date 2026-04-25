"use client";

import { MdCheckCircle, MdPeople } from "react-icons/md";
import { StatPill } from "@/components/ui/StatPill";
import { useRole } from "@/hooks/useRole";
import NewClient from "../button/NewClient";

export default function ClientsStats({ clients, handleOpenModal }) {
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
            <NewClient
                onCreate={
                    can("canManageClients") ? () => handleOpenModal() : null
                }
            />
        </section>
    );
}
