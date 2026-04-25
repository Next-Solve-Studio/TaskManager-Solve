import { differenceInDays } from "date-fns";
import { MdOutlineTimer } from "react-icons/md";
import { PriorityBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { toDate } from "@/utils/DashboardUtils";

export default function OngoingProjects({ ongoingProjects, today }) {
    return (
        <div className="p-5 rounded-2xl bg-bg-card border border-border-main">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-text-primary">
                        Projetos em Curso
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                        Status e prioridade
                    </p>
                </div>
                <MdOutlineTimer className="text-text-muted text-xl" />
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-72 pr-1 scroll-hidden">
                {ongoingProjects.length === 0 ? (
                    <p className="text-xs text-text-secondary text-center py-6">
                        Nenhum projeto em andamento
                    </p>
                ) : (
                    ongoingProjects.map((proj) => {
                        const dueDate = toDate(proj.expectedDeliveryDate);
                        const isSupport = proj.status === "suporte";
                        const daysLeft =
                            !isSupport && dueDate
                                ? differenceInDays(dueDate, today)
                                : null;
                        const isOverdue = daysLeft !== null && daysLeft < 0;
                        const isUrgent =
                            daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

                        return (
                            <div
                                key={proj.id}
                                className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-150 hover:bg-bg-surface border border-border-subtle"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm text-text-primary font-medium leading-tight truncate">
                                            {proj.title}
                                        </p>
                                        {daysLeft !== null && (
                                            <span
                                                className="text-[10px] shrink-0 font-semibold"
                                                style={{
                                                    color: isOverdue
                                                        ? "#ef4444"
                                                        : isUrgent
                                                          ? "#f59e0b"
                                                          : "var(--color-text-secondary)",
                                                }}
                                            >
                                                {isOverdue
                                                    ? `${Math.abs(daysLeft)}d atrasado`
                                                    : `${daysLeft}d`}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <StatusBadge status={proj.status} />
                                        {proj.priority && (
                                            <PriorityBadge
                                                priority={proj.priority}
                                            />
                                        )}
                                        {proj.client && (
                                            <span className="text-[10px] text-text-muted truncate">
                                                {proj.client}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
