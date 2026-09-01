"use client";
import { useMemo } from "react";
import { MdCheckCircle } from "react-icons/md";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

const GLASS_CARD = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
};

export default function WeeklyTaskCompletion({ filteredTasks, getDateObject }) {
    const { weeklyData, total } = useMemo(() => {
        const resolve = getDateObject || ((d) => {
            if (!d) return null;
            if (typeof d?.toDate === "function") return d.toDate();
            if (d instanceof Date) return d;
            const p = new Date(d); return isNaN(p.getTime()) ? null : p;
        });

        const completed = filteredTasks.filter(t => t.status === "concluida" || t.status === "concluido");
        const map = {}, order = [];

        completed.forEach(t => {
            const d = resolve(t.updatedAt || t.createdAt);
            if (!d) return;
            const start = new Date(d);
            start.setDate(d.getDate() - d.getDay());
            start.setHours(0, 0, 0, 0);
            const k = start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
            if (!map[k]) { map[k] = 0; order.push(k); }
            map[k] += 1;
        });

        const seen = new Set();
        const data = order
            .filter(k => { if (seen.has(k)) return false; seen.add(k); return true; })
            .map(k => ({ semana: k, concluidas: map[k] }));

        return { weeklyData: data, total: completed.length };
    }, [filteredTasks, getDateObject]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MdCheckCircle className="text-brand-500" /> Conclusão Semanal
                </h3>
                <div className="text-right">
                    <p className="text-xs text-text-muted">Total concluídas</p>
                    <p className="text-xl font-black text-brand-500">{total}</p>
                </div>
            </div>
            {weeklyData.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-text-muted text-sm">
                    Nenhuma tarefa concluída no período
                </div>
            ) : (
                <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData} margin={{ left: -20 }}>
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#19CA68" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#19CA68" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="semana" axisLine={false} tickLine={false}
                                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false}
                                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} width={28} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="concluidas" name="Concluídas"
                                stroke="#19CA68" strokeWidth={2} fill="url(#areaGrad)"
                                dot={{ fill: "#19CA68", r: 3, strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}