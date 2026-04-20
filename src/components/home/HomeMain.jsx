"use client";

import { differenceInDays } from "date-fns";
import { useMemo } from "react";
import {
    MdCheckCircle,
    MdOutlineLoop,
    MdOutlineSupportAgent,
    MdTrendingUp,
} from "react-icons/md";

import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { StatCard } from "./sections/StatCard";
import { toDate, buildWeeklyData } from "../ui/DashboardUtils";
import { LoadingState } from "./HomeSubComponents";
import HomeHeader from "./sections/HomeHeader";
import Team from "./sections/Team";
import ProjectsWeek from "./sections/ProjectsWeek";
import ActiveProjects from "./sections/ActiveProjects";
import OngoingProjects from "./sections/OngoingProjects";

export default function HomeMain() {
    
    const { projects, loadingProjects } = useProjects();
    const { users, loadingUsers } = useUsers();

    const today = new Date();


    

    const counts = useMemo(
        () => ({
            concluido: projects.filter((p) => p.status === "concluido").length,
            em_andamento: projects.filter((p) => p.status === "em_andamento")
                .length,
            suporte: projects.filter((p) => p.status === "suporte").length,
            total: projects.length,
        }),
        [projects],
    );

    const completionRate =
        counts.total > 0
            ? Math.round((counts.concluido / counts.total) * 100)
            : 0;

    const nearDeadline = useMemo(
        () =>
            projects.filter((p) => {
                const due = toDate(p.expectedDeliveryDate);
                if (!due) return false;
                const diff = differenceInDays(due, today);
                return (
                    diff >= 0 &&
                    diff <= 10 &&
                    p.status !== "concluido" &&
                    p.status !== "arquivado"
                );
            }),
        [projects, today],
    );

    const activeProjects = useMemo(
        () =>
            projects
                .filter(
                    (p) =>
                        p.status === "em_andamento" || p.status === "suporte",
                )
                .slice(0, 5),
        [projects],
    );

    const ongoingProjects = useMemo(
        () =>
            projects
                .filter(
                    (p) => p.status !== "concluido" && p.status !== "arquivado",
                )
                .slice(0, 10),
        [projects],
    );

    const weeklyData = useMemo(() => buildWeeklyData(projects), [projects]);

    if (loadingProjects || loadingUsers) return <LoadingState />;

    return (
        <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">
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
                    bg="rgba(25,202,104,0.06)"
                    border="rgba(25,202,104,0.15)"
                />
                <StatCard
                    icon={MdOutlineLoop}
                    label="Em Andamento"
                    value={counts.em_andamento}
                    color="#22d3ee"
                    bg="rgba(34, 211, 238, 0.06)"
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
                <ProjectsWeek weeklyData={weeklyData} today={today}/>

                {/* EQUIPE */}
                <Team users={users} projects={projects}/>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* PROJETOS ATIVOS COM PROGRESSO */}
                <ActiveProjects activeProjects={activeProjects} today={today}/>

                {/* LISTA DE PROJETOS EM CURSO */}
                <OngoingProjects ongoingProjects={ongoingProjects} today={today} users={users}/>
            </div>

            
        </div>
    );
}
