// componente visual usado para mostrar números resumidos (totais, contagens)
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
export function StatPill({ type, value, icon: Icon, label, color, bg, border }) {
    
    const config = STATS_CONFIG.find((item) => item.key === type) || {};
    const finalLabel = label ?? config.label ?? '';
    const finalColor = color ?? config.color ?? '#fff';
    const finalBg = bg ?? config.bg ?? 'transparent';
    const finalBorder = border ?? config.border ?? 'transparent';
    const FinalIcon = Icon ?? config.icon;

    return (
        <div className="flex items-center gap-2 py-2 px-3 rounded-3xl text-[13px] select-none overflow-visible"
            style={{

                background: finalBg,
                border: `1px solid ${finalBorder}`,

            }}
        >
            {FinalIcon && <FinalIcon style={{ color: finalColor, fontSize: 15 }} />}
            <span
                style={{ fontSize: 18, fontWeight: 800, color: finalColor, lineHeight: 1 }}
            >
                {value}
            </span>
            <span className="text-text-secondary font-medium wrap-break-word">{finalLabel}</span>
        </div>
    );
}
