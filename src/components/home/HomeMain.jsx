"use client";

import { differenceInDays } from "date-fns";
import { useMemo } from "react";
import {
    MdCheckCircle,
    MdOutlineLoop,
    MdOutlineSupportAgent,
    MdTrendingUp,
} from "react-icons/md";
import { LoadingState } from "@/components/ui/LoadingState";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { useRole } from "@/hooks/useRole";
import { buildWeeklyData, toDate } from "../../utils/DashboardUtils";
import ActivityFeed from "./sections/ActivityFeed";
import HomeHeader from "./sections/HomeHeader";
import ActiveProjects from "./sections/projects/ActiveProjects";
import OngoingProjects from "./sections/projects/OngoingProjects";
import ProjectsWeek from "./sections/projects/ProjectsWeek";
import { StatCard } from "./sections/StatCard";
import Team from "./sections/team/Team";
import { TeamRadar } from "./sections/team/TeamRadar";

export default function HomeMain() {
    const { projects, loadingProjects } = useProjects(); // Retorna um objeto com a lista de projetos
    const { users, loadingUsers } = useUsers(); // lista de usuários
    const { can } = useRole();
    const ACTIVE_STATUSES = ["em_andamento", "suporte"]; // Array constante que define quais status de projeto são considerados "ativos"

    // csem dependências, today será criado apenas na primeira renderização, evitando cálculos desnecessários.
    const today = useMemo(() => new Date());

    // Recalcula o objeto counts somente quando projects mudar
    const counts = useMemo(
        // Para cada status, filtra a lista e conta quantos itens atendem à condição
        () => ({
            concluido: projects.filter((p) => p.status === "concluido").length,
            em_andamento: projects.filter((p) => p.status === "em_andamento")
                .length,
            suporte: projects.filter((p) => p.status === "suporte").length,
            total: projects.length,
        }),
        [projects],
    );

    // porcentagem de projetos concluídos em relação ao total, arredondada
    const completionRate =
        counts.total > 0
            ? Math.round((counts.concluido / counts.total) * 100)
            : 0;

    // Lista projetos onde data de entrega está nos próximos 10 dias, ou vence hoje.
    const nearDeadline = useMemo(
        () =>
            projects.filter((p) => {
                const due = toDate(p.expectedDeliveryDate); // converte o campo para um objeto date
                if (!due) return false;
                const diff = differenceInDays(due, today); // retorna a diferença em dias entre a data de entrega e hoje

                return (
                    diff >= 0 &&
                    diff <= 10 &&
                    ACTIVE_STATUSES.includes(p.status)
                );
            }),
        [projects, today],
    );

    // Obter os primeiros 5 projetos com status "em_andamento" ou "suporte"
    const activeProjects = useMemo(
        () =>
            projects
                .filter((p) => ACTIVE_STATUSES.includes(p.status))
                .slice(0, 5),
        [projects],
    );

    // Similar ao anterior, mas filtra todos os projetos não finalizados,  e pega os primeiros 10
    const ongoingProjects = useMemo(
        () =>
            projects
                .filter(
                    (p) => p.status !== "concluido" && p.status !== "arquivado",
                )
                .slice(0, 10),
        [projects],
    );

    // Chama a função utilitária buildWeeklyData passando a lista de projetos
    const weeklyData = useMemo(() => buildWeeklyData(projects), [projects]);

    // Enquanto os dados estiverem sendo carregados, o componente retorna um indicador visual de carregamento
    if (loadingProjects || loadingUsers) return <LoadingState />;

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-6 font-sans">
            {/* ── HEADER ── */}
            <HomeHeader
                counts={counts}
                nearDeadline={nearDeadline}
                completionRate={completionRate}
                today={today}
            />

            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={MdCheckCircle}
                    label="Projetos Concluídos"
                    value={counts.concluido}
                    color="#19CA68"
                    bg="#19CA680F"
                    border="#19CA6826"
                />
                <StatCard
                    icon={MdOutlineLoop}
                    label="Em Andamento"
                    value={counts.em_andamento}
                    color="#22d3ee"
                    bg="#22D3EE0F"
                    border="rgba(34,211,238,0.15)"
                />
                <StatCard
                    icon={MdOutlineSupportAgent}
                    label="Em Suporte"
                    value={counts.suporte}
                    color="#a78bfa"
                    bg="rgba(167,139,250,0.06)"
                    border="rgba(167,139,250,0.15)"
                />
                <StatCard
                    icon={MdTrendingUp}
                    label="Total de Projetos"
                    value={counts.total}
                    color="#60a5fa"
                    bg="rgba(96,165,250,0.06)"
                    border="rgba(96,165,250,0.15)"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* GRÁFICO */}
                <ProjectsWeek weeklyData={weeklyData} today={today} />

                {/* EQUIPE */}
                <Team users={users} projects={projects} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* PROJETOS ATIVOS COM PROGRESSO */}
                <ActiveProjects activeProjects={activeProjects} today={today} />

                {/* LISTA DE PROJETOS EM CURSO */}
                <OngoingProjects
                    ongoingProjects={ongoingProjects}
                    today={today}
                    users={users}
                />
            </div>

            {/* RADAR DE TIME */}
            <TeamRadar users={users} projects={projects} />

            {/* HISTÓRICO DE ATIVIDADES */}
            {can("canViewActivityHistorys") && <ActivityFeed />}
        </div>
    );
}
