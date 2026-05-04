// componente visual usado para mostrar números resumidos (totais, contagens)
export function StatPill({ icon: Icon, label, value, color, bg, border }) {
    const STATS_CONFIG = [
    {
        label: "Total",
        key: "total",
        color: "#a78bfa",
        bg: "rgba(167,139,250,0.1)",
        border: "rgba(167,139,250,0.2)",
    },
    {
        label: "Em Andamento",
        key: "em_andamento",
        color: "var(--color-cyan-400)",
        bg: "var(--color-surface-cyan-alt)",
        border: "var(--color-surface-cyan-md)",
    },
    {
        label: "Concluídos",
        key: "concluido",
        color: "var(--color-brand-500)",
        bg: "var(--color-surface-green-alt)",
        border: "var(--color-surface-green-md)",
    },
    {
        label: "Pausados",
        key: "pausado",
        color: "var(--color-warning)",
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.25)",
    },
    {
        label: "Suporte",
        key: "suporte",
        color: "#a855f7",
        bg: "rgba(168,85,247,0.12)",
        border: "rgba(168,85,247,0.25)",
    },
];
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 24,
                background: bg,
                border: `1px solid ${border}`,
                fontSize: 13,
                userSelect: "none",
            }}
        >
            {Icon && <Icon style={{ color, fontSize: 15 }} />}
            <span
                style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}
            >
                {value}
            </span>
            <span className="text-text-secondary font-medium">{label}</span>
        </div>
    );
}
