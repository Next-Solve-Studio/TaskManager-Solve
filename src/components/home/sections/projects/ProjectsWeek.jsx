import { format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import { DashboardHeader } from "@/components/ui/DashboardHeader/DashboardHeader";

const LEGEND_ITEMS = [
    ["var(--color-brand-500)", "Concluídos"],
    ["var(--color-cyan-400)", "Em Andamento"],
    ["var(--color-purple-500)", "Em Suporte"],
];
export default function ProjectsWeek({ weeklyData, today }) {
    const isMobile = useIsMobile();
    return (
        <div className="xl:col-span-2 p-5 rounded-2xl bg-bg-card border border-border-main">
            <div className="flex items-center flex-wrap justify-between mb-5">
                <DashboardHeader
                    title="Projetos por Semana"
                    subtitle={format(startOfMonth(today), "MMMM 'de' yyyy", { locale: ptBR })}
                />
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                    {LEGEND_ITEMS.map(([bg, label]) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <span
                                className="w-2.5 h-2.5 rounded-sm inline-block"
                                style={{ background: bg }}
                            />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    data={weeklyData}
                    barGap={4}
                    barCategoryGap="30%"
                    accessibilityLayer={false}
                >
                    <CartesianGrid
                        vertical={false}
                        stroke="var(--color-border-main)"
                    />
                    <XAxis
                        dataKey="semana"
                        tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                        allowDecimals={false}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={
                            isMobile
                                ? false
                                : { fill: "var(--color-border-subtle)" }
                        }
                        trigger={isMobile ? "click" : "hover"}
                    />
                    <Bar
                        dataKey="concluidos"
                        name="Concluídos"
                        fill="var(--color-brand-500)"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="em_andamento"
                        name="Em Andamento"
                        fill="var(--color-cyan-400)"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="suporte"
                        name="Em Suporte"
                        fill="var(--color-purple-500)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
