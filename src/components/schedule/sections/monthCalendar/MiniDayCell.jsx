'use client'
import { isSameMonth, isToday } from "date-fns";
import { CAT } from "./MonthCalendar";

export default function MiniDayCell({ date, monthBase, dayEvents, isSelected, onSelect }) {
    const other = !isSameMonth(date, monthBase);
    const today = isToday(date);
    const dots = dayEvents.slice(0, 3);

    const isSelectedCell = () => {
        if (isSelected) {
            return "bg-white/15 text-brand-400";
        } else if (other) {
            return "text-text-muted opacity-30";
        } else {
            return "text-text-primary";
        }
    };

    return (
        <button
            type="button" 
            onClick={() => onSelect(date)}
            className="flex flex-col items-center py-1 rounded-xl w-full transition-colors hover:bg-white/5"
        >
            <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                ${
                    today
                        ? "bg-brand-500 text-black shadow-[0_0_10px_rgba(26,215,111,0.5)]"
                        : isSelectedCell()
                }`}
            >
                {date.getDate()}
            </span>
            <div className="flex gap-0.75 mt-0.5 h-1.5 items-center">
                {dots.map((ev) => {
                    const c = (CAT[ev.cat] ?? CAT.reuniao).color;
                    return (
                        <span
                            key={ev.id}
                            className="w-1 h-1 rounded-full"
                            style={{ background: c }}
                        />
                    );
                })}
            </div>
        </button>
    );
}
