"use client";

import { differenceInDays, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import {
    MdAccessTime,
    MdArrowDownward,
    MdArrowUpward,
    MdBugReport,
    MdCalendarToday,
    MdCheckCircle,
    MdFiberManualRecord,
    MdGroup,
    MdOutlineFlag,
    MdOutlineLoop,
    MdOutlineTimer,
    MdTrendingUp,
} from "react-icons/md";
import { RiRocketLine } from "react-icons/ri";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

// ─── MOCK DATA (substitua por queries reais do Firestore) ────────────────────

const MOCK_TASKS = [
    {
        id: "1",
        title: "Setup autenticação Firebase",
        status: "concluida",
        assignee: "Ana Lima",
        project: "Portal Interno",
        startDate: "2025-06-01",
        dueDate: "2025-06-10",
        priority: "alta",
    },
    {
        id: "2",
        title: "Tela de cadastro de usuários",
        status: "concluida",
        assignee: "Bruno Costa",
        project: "Portal Interno",
        startDate: "2025-06-05",
        dueDate: "2025-06-15",
        priority: "media",
    },
    {
        id: "3",
        title: "Dashboard de relatórios",
        status: "em_progresso",
        assignee: "Carla Souza",
        project: "Analytics Hub",
        startDate: "2025-06-10",
        dueDate: "2025-06-28",
        priority: "alta",
    },
    {
        id: "4",
        title: "API de notificações",
        status: "em_progresso",
        assignee: "Diego Farias",
        project: "Portal Interno",
        startDate: "2025-06-12",
        dueDate: "2025-06-30",
        priority: "alta",
    },
    {
        id: "5",
        title: "Migração de banco de dados",
        status: "aguardando_teste",
        assignee: "Ana Lima",
        project: "Analytics Hub",
        startDate: "2025-06-08",
        dueDate: "2025-06-22",
        priority: "critica",
    },
    {
        id: "6",
        title: "Módulo de permissões RBAC",
        status: "aguardando_teste",
        assignee: "Bruno Costa",
        project: "Portal Interno",
        startDate: "2025-06-14",
        dueDate: "2025-06-25",
        priority: "alta",
    },
    {
        id: "7",
        title: "Integração com EmailJS",
        status: "concluida",
        assignee: "Carla Souza",
        project: "CRM Lite",
        startDate: "2025-06-03",
        dueDate: "2025-06-18",
        priority: "media",
    },
    {
        id: "8",
        title: "UI de onboarding",
        status: "em_progresso",
        assignee: "Erick Mendes",
        project: "CRM Lite",
        startDate: "2025-06-15",
        dueDate: "2025-07-05",
        priority: "media",
    },
    {
        id: "9",
        title: "Testes E2E críticos",
        status: "aguardando_teste",
        assignee: "Diego Farias",
        project: "CRM Lite",
        startDate: "2025-06-16",
        dueDate: "2025-06-27",
        priority: "alta",
    },
    {
        id: "10",
        title: "Otimização de queries",
        status: "concluida",
        assignee: "Erick Mendes",
        project: "Analytics Hub",
        startDate: "2025-06-06",
        dueDate: "2025-06-20",
        priority: "media",
    },
];

const MOCK_USERS = [
    {
        id: "u1",
        name: "Ana Lima",
        role: "lider_de_projetos",
        avatar: "AL",
        color: "#22d3ee",
        activeTask: MOCK_TASKS[4],
        status: "online",
    },
    {
        id: "u2",
        name: "Bruno Costa",
        role: "desenvolvedor",
        avatar: "BC",
        color: "#19CA68",
        activeTask: MOCK_TASKS[5],
        status: "online",
    },
    {
        id: "u3",
        name: "Carla Souza",
        role: "desenvolvedor",
        avatar: "CS",
        color: "#f59e0b",
        activeTask: MOCK_TASKS[2],
        status: "ausente",
    },
    {
        id: "u4",
        name: "Diego Farias",
        role: "desenvolvedor",
        avatar: "DF",
        color: "#ef4444",
        activeTask: MOCK_TASKS[3],
        status: "online",
    },
    {
        id: "u5",
        name: "Erick Mendes",
        role: "desenvolvedor",
        avatar: "EM",
        color: "#a78bfa",
        activeTask: MOCK_TASKS[7],
        status: "online",
    },
];

const MOCK_PROJECTS = [
    {
        id: "p1",
        name: "Portal Interno",
        startDate: "2025-06-01",
        dueDate: "2025-07-15",
        progress: 68,
        color: "#19CA68",
        tasks: 4,
    },
    {
        id: "p2",
        name: "Analytics Hub",
        startDate: "2025-06-08",
        dueDate: "2025-07-30",
        progress: 42,
        color: "#22d3ee",
        tasks: 3,
    },
    {
        id: "p3",
        name: "CRM Lite",
        startDate: "2025-06-03",
        dueDate: "2025-08-10",
        progress: 31,
        color: "#f59e0b",
        tasks: 3,
    },
];

// Gera dados de tasks por semana do mês
const MOCK_MONTHLY_DATA = [
    {
        semana: "Sem 1",
        concluidas: 3,
        em_progresso: 2,
        aguardando: 1,
        total: 6,
    },
    {
        semana: "Sem 2",
        concluidas: 2,
        em_progresso: 4,
        aguardando: 2,
        total: 8,
    },
    {
        semana: "Sem 3",
        concluidas: 4,
        em_progresso: 3,
        aguardando: 3,
        total: 10,
    },
    {
        semana: "Sem 4",
        concluidas: 1,
        em_progresso: 5,
        aguardando: 1,
        total: 7,
    },
];

// ─── SUB-COMPONENTES ─────────────────────────────────────────────────────────

const STATUS_MAP = {
    concluida: {
        label: "Concluída",
        color: "#19CA68",
        bg: "rgba(25,202,104,0.1)",
        border: "rgba(25,202,104,0.25)",
        icon: MdCheckCircle,
    },
    em_progresso: {
        label: "Em Progresso",
        color: "#22d3ee",
        bg: "rgba(34,211,238,0.1)",
        border: "rgba(34,211,238,0.25)",
        icon: MdOutlineLoop,
    },
    aguardando_teste: {
        label: "Aguardando Teste",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.1)",
        border: "rgba(245,158,11,0.25)",
        icon: MdBugReport,
    },
    backlog: {
        label: "Backlog",
        color: "#6b7280",
        bg: "rgba(107,114,128,0.1)",
        border: "rgba(107,114,128,0.25)",
        icon: MdAccessTime,
    },
};

