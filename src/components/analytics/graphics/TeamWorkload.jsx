'use client'
import { useMemo } from 'react'
import {
    MdPeople,
} from "react-icons/md";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,

} from "recharts";
import { CustomTooltip } from '@/components/ui/CustomTooltip';
import { COLORS } from '../AnalyticsMain';

function getUserById(users, id) {
    return users.find(u => u.id === id);
}

export default function TeamWorkload({filteredTasks, users}) {
    
    // ── CARGA DE TRABALHO DA EQUIPE ──
    const userWorkload = useMemo(() => {
        const workload = filteredTasks.reduce((acc, t) => {
            if (t.status !== "concluida" && t.status !== "concluido") {
                // Em TasksContext, o campo é um array "assignedTo"
                const assignees = Array.isArray(t.assignedTo) && t.assignedTo.length > 0 
                    ? t.assignedTo 
                    : ["unassigned"];
                
                assignees.forEach(assigneeId => {
                    const user = getUserById(users, assigneeId);
                    let userName;
                    
                    if (user) {
                        const fullName = user.name || user.displayName || "Usuário";
                        userName = fullName.split(' ')[0];
                    }
                    
                    acc[userName] = (acc[userName] || 0) + 1;
                });
            }
            return acc;
        }, {});

        return Object.entries(workload)
            .map(([name, pendingTasks], index) => ({ name, pendingTasks, fill: COLORS[(index + 2) % COLORS.length] }))
            .sort((a, b) => b.pendingTasks - a.pendingTasks); // Ordena do mais ocupado para o menos ocupado
            
    }, [filteredTasks, users]);

    return (
        <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdPeople className="text-blue-400" /> Carga de Trabalho (Pendentes)
            </h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userWorkload} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-primary)', fontSize: 13, fontWeight: 500 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Bar dataKey="pendingTasks" name="Tarefas a fazer" radius={[0, 4, 4, 0]} barSize={24}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
