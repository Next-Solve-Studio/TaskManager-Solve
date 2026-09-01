"use client";
import { useMemo } from "react";
import { MdFilterList } from "react-icons/md";
import { GLASS_CARD } from "@/styles/StylesCard";

const STAGES = [
    { key: "planejado",    label: "Planejado",    color: "#19CA68" },
    { key: "em_andamento", label: "Em Andamento", color: "#22d3ee" },
    { key: "em_suporte",   label: "Em Suporte",   color: "#a78bfa" },
    { key: "concluido",    label: "Concluído",    color: "#60a5fa" },
];

export default function ProjectPipeline({ filteredProjects }) {
    const data = useMemo(() => {
        const counts = filteredProjects.reduce((acc, p) => {
            const key = (p.status || "").toLowerCase();
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const max = Math.max(...STAGES.map(s => counts[s.key] || 0), 1);
        return STAGES.map(s => ({
            ...s,
            count: counts[s.key] || 0,
            pct: Math.round(((counts[s.key] || 0) / (filteredProjects.length || 1)) * 100),
            barWidth: Math.round(((counts[s.key] || 0) / max) * 100),
        }));
    }, [filteredProjects]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdFilterList className="text-brand-500" /> Pipeline de Projetos
            </h3>
            <div className="flex flex-col gap-5">
                {data.map(stage => (
                    <div key={stage.key}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-text-secondary">{stage.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold" style={{ color: stage.color }}>{stage.count}</span>
                                <span className="text-xs text-text-muted">{stage.pct}%</span>
                            </div>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${stage.barWidth}%`,
                                    background: stage.color,
                                    opacity: 0.82,
                                    minWidth: stage.count > 0 ? "6px" : "0",
                                }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-xs text-text-muted">Total de projetos</span>
                <span className="text-xl font-black text-text-primary">{filteredProjects.length}</span>
            </div>
        </div>
    );
}