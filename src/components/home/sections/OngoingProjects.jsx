import { MdOutlineTimer } from "react-icons/md";

import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/StatusBadge";
import { toDate } from "@/components/ui/DashboardUtils";
import { differenceInDays } from "date-fns";

export default function OngoingProjects({ongoingProjects, today }) {
    return (
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
                        Projetos em Curso
                    </h2>
                    <p className="text-xs text-font-gray2 mt-0.5">
                        Status e prioridade
                    </p>
                </div>
                <MdOutlineTimer className="text-bg-hover2 text-xl" />
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-72 pr-1 scroll-hidden">
                {ongoingProjects.length === 0 ? (
                    <p className="text-xs text-font-gray2 text-center py-6">
                        Nenhum projeto em andamento
                    </p>
                ) : (
                    ongoingProjects.map((proj) => {
                        const dueDate = toDate(
                            proj.expectedDeliveryDate,
                        );
                        const isSupport = proj.status === "suporte";
                        const daysLeft =
                            !isSupport && dueDate
                                ? differenceInDays(dueDate, today)
                                : null;
                        const isOverdue =
                            daysLeft !== null && daysLeft < 0;
                        const isUrgent =
                            daysLeft !== null &&
                            daysLeft >= 0 &&
                            daysLeft <= 3;
                        const priority = PRIORITY_MAP[proj.priority];
                        const status = STATUS_MAP[proj.status];

                        return (
                            <div
                                key={proj.id}
                                className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-150 hover:bg-white/3"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.04)",
                                }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm text-white font-medium leading-tight truncate">
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
                                                            : "#6b7280",
                                                }}
                                            >
                                                {isOverdue
                                                    ? `${Math.abs(daysLeft)}d atrasado`
                                                    : `${daysLeft}d`}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                            style={{
                                                color: status.color,
                                                background: status.bg,
                                                border: `1px solid ${status.border}`,
                                            }}
                                        >
                                            <status.icon size={11} />
                                            {status.label}
                                        </span>
                                        {priority && (
                                            <span
                                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                                style={{
                                                    color: priority.color,
                                                    background: `${priority.color}15`,
                                                }}
                                            >
                                                {priority.label}
                                            </span>
                                        )}
                                        {proj.client && (
                                            <span className="text-[10px] text-bg-hover2 truncate">
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
    )
}
