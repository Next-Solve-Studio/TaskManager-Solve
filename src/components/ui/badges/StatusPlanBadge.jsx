
import { MdVerified, MdWarning, MdBlock } from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";

const STATUS_CONFIG = {
    ACTIVE: {
        icon:       MdVerified,
        color:      "text-green-400",
        bg:         "bg-green-500/10",
        border:     "border-green-500/20",
        label:      "Licença Ativa",
        glow:       "shadow-[0_0_24px_rgba(34,197,94,0.15)]",
    },
    GRACE_PERIOD: {
        icon:       MdWarning,
        color:      "text-orange-400",
        bg:         "bg-orange-500/10",
        border:     "border-orange-500/20",
        label:      "Período de Carência",
        glow:       "shadow-[0_0_24px_rgba(249,115,22,0.15)]",
    },
    EXPIRED: {
        icon:       MdBlock,
        color:      "text-red-400",
        bg:         "bg-red-500/10",
        border:     "border-red-500/20",
        label:      "Licença Expirada",
        glow:       "shadow-[0_0_24px_rgba(239,68,68,0.15)]",
    },
    INACTIVE: {
        icon:       MdBlock,
        color:      "text-red-400",
        bg:         "bg-red-500/10",
        border:     "border-red-500/20",
        label:      "Licença Inativa",
        glow:       "shadow-[0_0_24px_rgba(239,68,68,0.15)]",
    },
    NO_KEY: {
        icon:       RiShieldKeyholeLine,
        color:      "text-text-muted",
        bg:         "bg-white/5",
        border:     "border-white/10",
        label:      "Não Configurada",
        glow:       "",
    },
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
        day:   "2-digit",
        month: "long",
        year:  "numeric",
    });
}

export default function StatusPlanBadge({checked, result}) {

    const config = result?.status ? STATUS_CONFIG[result.status] : null;
    const StatusIcon = config?.icon;

    return (
        <>
            {checked && result && config && (
                <div className={`flex flex-col gap-4 p-6 rounded-2xl border ${config.bg} ${config.border} ${config.glow} transition-all duration-300`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg} border ${config.border}`}>
                            <StatusIcon className={`text-xl ${config.color}`} />
                        </div>
                        <div>
                            <p className={`font-bold text-base ${config.color}`}>
                                {config.label}
                            </p>
                            <p className="text-xs text-text-muted">
                                {result.tenant ?? currentUser?.companyId}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                                Plano
                            </span>
                            <span className="text-sm font-bold text-text-primary">
                                {result.plan ?? "—"}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                                Vencimento
                            </span>
                            <span className="text-sm font-bold text-text-primary">
                                {formatDate(result.expiresAt)}
                            </span>
                        </div>
                    </div>

                    {result.warning && (
                        <p className="text-xs text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2">
                            ⚠️ {result.warning}
                        </p>
                    )}
                </div>
            )}
        </>
    )
}
