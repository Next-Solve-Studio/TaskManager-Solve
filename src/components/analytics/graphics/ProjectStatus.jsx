
import { useMemo } from "react";
import {
    MdLayers,
} from "react-icons/md";
import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { COLORS } from "../AnalyticsMain";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

export default function ProjectStatus({filteredProjects}) {

    // ── PROCESSAMENTO DE PROJETOS E TAREFAS ──
    const projectStats = useMemo(() => {
        const statusCounts = filteredProjects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(statusCounts).map(([name, value]) => ({ 
            name: name.replace("_", " ").toUpperCase(), 
            value 
        }));
    }, [filteredProjects]);

    return (
        <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdLayers className="text-purple-400" /> Distribuição de Projetos por Status
            </h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={projectStats} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {projectStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
