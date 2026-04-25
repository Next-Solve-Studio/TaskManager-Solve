import {
    MdCalendarMonth,
    MdChevronLeft,
    MdChevronRight,
    MdToday,
} from "react-icons/md";

export default function WeekNavigation({
    isCurrentWeek,
    weekLabel,
    goToNextWeek,
    goToPreviousWeek,
    goToCurrentWeek,
}) {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={goToPreviousWeek}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 hover:bg-bg-card bg-bg-surface border border-border-main text-text-secondary"
            >
                <MdChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-surface border border-border-main">
                <MdCalendarMonth
                    size={15}
                    style={{
                        color: isCurrentWeek
                            ? "#19CA68"
                            : "var(--color-text-muted)",
                    }}
                />
                <span className="text-sm font-semibold text-text-primary">
                    {weekLabel}
                </span>
                {isCurrentWeek && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-brand-500/15 text-brand-500">
                        Atual
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={goToNextWeek}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 hover:bg-bg-card bg-bg-surface border border-border-main text-text-secondary"
            >
                <MdChevronRight size={20} />
            </button>

            {!isCurrentWeek && (
                <button
                    type="button"
                    onClick={goToCurrentWeek}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 hover:bg-brand-500/20 bg-brand-500/10 border border-brand-500/30 text-brand-500"
                >
                    <MdToday size={14} />
                    Hoje
                </button>
            )}
        </div>
    );
}
