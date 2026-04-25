import { addDays, isToday } from "date-fns";
import { Avatar } from "@/components/ui/AvatarBadge";
import { WEEK_DAYS } from "@/context/ScheduleContext";

// Card de um usuário no modo "todos"
export default function UserScheduleCard({ scheduleDoc, weekStart, users }) {
    const user = users.find((u) => u.id === scheduleDoc?.userId) || {
        id: scheduleDoc?.userId,
        name: scheduleDoc?.userName || "Usuário",
    };

    return (
        <div className="p-5 rounded-2xl bg-bg-card border border-border-main">
            {/* Header do card */}
            <div className="flex items-center gap-3 mb-4">
                <Avatar name={user.name} uid={user.id} src={user.photo} />
                <div>
                    <p className="text-text-primary font-semibold text-sm">
                        {user.name}
                    </p>
                    <p className="text-text-secondary text-xs">
                        {
                            Object.values(scheduleDoc?.days || {}).filter((d) =>
                                d?.description?.trim(),
                            ).length
                        }{" "}
                        / 7 dias preenchidos
                    </p>
                </div>
            </div>

            {/* Grid de dias compacto */}
            <div className="grid grid-cols-7 gap-1.5">
                {WEEK_DAYS.map(({ key, label }, i) => {
                    const date = addDays(weekStart, i);
                    const desc = scheduleDoc?.days?.[key]?.description || "";
                    const hasContent = !!desc.trim();
                    const todayDay = isToday(date);

                    return (
                        <div
                            key={key}
                            className="flex flex-col gap-1"
                            title={desc || label}
                        >
                            <span
                                className="text-[10px] font-bold uppercase tracking-wide text-center"
                                style={{
                                    color: todayDay
                                        ? "#19CA68"
                                        : "var(--color-text-muted)",
                                }}
                            >
                                {label.slice(0, 3)}
                            </span>
                            <div
                                className="rounded-lg p-2 text-center"
                                style={{
                                    background: hasContent
                                        ? todayDay
                                            ? "rgba(25,202,104,0.12)"
                                            : "var(--color-bg-surface)"
                                        : "var(--color-border-subtle)",
                                    border: todayDay
                                        ? "1px solid rgba(25,202,104,0.25)"
                                        : hasContent
                                          ? "1px solid var(--color-border-main)"
                                          : "1px dashed var(--color-border-main)",
                                    minHeight: "60px",
                                }}
                            >
                                <p className="text-[10px] text-text-secondary leading-tight line-clamp-3 text-left">
                                    {desc || (
                                        <span className="text-text-muted">
                                            —
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
