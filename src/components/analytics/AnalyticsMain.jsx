"use client";

import { Tab, Tabs } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { MdAttachMoney, MdGroups, MdLayers, MdPeople } from "react-icons/md";
import { LoadingState } from "@/components/ui/LoadingState";
import { useProjects } from "@/context/ProjectsContext";
import { useTasks } from "@/context/TasksContext";
import { useUsers } from "@/context/UsersContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import { GLASS_CARD } from "@/styles/StylesCard";
import FinancialTrend from "./graphics/FinancialTrend";
import MemberCompletion from "./graphics/MemberCompletion";
import ProjectPipeline from "./graphics/ProjectPipeline";
import ProjectStatus from "./graphics/ProjectStatus";
import RevenueByClient from "./graphics/RevenueByClient";
import TaskStatistics from "./graphics/TaskStatistics";
import TeamWorkload from "./graphics/TeamWorkload";
import WeeklyTaskCompletion from "./graphics/WeeklyTaskCompletion";
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

const TABS = [
    { id: "financeiro", label: "Financeiro", icon: MdAttachMoney },
    { id: "projetos", label: "Projetos", icon: MdLayers },
    { id: "clientes", label: "Clientes", icon: MdPeople },
    { id: "equipe", label: "Equipe", icon: MdGroups },
];

export default function AnalyticsMain() {
    const { projects, loadingProjects } = useProjects();
    const { tasks, loadingTasks } = useTasks();
    const { users, loadingUsers } = useUsers();
    const [timeFilter, setTimeFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("financeiro");
    const isMobile = useIsMobile();

    const getDateObject = (dateVal) => {
        if (!dateVal) return null;
        if (typeof dateVal.toDate === "function") return dateVal.toDate();
        if (dateVal instanceof Date) return dateVal;
        const parsed = new Date(dateVal);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const isWithinTimeFilter = useCallback((dateVal) => {
        if (timeFilter === "all" || !dateVal) return true;
        const date = getDateObject(dateVal);
        if (!date) return true;
        const now = new Date();
        if (timeFilter === "week") {
            const first = new Date(now);
            first.setDate(now.getDate() - now.getDay());
            first.setHours(0, 0, 0, 0);
            return date >= first;
        }
        if (timeFilter === "month")
            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        if (timeFilter === "year")
            return date.getFullYear() === now.getFullYear();
        return true;
    });

    const filteredProjects = useMemo(
        () =>
            (projects || []).filter((p) =>
                isWithinTimeFilter(p.startDate || p.createdAt),
            ),
        [projects, isWithinTimeFilter],
    );

    const filteredTasks = useMemo(
        () =>
            (tasks || []).filter((t) =>
                isWithinTimeFilter(t.startDate || t.createdAt),
            ),
        [tasks, isWithinTimeFilter],
    );

    if (loadingProjects || loadingTasks || loadingUsers)
        return <LoadingState />;

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-6 font-sans p-4 sm:p-6">
            <AnalyticsHeader
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
            />

            {/* Barra de abas */}
            <div className="bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-2xl max-w-150">
                <Tabs
                    value={activeTab}
                    onChange={(_, newVal) => setActiveTab(newVal)}
                    textColor="inherit"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        ...GLASS_CARD,
                        "& .MuiTabs-flexContainer": { width: "100%" },
                        "& .MuiTab-root": {
                            color: "var(--color-text-muted)",
                            flex: 1,
                            maxWidth: "none",
                            minHeight: isMobile ? 48 : 56,
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                            fontWeight: 600,
                            textTransform: "none",
                        },
                        "& .Mui-selected": {
                            color: "var(--color-brand-500) !important",
                        },
                        "& .MuiTabs-indicator": {
                            backgroundColor: "var(--color-brand-500)",
                            height: 3,
                            borderRadius: "3px 3px 0 0",
                        },
                        "& .MuiTabScrollButton-root": {
                            color: "var(--color-text-muted)",
                        },
                    }}
                >
                    {TABS.map((tab) => (
                        <Tab
                            key={tab.id}
                            value={tab.id}
                            icon={<tab.icon size={18} />}
                            iconPosition="start"
                            label={isMobile ? undefined : tab.label}
                            disableRipple={false}
                        />
                    ))}
                </Tabs>
            </div>

            {/* ── FINANCEIRO ── */}
            {activeTab === "financeiro" && (
                <div className="space-y-6">
                    <FinancialKPIs
                        filteredProjects={filteredProjects}
                        allProjects={projects}
                    />
                    <FinancialTrend
                        filteredProjects={filteredProjects}
                        getDateObject={getDateObject}
                    />
                    <FinancialDetails filteredProjects={filteredProjects} />
                </div>
            )}

            {/* ── PROJETOS ── */}
            {activeTab === "projetos" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ProjectStatus filteredProjects={filteredProjects} />
                        <ProjectPipeline filteredProjects={filteredProjects} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <TaskStatistics filteredTasks={filteredTasks} />
                        <WeeklyTaskCompletion
                            filteredTasks={filteredTasks}
                            getDateObject={getDateObject}
                        />
                    </div>
                </div>
            )}

            {/* ── CLIENTES ── */}
            {activeTab === "clientes" && (
                <RevenueByClient filteredProjects={filteredProjects} />
            )}

            {/* ── EQUIPE ── */}
            {activeTab === "equipe" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TeamWorkload filteredTasks={filteredTasks} users={users} />
                    <MemberCompletion
                        filteredTasks={filteredTasks}
                        users={users}
                    />
                </div>
            )}
        </div>
    );
}
