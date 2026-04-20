import {
    MdArchive,
    MdCheckCircle,
    MdOutlineLoop,
    MdOutlineSupportAgent,
    MdPauseCircle,
} from "react-icons/md";

export const STATUS_MAP = {
    em_andamento: {
        label: "Em Andamento",
        color: "var(--color-cyan-400)",
        bg: "var(--color-surface-cyan-alt)",
        border: "var(--color-surface-cyan-md)",
        icon: MdOutlineLoop,
    },
    concluido: {
        label: "Concluído",
        color: "var(--color-brand-500)",
        bg: "var(--color-surface-green-alt)",
        border: "var(--color-surface-green-md)",
        icon: MdCheckCircle,
    },
    pausado: {
        label: "Pausado",
        color: "var(--color-warning)",
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.25)",
        icon: MdPauseCircle,
    },
    arquivado: {
        label: "Arquivado",
        color: "var(--color-font-gray2)",
        bg: "rgba(var(--color-font-gray2-rgb), 0.12) ",
        border: "rgba(var(--color-font-gray2-rgb), 0.25)",
        icon: MdArchive,
    },
    suporte: {
        label: "Suporte",
        color: "var(--color-purple-500)",
        bg: "var(--color-surface-purple-alt)",
        border: "var(--color-surface-purple-md)",
        icon: MdOutlineSupportAgent,
    },
};

export const PRIORITY_MAP = {
    baixa: { label: "Baixa", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
    media: {
        label: "Média",
        color: "var(--color-cyan-400)",
        bg: "var(--color-surface-cyan-alt)",
    },
    alta: {
        label: "Alta",
        color: "var(--color-warning)",
        bg: "rgba(245,158,11,0.12)",
    },
    critica: {
        label: "Crítica",
        color: "var(--color-error)",
        bg: "rgba(239,68,68,0.12)",
    },
};