"use client";

import { useCallback, useMemo, useState } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { useProjects } from "@/context/ProjectsContext";
import { useTasks } from "@/context/TasksContext";
import { useUsers } from "@/context/UsersContext";
import FinancialTrend from "./graphics/FinancialTrend";
import ProjectStatus from "./graphics/ProjectStatus";
import TaskStatistics from "./graphics/TaskStatistics";
import TeamWorkload from "./graphics/TeamWorkload";
import AnalyticsHeader from "./sections/AnalyticsHeader";
import FinancialDetails from "./sections/FinancialDetails";
import FinancialKPIs from "./sections/FinancialKPIs";

export const COLORS = [
    "#19CA68",
    "#22d3ee",
    "#a78bfa",
    "#60a5fa",
    "#f59e0b",
    "#ef4444",
];

export default function AnalyticsMain() {
    const { projects, loadingProjects } = useProjects();
    const { tasks, loadingTasks } = useTasks();
    const { users, loadingUsers } = useUsers();
    const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'week', 'month', 'year'

    // ── FUNÇÃO AUXILIAR PARA DATAS (LIDA COM FIRESTORE TIMESTAMPS) ──
    const getDateObject = (dateVal) => {
        if (!dateVal) return null;
        // Se for um Timestamp do Firebase, ele tem a função toDate()
        if (typeof dateVal.toDate === "function") {
            return dateVal.toDate();
        }
        // Caso já seja um objeto de Data Javascript
        if (dateVal instanceof Date) {
            return dateVal;
        }
        // Tenta fazer o parse de string ou timestamp numérico
        const parsed = new Date(dateVal);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    // ── FUNÇÃO DE FILTRO TEMPORAL ──
    const isWithinTimeFilter = useCallback((dateVal) => {
        if (timeFilter === "all" || !dateVal) return true;

        const date = getDateObject(dateVal);
        if (!date) return true;

        const now = new Date();

        if (timeFilter === "week") {
            const firstDayOfWeek = new Date(now);
            firstDayOfWeek.setDate(now.getDate() - now.getDay());
            firstDayOfWeek.setHours(0, 0, 0, 0);
            return date >= firstDayOfWeek;
        }
        if (timeFilter === "month") {
            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        }
        if (timeFilter === "year") {
            return date.getFullYear() === now.getFullYear();
        }
        return true;
    });

    // ── DADOS FILTRADOS (Usando startDate com fallback para createdAt) ──
    const filteredProjects = useMemo(() => {
        return projects.filter((p) =>
            isWithinTimeFilter(p.startDate || p.createdAt),
        );
    }, [projects, isWithinTimeFilter]);

    const filteredTasks = useMemo(() => {
        return tasks.filter((t) =>
            isWithinTimeFilter(t.startDate || t.createdAt),
        );
    }, [tasks, isWithinTimeFilter]);

    if (loadingProjects || loadingTasks || loadingUsers)
        return <LoadingState />;

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-6 font-sans p-4 sm:p-6">
            {/* ── CABEÇALHO E FILTROS ── */}
            <AnalyticsHeader
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
            />

            {/* ── KPIs FINANCEIROS ── */}
            <FinancialKPIs filteredProjects={filteredProjects} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        {/* ── GRÁFICO DE TENDÊNCIA FINANCEIRA ── */}
                        <FinancialTrend
                            filteredProjects={filteredProjects}
                            getDateObject={getDateObject}
                        />
                    </div>
                    {/* ── CARGA DE TRABALHO DA EQUIPE ── */}
                    <TeamWorkload filteredTasks={filteredTasks} users={users} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* ── STATUS DE PROJETOS ── */}
                    <ProjectStatus filteredProjects={filteredProjects} />
                    {/* ── ESTATÍSTICAS DE TAREFAS ── */}
                    <TaskStatistics filteredTasks={filteredTasks} />
                </div>

            {/* ── DETALHAMENTO FINANCEIRO POR PROJETO ── */}
            <FinancialDetails filteredProjects={filteredProjects} />
        </div>
    );
}
export const GLASS_CARD = {
    background:
        "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow:
        "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
    backdropFilter: "blur(12px)", // Recomendado para o efeito de vidro funcionar
    WebkitBackdropFilter: "blur(12px)",
};
