"use client";

import { useCallback, useMemo, useState } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { useProjects } from "@/context/ProjectsContext";
import { useTasks } from "@/context/TasksContext";
import { useUsers } from "@/context/UsersContext";
import AnalyticsHeader from "./sections/AnalyticsHeader";
import FinancialKPIs from "./sections/FinancialKPIs";
import FinancialTrend from "./graphics/FinancialTrend";
import TeamWorkload from "./graphics/TeamWorkload";
import ProjectStatus from "./graphics/ProjectStatus";
import TaskStatistics from "./graphics/TaskStatistics";
import FinancialDetails from "./sections/FinancialDetails";
import ProjectPipeline from "./graphics/ProjectPipeline";
import WeeklyTaskCompletion from "./graphics/WeeklyTaskCompletion";
import RevenueByClient from "./graphics/RevenueByClient";
import MemberCompletion from "./graphics/MemberCompletion";
import { MdAttachMoney, MdLayers, MdPeople, MdGroups } from "react-icons/md";
import { Tab, Tabs } from "@mui/material";
import useIsMobile from "@/hooks/responsive/useIsMobile";

export const COLORS = ["#19CA68", "#22d3ee", "#a78bfa", "#60a5fa", "#f59e0b", "#ef4444"];

export const GLASS_CARD = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
};

const TABS = [
    { id: "financeiro", label: "Financeiro", icon: MdAttachMoney },
    { id: "projetos",   label: "Projetos",   icon: MdLayers },
    { id: "clientes",   label: "Clientes",   icon: MdPeople },
    { id: "equipe",     label: "Equipe",     icon: MdGroups },
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
        if (timeFilter === "month") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        if (timeFilter === "year") return date.getFullYear() === now.getFullYear();
        return true;
    });

    const filteredProjects = useMemo(() =>
        (projects || []).filter(p => isWithinTimeFilter(p.startDate || p.createdAt)),
        [projects, isWithinTimeFilter]);

    const filteredTasks = useMemo(() =>
        (tasks || []).filter(t => isWithinTimeFilter(t.startDate || t.createdAt)),
        [tasks, isWithinTimeFilter]);

    if (loadingProjects || loadingTasks || loadingUsers) return <LoadingState />;

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-6 font-sans p-4 sm:p-6">
            <AnalyticsHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

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
                        borderBottom: "1px solid var(--color-border-main)",
                        background: "var(--bg-surface)",
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
                    {TABS.map(tab => (
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
                    <FinancialKPIs filteredProjects={filteredProjects} allProjects={projects} />
                    <FinancialTrend filteredProjects={filteredProjects} getDateObject={getDateObject} />
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
                        <WeeklyTaskCompletion filteredTasks={filteredTasks} getDateObject={getDateObject} />
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
                    <MemberCompletion filteredTasks={filteredTasks} users={users} />
                </div>
            )}
        </div>
    );
}