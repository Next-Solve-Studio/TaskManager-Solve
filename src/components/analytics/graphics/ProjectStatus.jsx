import { useMemo } from "react";
import { MdLayers } from "react-icons/md";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import useIsTablet from "@/hooks/responsive/useIsTablet";
import { COLORS } from "../AnalyticsMain";

export default function ProjectStatus({ filteredProjects }) {
    const IsTablet = useIsTablet();

    const projectStats = useMemo(() => {
        // 1. Conta os status
        const statusCounts = filteredProjects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});

        // 2. Calcula o total de projetos para podermos achar a %
        const total = Object.values(statusCounts).reduce(
            (sum, val) => sum + val,
            0,
        );

        // 3. Retorna o array incluindo a porcentagem calculada
        return Object.entries(statusCounts).map(([name, value]) => ({
            name: name.replace("_", " ").toUpperCase(),
            value,
            // 1. Mudamos o nome aqui para 'percentage' para evitar o conflito
            percentage: total > 0 ? (value / total) * 100 : 0,
        }));
    }, [filteredProjects]);

    // Função que formata o texto da legenda
    const renderLegendText = (value, entry) => {
        const { payload } = entry; // payload contém as informações do item (name, value, percent)
        return `${value}: ${payload.value} (${payload.percentage.toFixed(0)}%)`;
    };

    return (
        <div className="bg-bg-card border border-border-main rounded-2xl p-3 sm:p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MdLayers className="text-purple-400" /> Distribuição de
                Projetos por Status
            </h3>
            <div className={`w-full ${IsTablet ? "h-96" : "h-80"}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={projectStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            // A label do Recharts usa (percent * 100) por padrão,
                            // mas como já multiplicamos por 100 no useMemo, fica só 'percent'
                            label={
                                IsTablet
                                    ? false
                                    : ({ name, percent }) =>
                                          `${name} ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {projectStats.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[(index + 2) % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip content={<CustomTooltip />} />

                        {IsTablet && (
                            <Legend
                                verticalAlign="bottom"
                                wrapperStyle={{ paddingTop: "20px" }}
                                formatter={renderLegendText} // Chama a nossa função para customizar o texto
                            />
                        )}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
