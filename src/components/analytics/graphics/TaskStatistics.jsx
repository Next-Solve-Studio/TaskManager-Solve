'use client'
import { useMemo } from "react";
import {
    MdAssignment,
} from "react-icons/md";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { COLORS } from "../AnalyticsMain";

export default function TaskStatistics({filteredTasks}) {

    const taskStats = useMemo(() => {
        const total = filteredTasks.length;
        const completed = filteredTasks.filter(t => t.status === "concluida" || t.status === "concluido").length;
        const priorityCounts = filteredTasks.reduce((acc, t) => {
            acc[t.priority] = (acc[t.priority] || 0) + 1;
            return acc;
        }, {});

        const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ 
            name: name.toUpperCase(), 
            value 
        }));

        return {
            total,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            priorityData
        };
    }, [filteredTasks]);
    return (
        <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdAssignment className="text-orange-400" /> Tarefas por Prioridade
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-bg-surface border border-border-main text-center">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-wider mb-1">Taxa de Conclusão</p>
                    <p className="text-2xl font-black text-brand-500">{taskStats.completionRate}%</p>
                </div>
                <div className="p-4 rounded-xl bg-bg-surface border border-border-main text-center">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-wider mb-1">Tarefas Ativas</p>
                    <p className="text-2xl font-black text-blue-400">{taskStats.total}</p>
                </div>
            </div>
            <div className="h-48 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskStats.priorityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {taskStats.priorityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
