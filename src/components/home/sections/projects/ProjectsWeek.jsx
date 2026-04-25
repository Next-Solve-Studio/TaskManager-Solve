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

const LEGEND_ITEMS = [
    ["#19CA68", "Concluídos"],
    ["#22d3ee", "Em Andamento"],
    ["#f59e0b", "Em Suporte"],
];
export default function ProjectsWeek({ weeklyData, today }) {
    const isMobile = useIsMobile();
    return (
        <div className="xl:col-span-2 p-5 rounded-2xl bg-bg-card border border-border-main">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-text-primary">
                        Projetos por Semana
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                        {format(startOfMonth(today), "MMMM 'de' yyyy", {
                            locale: ptBR,
                        })}
                    </p>
                </div>
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
                        fill="#19CA68"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="em_andamento"
                        name="Em Andamento"
                        fill="#22d3ee"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="suporte"
                        name="Em Suporte"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
