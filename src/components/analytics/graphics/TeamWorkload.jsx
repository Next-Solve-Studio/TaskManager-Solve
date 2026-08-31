"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { MdPeople, MdKeyboardArrowDown } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { COLORS } from "../AnalyticsMain";

function getUserById(users, id) { return users.find((u) => u.id === id); }

const GLASS_CARD = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
    border: '1px solid rgba(255,255,255,0.09)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)',
};

const CustomBarLabel = ({ x, y, width, height, value }) => (
    <text x={(x || 0) + (width || 0) + 8} y={(y || 0) + (height || 0) / 2}
        fill="var(--color-text-muted)" fontSize={12} dominantBaseline="middle">
        {value}
    </text>
);

export default function TeamWorkload({ filteredTasks, users }) {
    const [selectedUser, setSelectedUser] = useState('Todos');
    const [open, setOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const userWorkload = useMemo(() => {
        const workload = filteredTasks.reduce((acc, t) => {
            if (t.status !== "concluida" && t.status !== "concluido") {
                const assignees = Array.isArray(t.assignedTo) && t.assignedTo.length > 0
                    ? t.assignedTo : ["unassigned"];
                assignees.forEach((id) => {
                    const user = getUserById(users, id);
                    const name = user
                        ? (user.name || user.displayName || "Usuário").split(" ")[0]
                        : "Sem responsável";
                    acc[name] = (acc[name] || 0) + 1;
                });
            }
            return acc;
        }, {});
        return Object.entries(workload)
            .map(([name, pendingTasks], i) => ({ name, pendingTasks, fill: COLORS[(i + 2) % COLORS.length] }))
            .sort((a, b) => b.pendingTasks - a.pendingTasks);
    }, [filteredTasks, users]);

    const userOptions = useMemo(() => ['Todos', ...userWorkload.map(u => u.name)], [userWorkload]);
    const displayed = useMemo(() =>
        selectedUser === 'Todos' ? userWorkload : userWorkload.filter(u => u.name === selectedUser),
        [userWorkload, selectedUser]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MdPeople className="text-cyan-400" /> Carga de Trabalho (Pendentes)
                </h3>
                <div ref={dropRef} className="relative">
                    <button onClick={() => setOpen(o => !o)}
                        className="flex items-center gap-1 text-sm text-text-secondary bg-bg-surface border border-border-main rounded-lg px-3 py-1.5 hover:border-brand-500 transition-colors">
                        {selectedUser} <MdKeyboardArrowDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                        <div className="absolute right-0 top-full mt-1 bg-bg-card border border-border-main rounded-xl shadow-xl z-20 min-w-[140px] max-h-48 overflow-y-auto overflow-hidden">
                            {userOptions.map(u => (
                                <button key={u} onClick={() => { setSelectedUser(u); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-surface transition-colors ${u === selectedUser ? 'text-brand-500 font-medium' : 'text-text-secondary'}`}>
                                    {u}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayed} layout="vertical" margin={{ left: 8, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                            tick={{ fill: "var(--color-text-primary)", fontSize: 13, fontWeight: 500 }}
                            width={90} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                        <Bar dataKey="pendingTasks" name="Tarefas pendentes"
                            barSize={22} radius={[0, 4, 4, 0]}
                            label={<CustomBarLabel />}>
                            {displayed.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}