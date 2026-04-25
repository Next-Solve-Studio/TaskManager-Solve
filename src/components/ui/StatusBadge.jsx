import {
    MdArchive,
    MdCheckCircle,
    MdOutlineLoop,
    MdOutlineRateReview,
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
    aguardando_teste: {
        label: "Aguardando Teste",
        color: "#818cf8",
        bg: "rgba(129,140,248,0.12)",
        border: "rgba(129,140,248,0.25)",
        icon: MdOutlineRateReview,
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

export function StatusBadge({ status }) {
    const s = STATUS_MAP[status];
    if (!s) return null;
    const Icon = s.icon;
    return (
        <span
            style={{
                color: s.color,
                backgroundColor: s.bg,
                borderColor: s.border,
            }}
            className={`inline-flex items-center gap-1 rounded-[20px] text-[11px] font-semibold whitespace-nowrap border py-0.75 px-2.5`}
        >
            <Icon size={11} />
            {s.label}
        </span>
    );
}

export function PriorityBadge({ priority }) {
    const p = PRIORITY_MAP[priority];
    if (!p) return null;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 8px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                color: p.color,
                background: p.bg,
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
            }}
        >
            {p.label}
        </span>
    );
}