const PRIORITY_MAP = {
    critica: { label: "Crítica", color: "#ef4444" },
    alta: { label: "Alta", color: "#f59e0b" },
    media: { label: "Média", color: "#22d3ee" },
    baixa: { label: "Baixa", color: "#6b7280" },
};

// Card de estatística principal
function StatCard({ icon: Icon, label, value, trend, color, bg, border }) {
    const isUp = trend >= 0;
    return (
        <div
            className="relative flex flex-col gap-3 p-5 rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: bg, border: `1px solid ${border}` }}
        >
            {/* glow sutil */}
            <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: color }}
            />
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ background: `${color}20` }}
                >
                    <Icon style={{ color, fontSize: 20 }} />
                </div>
                {trend !== undefined && (
                    <div
                        className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                            color: isUp ? "#19CA68" : "#ef4444",
                            background: isUp
                                ? "rgba(25,202,104,0.1)"
                                : "rgba(239,68,68,0.1)",
                        }}
                    >
                        {isUp ? (
                            <MdArrowUpward fontSize={13} />
                        ) : (
                            <MdArrowDownward fontSize={13} />
                        )}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-3xl font-bold text-white tabular-nums">
                    {value}
                </p>
                <p className="text-sm text-font-gray2 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// Tooltip customizado do gráfico
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className="rounded-xl px-4 py-3 text-sm shadow-2xl"
            style={{
                background: "#171C23",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <p className="text-white font-semibold mb-2">{label}</p>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: entry.color }}
                    />
                    <span className="text-[#9ca3af]">{entry.name}:</span>
                    <span className="text-white font-bold">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

// Badge de status de task
function TaskStatusBadge({ status }) {
    const s = STATUS_MAP[status];
    if (!s) return null;
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
                color: s.color,
                background: s.bg,
                border: `1px solid ${s.border}`,
            }}
        >
            <s.icon size={11} />
            {s.label}
        </span>
    );
}

