import { differenceInDays, format } from "date-fns";
import { MdCalendarToday, MdOutlineFlag, MdOutlineTimer } from "react-icons/md";
import { AVATAR_COLORS } from "@/components/ui/AvatarBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { calcProgress, toDate } from "@/utils/DashboardUtils";

export default function ActiveProjects({ activeProjects, today }) {
    return (
        <div className="p-5 rounded-2xl bg-bg-card border border-border-main">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-text-primary">
                        Projetos Ativos
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                        Início e previsão de entrega
                    </p>
                </div>
                <MdOutlineFlag className="text-text-muted text-xl" />
            </div>

            {activeProjects.length === 0 ? (
                <p className="text-xs text-text-secondary text-center py-6">
                    Nenhum projeto ativo no momento
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {activeProjects.map((proj, i) => {
                        const dueDate = toDate(proj.expectedDeliveryDate);
                        const startDate = toDate(proj.startDate);
                        const isSupport = proj.status === "suporte";
                        const daysLeft =
                            !isSupport && dueDate
                                ? differenceInDays(dueDate, today)
                                : null;
                        const urgent = daysLeft !== null && daysLeft <= 10;
                        const progress = calcProgress(proj);
                        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                        return (
                            <div key={proj.id}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{
                                                background: color,
                                            }}
                                        />
                                        <p className="text-sm font-semibold text-text-primary truncate max-w-40">
                                            {proj.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-xs font-bold"
                                            style={{ color }}
                                        >
                                            {progress}%
                                        </span>
                                        {daysLeft !== null && (
                                            <span
                                                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                                style={{
                                                    color: urgent
                                                        ? "#ef4444"
                                                        : "var(--color-text-secondary)",
                                                    background: urgent
                                                        ? "rgba(239,68,68,0.1)"
                                                        : "var(--color-border-main)",
                                                }}
                                            >
                                                {daysLeft >= 0
                                                    ? `${daysLeft}d restantes`
                                                    : `${Math.abs(daysLeft)}d atrasado`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ProgressBar value={progress} color={color} />
                                <div className="flex items-center justify-between mt-2 text-[11px] text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <MdCalendarToday fontSize={11} />
                                        Início:{" "}
                                        {startDate
                                            ? format(startDate, "dd/MM/yyyy")
                                            : "—"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MdOutlineTimer fontSize={11} />
                                        Entrega:{" "}
                                        {dueDate
                                            ? format(dueDate, "dd/MM/yyyy")
                                            : "—"}
                                    </span>
                                    <span>
                                        {proj.developers?.length ?? 0} devs
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
