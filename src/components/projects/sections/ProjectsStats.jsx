// Estatísticas dos projetos
'use client'
import CanDo from "@/components/auth/CanDo";
import { StatPill } from "@/components/ui/StatPill";
import { useMemo } from "react";

const STATS_CONFIG = [
    {
        label: "Total",
        key: "total",
        color: "#a78bfa",
        bg: "rgba(167,139,250,0.1)",
        border: "rgba(167,139,250,0.2)",
    },
    {
        label: "Em Andamento",
        key: "em_andamento",
        color: "var(--color-cyan-400)",
        bg: "var(--color-surface-cyan-alt)",
        border: "var(--color-surface-cyan-md)",
    },
    {
        label: "Concluídos",
        key: "concluido",
        color: "var(--color-brand-500)",
        bg: "var(--color-surface-green-alt)",
        border: "var(--color-surface-green-md)",
    },
    {
        label: "Pausados",
        key: "pausado",
        color: "var(--color-warning)",
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.25)",
    },
    {
        label: "Suporte",
        key: "suporte",
        color: "#a855f7",
        bg: "rgba(168,85,247,0.12)",
        border: "rgba(168,85,247,0.25)",
    },
];

export default function ProjectsStats({ projects, onCreate }) {
    const stats = useMemo(() => {
        // Conta quantos projetos existem em cada status
        const counts = {
            total: projects.length,
            em_andamento: 0,
            concluido: 0,
            pausado: 0,
            suporte: 0,
            arquivado: 0,
        }

        // com for, o array será percorrido apenas uma vez
        for (const project of projects) { // percorre cada elemento do array projects
            const status = project.status
            if (status in counts) {
                // adiciona os status no counts
                counts[status]++;
            }
        }
        return counts
            
        },[projects],);
    return (
        <div className="flex flex-wrap gap-2 select-none">
            {STATS_CONFIG.map((cfg) => (
                <StatPill
                    key={cfg.key}
                    label={cfg.label}
                    value={stats[cfg.key]}
                    color={cfg.color}
                    bg={cfg.bg}
                    border={cfg.border}
                />
            ))}
            
        </div>
    );
}
