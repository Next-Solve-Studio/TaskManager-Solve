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
        <div
            className="p-5 rounded-2xl"
            style={{
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Header do card */}
            <div className="flex items-center gap-3 mb-4">
                <Avatar name={user.name} uid={user.id} src={user.photo}/>
                <div>
                    <p className="text-white font-semibold text-sm">
                        {user.name}
                    </p>
                    <p className="text-font-gray2 text-xs">
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
                                    color: todayDay ? "#19CA68" : "#4b5563",
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
                                            : "rgba(255,255,255,0.06)"
                                        : "rgba(255,255,255,0.02)",
                                    border: todayDay
                                        ? "1px solid rgba(25,202,104,0.25)"
                                        : hasContent
                                          ? "1px solid rgba(255,255,255,0.08)"
                                          : "1px dashed rgba(255,255,255,0.05)",
                                    minHeight: "60px",
                                }}
                            >
                                <p className="text-[10px] text-font-gray leading-tight line-clamp-3 text-left">
                                    {desc || (
                                        <span className="text-[#374151]">
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
