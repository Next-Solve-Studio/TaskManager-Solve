"use client";
import { useMemo } from "react";
import { MdGroups } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { GLASS_CARD } from "@/styles/StylesCard";

export default function MemberCompletion({ filteredTasks, users }) {
    const memberData = useMemo(() => {
        const map = {};
        filteredTasks.forEach(t => {
            const assignees = Array.isArray(t.assignedTo) && t.assignedTo.length > 0
                ? t.assignedTo : ["unassigned"];
            assignees.forEach(id => {
                const user = users.find(u => u.id === id);
                const name = user
                    ? (user.name || user.displayName || "Usuário").split(" ")[0]
                    : "Sem resp.";
                if (!map[name]) map[name] = { concluidas: 0, pendentes: 0 };
                if (t.status === "concluida" || t.status === "concluido") map[name].concluidas += 1;
                else map[name].pendentes += 1;
            });
        });
        return Object.entries(map)
            .map(([name, v]) => ({
                name,
                ...v,
                taxa: v.concluidas + v.pendentes > 0
                    ? Math.round((v.concluidas / (v.concluidas + v.pendentes)) * 100) : 0,
            }))
            .sort((a, b) => b.taxa - a.taxa);
    }, [filteredTasks, users]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdGroups className="text-brand-500" /> Conclusão por Membro
            </h3>
            {memberData.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-text-muted text-sm">
                    Nenhum dado no período
                </div>
            ) : (
                <>
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={memberData} barGap={2} barSize={14}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false}
                                    tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                                <Bar dataKey="concluidas" name="Concluídas" fill="#19CA68" radius={[4, 4, 0, 0]} opacity={0.85} />
                                <Bar dataKey="pendentes" name="Pendentes" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {memberData.slice(0, 4).map(m => (
                            <div key={m.name} className="flex items-center justify-between px-3 py-2 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                <span className="text-xs text-text-secondary truncate">{m.name}</span>
                                <span className="text-xs font-bold ml-2 shrink-0"
                                    style={{ color: m.taxa >= 50 ? "#19CA68" : "#f59e0b" }}>
                                    {m.taxa}%
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}