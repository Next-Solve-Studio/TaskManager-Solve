"use client";
import { useMemo } from "react";
import { MdLayers } from "react-icons/md";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { COLORS, GLASS_CARD } from "../AnalyticsMain";

export default function ProjectStatus({ filteredProjects }) {
    const { projectStats, total } = useMemo(() => {
        const counts = filteredProjects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});
        const tot = Object.values(counts).reduce((s, v) => s + v, 0);
        const stats = Object.entries(counts).map(([name, value], i) => ({
            name: name.replace(/_/g, ' '),
            value,
            percentage: tot > 0 ? (value / tot) * 100 : 0,
            fill: COLORS[(i + 2) % COLORS.length],
        }));
        return { projectStats: stats, total: tot };
    }, [filteredProjects]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdLayers className="text-purple-400" /> Distribuição de Projetos por Status
            </h3>
            <div className="flex items-center gap-4">
                <div className="relative shrink-0" style={{ width: '52%', height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={projectStats}
                                cx="50%" cy="50%"
                                innerRadius={62} outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-text-primary">{total}</span>
                        <span className="text-xs text-text-muted mt-0.5">Projetos</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    {projectStats.length === 0 && (
                        <p className="text-sm text-text-muted">Nenhum projeto no período.</p>
                    )}
                    {projectStats.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.fill }} />
                            <span className="text-sm text-text-secondary capitalize truncate flex-1">
                                {item.name.toLowerCase()}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-semibold text-text-primary">
                                    {item.percentage.toFixed(0)}%
                                </span>
                                <span className="text-xs text-text-muted w-5 text-right">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}