import { useMemo } from "react";
import { StatPill } from "@/components/ui/StatPill";

export default function TasksStats({ tasks }) {
    const STATS_CONFIG = [
        {
            label: "Total",
            key: "total",
            color: "#a78bfa",
            bg: "rgba(167,139,250,0.1)",
            border: "rgba(167,139,250,0.2)",
        },
        {
            label: "Em Desenvolvimento",
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
            label: "Pendente",
            key: "pausado",
            color: "var(--color-warning)",
            bg: "rgba(245,158,11,0.12)",
            border: "rgba(245,158,11,0.25)",
        },

    ];

    // calcula número de tarefas por status com base em todas as tarefas
    const stats = useMemo(
        () => ({
            total: tasks.length,
            concluido: tasks.filter((t) => t.status === "concluido").length,
            em_andamento: tasks.filter((t) => t.status === "em_andamento")
                .length,
            pausado: tasks.filter((t) => t.status === "pausado").length,
        }),
        [tasks],
    );
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(STATS_CONFIG).map(([key, s]) => (
                <StatPill
                    key={key}
                    label={s.label}
                    value={stats[key] || 0}
                    color={s.color}
                    bg={s.bg}
                    border={s.border}
                />
            ))}
        </div>
    );
}
