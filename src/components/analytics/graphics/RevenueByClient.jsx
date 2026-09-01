"use client";
import { useMemo } from "react";
import { MdPeople } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { COLORS } from "../AnalyticsMain";
import { formatCurrency } from "@/utils/FormatCurrency";
import { GLASS_CARD } from "@/styles/StylesCard";

const CustomBarLabel = ({ x, y, width, height, value }) => (
    <text x={(x || 0) + (width || 0) + 8} y={(y || 0) + (height || 0) / 2}
        fill="var(--color-text-muted)" fontSize={12} dominantBaseline="middle">
        {value >= 1000 ? `R$\u00a0${(value / 1000).toFixed(1)}k` : `R$\u00a0${value}`}
    </text>
);

export default function RevenueByClient({ filteredProjects = [] }) {
    const { clientData, totalRevenue } = useMemo(() => {
        const map = filteredProjects.reduce((acc, p) => {
            const name = p.title || p.name || "Sem título";
            if (!acc[name]) acc[name] = { total: 0, paid: 0 };
            acc[name].total += Number(p.totalValue) || 0;
            acc[name].paid += Number(p.paidValue) || 0;
            return acc;
        }, {});
        const data = Object.entries(map)
            .map(([name, vals], i) => ({ name, ...vals, fill: COLORS[i % COLORS.length] }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
        return { clientData: data, totalRevenue: data.reduce((s, d) => s + d.total, 0) };
    }, [filteredProjects]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MdPeople className="text-cyan-400" /> Receita por Projeto
                </h3>
                <div className="text-right">
                    <p className="text-xs text-text-muted">Total</p>
                    <p className="text-lg font-black text-brand-500">{formatCurrency(totalRevenue)}</p>
                </div>
            </div>
            {clientData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-text-muted text-sm">
                    Nenhum projeto com valor no período
                </div>
            ) : (
                <div style={{ height: Math.max(clientData.length * 54, 200) }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clientData} layout="vertical" margin={{ left: 8, right: 90 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                                tick={{ fill: "var(--color-text-primary)", fontSize: 13, fontWeight: 500 }}
                                width={140} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                            <Bar dataKey="total" name="Faturamento" barSize={22} radius={[0, 4, 4, 0]}
                                label={<CustomBarLabel />}>
                                {clientData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}