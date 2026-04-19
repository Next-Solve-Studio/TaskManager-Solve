
import { MdCalendarMonth, MdChevronLeft, MdChevronRight, MdToday } from 'react-icons/md'

export default function WeekNavigation({isCurrentWeek, weekLabel, goToNextWeek, goToPreviousWeek, goToCurrentWeek}) {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={goToPreviousWeek}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 hover:bg-white/10"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#9ca3af",
                }}
            >
                <MdChevronLeft size={20} />
            </button>

            <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <MdCalendarMonth size={15} style={{ color: isCurrentWeek ? "#19CA68" : "#6b7280" }} />
                <span className="text-sm font-semibold text-white">{weekLabel}</span>
                {isCurrentWeek && (
                    <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: "rgba(25,202,104,0.15)", color: "#19CA68" }}
                    >
                        Atual
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={goToNextWeek}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 hover:bg-white/10"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#9ca3af",
                }}
            >
                <MdChevronRight size={20} />
            </button>

            {!isCurrentWeek && (
                <button
                    type="button"
                    onClick={goToCurrentWeek}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 hover:bg-white/10"
                    style={{
                        background: "rgba(25,202,104,0.08)",
                        border: "1px solid rgba(25,202,104,0.25)",
                        color: "#19CA68",
                    }}
                >
                    <MdToday size={14} />
                    Hoje
                </button>
            )}
        </div>
    )
}
