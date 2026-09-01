"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { MdAssignment, MdKeyboardArrowDown } from "react-icons/md";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { COLORS } from "../AnalyticsMain";
import { GLASS_CARD } from "@/styles/StylesCard";

const PERIOD_OPTIONS = ['Esta semana', 'Este mês', 'Este ano', 'Todos'];

function resolveDate(raw) {
    if (!raw) return null;
    if (typeof raw?.toDate === 'function') return raw.toDate();
    if (raw instanceof Date) return raw;
    const d = new Date(raw); return Number.isNaN(d.getTime()) ? null : d;
}

export default function TaskStatistics({ filteredTasks }) {
    const [period, setPeriod] = useState('Esta semana');
    const [open, setOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const localTasks = useMemo(() => {
        if (period === 'Todos') return filteredTasks;
        const now = new Date();
        return filteredTasks.filter(t => {
            const d = resolveDate(t.startDate || t.createdAt);
            if (!d) return true;
            if (period === 'Esta semana') {
                const start = new Date(now);
                start.setDate(now.getDate() - now.getDay());
                start.setHours(0, 0, 0, 0);
                return d >= start;
            }
            if (period === 'Este mês') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            if (period === 'Este ano') return d.getFullYear() === now.getFullYear();
            return true;
        });
    }, [filteredTasks, period]);

    const taskStats = useMemo(() => {
        const total = localTasks.length;
        const completed = localTasks.filter(t => t.status === "concluida" || t.status === "concluido").length;
        const priorityCounts = localTasks.reduce((acc, t) => {
            acc[t.priority] = (acc[t.priority] || 0) + 1;
            return acc;
        }, {});
        const priorityData = Object.entries(priorityCounts).map(([name, value], i) => ({
            name: name.toUpperCase(),
            value,
            fill: COLORS[i % COLORS.length],
        }));
        return { total, completionRate: total > 0 ? Math.round((completed / total) * 100) : 0, priorityData };
    }, [localTasks]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MdAssignment className="text-amber-400" /> Tarefas por Prioridade
                </h3>
                <div ref={dropRef} className="relative">
                    <button type="button" onClick={() => setOpen(o => !o)}
                        className="flex items-center gap-1 text-sm text-text-secondary bg-bg-surface border border-border-main rounded-lg px-3 py-1.5 hover:border-brand-500 transition-colors">
                        {period} <MdKeyboardArrowDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                        <div className="absolute right-0 top-full mt-1 bg-bg-card border border-border-main rounded-xl shadow-xl z-20 min-w-[130px] overflow-hidden">
                            {PERIOD_OPTIONS.map(p => (
                                <button type="button" key={p} onClick={() => { setPeriod(p); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-surface transition-colors ${p === period ? 'text-brand-500 font-medium' : 'text-text-secondary'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-bg-surface border border-border-main text-center">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-wider mb-1">Taxa de Conclusão</p>
                    <p className="text-2xl font-black text-brand-500">{taskStats.completionRate}%</p>
                </div>
                <div className="p-4 rounded-xl bg-bg-surface border border-border-main text-center">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-wider mb-1">Tarefas Ativas</p>
                    <p className="text-2xl font-black text-cyan-400">{taskStats.total}</p>
                </div>
            </div>
            <div className="h-48 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskStats.priorityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false}
                            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                        <Bar dataKey="value" name="Tarefas" barSize={28} radius={[4, 4, 0, 0]}>
                            {taskStats.priorityData.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}