// Avatar com initial
function Avatar({ name, color, size = "md", status }) {
    const initial = name?.charAt(0)?.toUpperCase() ?? "?";
    const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
    const statusColor = status === "online" ? "#19CA68" : "#6b7280";
    return (
        <div className="relative shrink-0">
            <div
                className={`${sz} rounded-full flex items-center justify-center font-bold text-white`}
                style={{
                    background: `${color}25`,
                    border: `2px solid ${color}60`,
                }}
            >
                {initial}
            </div>
            {status && (
                <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#121212]"
                    style={{ background: statusColor }}
                />
            )}
        </div>
    );
}

// Barra de progresso
function ProgressBar({ value, color }) {
    return (
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${value}%`, background: color }}
            />
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function HomeMain() {
    const { currentUser } = useAuth();
    const today = new Date();

    const firstName = useMemo(() => {
        const name = currentUser?.name || currentUser?.displayName || "Dev";
        return name.split(" ")[0];
    }, [currentUser]);

    const hour = today.getHours();
    const greeting =
        hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    const counts = useMemo(
        () => ({
            concluida: MOCK_TASKS.filter((t) => t.status === "concluida")
                .length,
            em_progresso: MOCK_TASKS.filter((t) => t.status === "em_progresso")
                .length,
            aguardando_teste: MOCK_TASKS.filter(
                (t) => t.status === "aguardando_teste",
            ).length,
            total: MOCK_TASKS.length,
        }),
        [],
    );

    const completionRate = Math.round((counts.concluida / counts.total) * 100);

    const nearDeadline = useMemo(
        () =>
            MOCK_TASKS.filter((t) => {
                const diff = differenceInDays(new Date(t.dueDate), today);
                return diff >= 0 && diff <= 5 && t.status !== "concluida";
            }),
        [today],
    );

    return (
        <div className="min-h-screen bg-background-page text-white  py-6 space-y-6 font-sans">
            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <RiRocketLine className="text-brand-500 text-xl" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#4b4b4b]">
                            Dashboard
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {greeting},{" "}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, #19CA68, #22d3ee)",
                            }}
                        >
                            {firstName}
                        </span>{" "}
                        👋
                    </h1>
                    <p className="text-sm text-[#6b7280] mt-1">
                        {format(today, "EEEE, d 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                        })}
                    </p>
                </div>

                {/* mini info bar */}
                <div
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="text-center">
                        <p className="text-xl font-bold text-brand-500">
                            {completionRate}%
                        </p>
                        <p className="text-[10px] text-[#6b7280] uppercase tracking-wide">
                            Concluído
                        </p>
                    </div>
                    <div className="w-px h-10 bg-white/5" />
                    <div className="text-center">
                        <p className="text-xl font-bold text-cyan-400">
                            {counts.em_progresso}
                        </p>
                        <p className="text-[10px] text-[#6b7280] uppercase tracking-wide">
                            Ativas
                        </p>
                    </div>
                    <div className="w-px h-10 bg-white/5" />
                    <div className="text-center">
                        <p className="text-xl font-bold text-warning">
                            {nearDeadline.length}
                        </p>
                        <p className="text-[10px] text-[#6b7280] uppercase tracking-wide">
                            Prazo Próximo
                        </p>
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={MdCheckCircle}
                    label="Tasks Concluídas"
                    value={counts.concluida}
                    trend={12}
                    color="#19CA68"
                    bg="rgba(25,202,104,0.06)"
                    border="rgba(25,202,104,0.15)"
                />
                <StatCard
                    icon={MdOutlineLoop}
                    label="Em Progresso"
                    value={counts.em_progresso}
                    trend={5}
                    color="#22d3ee"
                    bg="rgba(34,211,238,0.06)"
                    border="rgba(34,211,238,0.15)"
                />
                <StatCard
                    icon={MdBugReport}
                    label="Aguardando Teste"
                    value={counts.aguardando_teste}
                    trend={-8}
                    color="#f59e0b"
                    bg="rgba(245,158,11,0.06)"
                    border="rgba(245,158,11,0.15)"
                />
                <StatCard
                    icon={MdTrendingUp}
                    label="Total no Mês"
                    value={counts.total}
                    color="#a78bfa"
                    bg="rgba(167,139,250,0.06)"
                    border="rgba(167,139,250,0.15)"
                />
            </div>

            {/* ── ROW: Gráfico + Usuários ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* GRÁFICO MENSAL */}
                <div
                    className="xl:col-span-2 p-5 rounded-2xl"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-bold text-white">
                                Tasks do Mês
                            </h2>
                            <p className="text-xs text-[#6b7280] mt-0.5">
                                {format(startOfMonth(today), "MMMM 'de' yyyy", {
                                    locale: ptBR,
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                            <span className="flex items-center gap-1.5">
                                <span
                                    className="w-2.5 h-2.5 rounded-sm inline-block"
                                    style={{ background: "#19CA68" }}
                                />
                                Concluídas
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span
                                    className="w-2.5 h-2.5 rounded-sm inline-block"
                                    style={{ background: "#22d3ee" }}
                                />
                                Em Progresso
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span
                                    className="w-2.5 h-2.5 rounded-sm inline-block"
                                    style={{ background: "#f59e0b" }}
                                />
                                Aguardando
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={MOCK_MONTHLY_DATA}
                            barGap={4}
                            barCategoryGap="30%"
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="rgba(255,255,255,0.04)"
                            />
                            <XAxis
                                dataKey="semana"
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                width={28}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                            />
                            <Bar
                                dataKey="concluidas"
                                name="Concluídas"
                                fill="#19CA68"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="em_progresso"
                                name="Em Progresso"
                                fill="#22d3ee"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="aguardando"
                                name="Aguardando"
                                fill="#f59e0b"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* USUÁRIOS ATIVOS */}
                <div
                    className="p-5 rounded-2xl flex flex-col gap-3"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h2 className="text-base font-bold text-white">
                                Equipe Atual
                            </h2>
                            <p className="text-xs text-[#6b7280] mt-0.5">
                                {
                                    MOCK_USERS.filter(
                                        (u) => u.status === "online",
                                    ).length
                                }{" "}
                                online
                            </p>
                        </div>
                        <MdGroup className="text-[#4b4b4b] text-xl" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {MOCK_USERS.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-start gap-3 p-2.5 rounded-xl transition-colors duration-150 hover:bg-white/[0.03]"
                            >
                                <Avatar
                                    name={u.name}
                                    color={u.color}
                                    status={u.status}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {u.name}
                                        </p>
                                        <MdFiberManualRecord
                                            fontSize={10}
                                            style={{
                                                color:
                                                    u.status === "online"
                                                        ? "#19CA68"
                                                        : "#6b7280",
                                                flexShrink: 0,
                                            }}
                                        />
                                    </div>
                                    {u.activeTask && (
                                        <p className="text-xs text-[#6b7280] truncate mt-0.5">
                                            {u.activeTask.title}
                                        </p>
                                    )}
                                    {u.activeTask && (
                                        <div className="mt-1.5">
                                            <TaskStatusBadge
                                                status={u.activeTask.status}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── ROW: Projetos + Tasks Próximas ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* PROJETOS COM DATAS */}
                <div
                    className="p-5 rounded-2xl"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-bold text-white">
                                Projetos Ativos
                            </h2>
                            <p className="text-xs text-[#6b7280] mt-0.5">
                                Início e previsão de entrega
                            </p>
                        </div>
                        <MdOutlineFlag className="text-[#4b4b4b] text-xl" />
                    </div>

                    <div className="flex flex-col gap-4">
                        {MOCK_PROJECTS.map((proj) => {
                            const daysLeft = differenceInDays(
                                new Date(proj.dueDate),
                                today,
                            );
                            const urgent = daysLeft <= 10;
                            return (
                                <div key={proj.id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                                style={{
                                                    background: proj.color,
                                                }}
                                            />
                                            <p className="text-sm font-semibold text-white">
                                                {proj.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-xs font-bold"
                                                style={{ color: proj.color }}
                                            >
                                                {proj.progress}%
                                            </span>
                                            <span
                                                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                                style={{
                                                    color: urgent
                                                        ? "#ef4444"
                                                        : "#6b7280",
                                                    background: urgent
                                                        ? "rgba(239,68,68,0.1)"
                                                        : "rgba(107,114,128,0.1)",
                                                }}
                                            >
                                                {daysLeft}d restantes
                                            </span>
                                        </div>
                                    </div>
                                    <ProgressBar
                                        value={proj.progress}
                                        color={proj.color}
                                    />
                                    <div className="flex items-center justify-between mt-2 text-[11px] text-[#6b7280]">
                                        <span className="flex items-center gap-1">
                                            <MdCalendarToday fontSize={11} />
                                            Início:{" "}
                                            {format(
                                                new Date(proj.startDate),
                                                "dd/MM/yyyy",
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MdOutlineTimer fontSize={11} />
                                            Entrega:{" "}
                                            {format(
                                                new Date(proj.dueDate),
                                                "dd/MM/yyyy",
                                            )}
                                        </span>
                                        <span>{proj.tasks} tasks</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* TASKS COM PRAZO PRÓXIMO + TODAS AS TASKS EM ANDAMENTO */}
                <div
                    className="p-5 rounded-2xl"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-bold text-white">
                                Tasks em Andamento
                            </h2>
                            <p className="text-xs text-[#6b7280] mt-0.5">
                                Prazos e responsáveis
                            </p>
                        </div>
                        <MdOutlineTimer className="text-[#4b4b4b] text-xl" />
                    </div>

                    <div className="flex flex-col gap-2 overflow-y-auto max-h-72 pr-1 scroll-hidden">
                        {MOCK_TASKS.filter((t) => t.status !== "concluida").map(
                            (task) => {
                                const daysLeft = differenceInDays(
                                    new Date(task.dueDate),
                                    today,
                                );
                                const isOverdue = daysLeft < 0;
                                const isUrgent = daysLeft >= 0 && daysLeft <= 3;
                                const priority = PRIORITY_MAP[task.priority];
                                const user = MOCK_USERS.find(
                                    (u) => u.name === task.assignee,
                                );

                                return (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-150 hover:bg-white/[0.03]"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.04)",
                                        }}
                                    >
                                        <Avatar
                                            name={task.assignee}
                                            color={user?.color || "#6b7280"}
                                            size="sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm text-white font-medium leading-tight truncate">
                                                    {task.title}
                                                </p>
                                                <span
                                                    className="text-[10px] shrink-0 font-semibold"
                                                    style={{
                                                        color: isOverdue
                                                            ? "#ef4444"
                                                            : isUrgent
                                                              ? "#f59e0b"
                                                              : "#6b7280",
                                                    }}
                                                >
                                                    {isOverdue
                                                        ? `${Math.abs(daysLeft)}d atrasado`
                                                        : `${daysLeft}d`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <TaskStatusBadge
                                                    status={task.status}
                                                />
                                                <span
                                                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                                    style={{
                                                        color: priority.color,
                                                        background: `${priority.color}15`,
                                                    }}
                                                >
                                                    {priority.label}
                                                </span>
                                                <span className="text-[10px] text-[#4b4b4b]">
                                                    {task.project}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>
            </div>

            {/* ── LINHA DE TENDÊNCIA ── */}
            <div
                className="p-5 rounded-2xl"
                style={{
                    background: "#121212",
                    border: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-base font-bold text-white">
                            Velocidade do Time
                        </h2>
                        <p className="text-xs text-[#6b7280] mt-0.5">
                            Tasks finalizadas por semana
                        </p>
                    </div>
                    <MdTrendingUp className="text-brand-500 text-xl" />
                </div>
                <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={MOCK_MONTHLY_DATA}>
                        <defs>
                            <linearGradient
                                id="gradGreen"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#19CA68"
                                    stopOpacity={0.25}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#19CA68"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            stroke="rgba(255,255,255,0.04)"
                        />
                        <XAxis
                            dataKey="semana"
                            tick={{ fill: "#6b7280", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#6b7280", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={24}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="concluidas"
                            name="Concluídas"
                            stroke="#19CA68"
                            strokeWidth={2}
                            fill="url(#gradGreen)"
                            dot={{ fill: "#19CA68", r: 4, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
