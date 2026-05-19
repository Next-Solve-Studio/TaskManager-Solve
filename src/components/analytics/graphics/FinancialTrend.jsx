'use client'
import { useMemo } from "react";
import {
    MdAttachMoney,
} from "react-icons/md";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

export default function FinancialTrend({filteredProjects, getDateObject}) {

    // ── TENDÊNCIA DE FATURAMENTO ──
    const revenueTrend = useMemo(() => {
        const monthlyData = filteredProjects.reduce((acc, p) => {
            const dateObj = getDateObject(p.startDate || p.createdAt) || new Date();
            // Ex: "Jan/2024" (ou se quiser apenas o mês, altere para { month: 'short' })
            const monthStr = dateObj.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            
            if (!acc[monthStr]) acc[monthStr] = 0;
            acc[monthStr] += (Number(p.totalValue) || 0);
            return acc;
        }, {});

        // Converte para um array para renderização no gráfico
        return Object.entries(monthlyData).map(([name, value]) => ({ 
            name: name.charAt(0).toUpperCase() + name.slice(1), 
            value 
        }));
    }, [filteredProjects, getDateObject]);

    return (
        <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdAttachMoney className="text-brand-500" /> Evolução de Faturamento
            </h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrend}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#19CA68" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#19CA68" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" stroke="#19CA68" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
