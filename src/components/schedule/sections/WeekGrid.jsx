"use client";
import { addDays, format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MdEventBusy, MdFlag, MdPerson, MdVideocam } from "react-icons/md";
import { CATEGORIES, WEEK_DAYS } from "@/context/ScheduleContext";

const HOUR_START = 7;
const HOUR_END = 20;
const ROW_HEIGHT = 48;
const TILE_GAP = 4;

const CAT_ICONS = {
    reuniao: MdVideocam,
    foco: MdFlag,
    pessoal: MdPerson,
    ausencia: MdEventBusy,
};

function toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

export default function WeekGrid({ weekStart, events, onSelectEvent, onCreateAt }) {
    const totalHeight = (HOUR_END - HOUR_START) * ROW_HEIGHT;
    const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4 px-1">
                {Object.entries(CATEGORIES).map(([key, c]) => {
                    const Icon = CAT_ICONS[key];
                    return (
                        <span key={key} className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Icon size={13} style={{ color: c.color }} />
                            {c.label}
                        </span>
                    );
                })}
            </div>

            <div className="bg-bg-card/90 backdrop-blur-xl border border-border-main rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <div className="min-w-[760px]">
                        <div className="grid grid-cols-[64px_repeat(7,1fr)] gap-1.5 px-2 pt-2 border-b border-border-main2 bg-bg-card/80 backdrop-blur-md sticky top-0 z-10">
                            <div />
                            {WEEK_DAYS.map((day, i) => {
                                const date = addDays(weekStart, i);
                                const today = isToday(date);
                                return (
                                    <div key={day.key} className="text-center pb-3">
                                        <p className={`text-[11px] uppercase tracking-wide ${today ? "text-brand-500 font-semibold" : "text-text-muted"}`}>
                                            {format(date, "EEEEEE", { locale: ptBR })}
                                        </p>
                                        <p
                                            className={`text-sm font-semibold mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full ${
                                                today ? "bg-brand-500 text-black shadow-[0_0_0_4px_rgba(25,202,104,0.18)]" : "text-text-primary"
                                            }`}
                                        >
                                            {format(date, "d")}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-[64px_repeat(7,1fr)] gap-1.5 p-2 relative">
                            <div className="relative" style={{ height: totalHeight }}>
                                {hours.map((h) => (
                                    <span
                                        key={h}
                                        className="absolute right-3 text-[10px] font-medium text-text-muted tabular-nums"
                                        style={{ top: (h - HOUR_START) * ROW_HEIGHT + 2 }}
                                    >
                                        {String(h).padStart(2, "0")}:00
                                    </span>
                                ))}
                            </div>

                            {WEEK_DAYS.map((day, dayIndex) => {
                                const date = addDays(weekStart, dayIndex);
                                const today = isToday(date);
                                const weekend = dayIndex >= 5;
                                const dayEvents = events.filter((e) => e.dayKey === day.key);

                                return (
                                    // biome-ignore lint/a11y/noStaticElementInteractions: <>
                                    // biome-ignore lint/a11y/useKeyWithClickEvents: <>
                                    <div
                                        key={day.key}
                                        className="relative cursor-pointer"
                                        style={{ height: totalHeight }}
                                        onClick={(e) => {
                                            if (e.target !== e.currentTarget) return;
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const hour = HOUR_START + Math.floor((e.clientY - rect.top) / ROW_HEIGHT);
                                            onCreateAt?.(day.key, `${String(hour).padStart(2, "0")}:00`);
                                        }}
                                    >
                                        {hours.slice(0, -1).map((h) => (
                                            <div
                                                key={h}
                                                className="absolute left-0.5 right-0.5 rounded-lg pointer-events-none backdrop-blur-sm"
                                                style={{
                                                    top: (h - HOUR_START) * ROW_HEIGHT + TILE_GAP / 2,
                                                    height: ROW_HEIGHT - TILE_GAP,
                                                    background: today
                                                        ? "linear-gradient(135deg, color-mix(in srgb, var(--color-brand-500) 16%, rgba(255,255,255,0.03)), rgba(255,255,255,0.015))"
                                                        : weekend
                                                            ? "rgba(255,255,255,0.035)"
                                                            : "rgba(255,255,255,0.02)",
                                                    border: "1px solid rgba(255,255,255,0.09)",
                                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                                                }}
                                            />
                                        ))}

                                        {dayEvents.map((ev) => {
                                            const top = (toMinutes(ev.start) - HOUR_START * 60) * (ROW_HEIGHT / 60);
                                            const height = Math.max((toMinutes(ev.end) - toMinutes(ev.start)) * (ROW_HEIGHT / 60), 26);
                                            const cat = CATEGORIES[ev.cat] || CATEGORIES.foco;
                                            const Icon = CAT_ICONS[ev.cat] || CAT_ICONS.foco;
                                            const compact = height < 46;
                                            return (
                                                <button
                                                    key={ev.id}
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}
                                                    className="absolute left-1.5 right-1.5 rounded-xl px-2.5 py-2 text-left overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:z-20 transition-all duration-150 backdrop-blur-md"
                                                    style={{
                                                        top,
                                                        height,
                                                        background: `color-mix(in srgb, ${cat.color} 10%, var(--color-bg-card))`,
                                                        border: "1px solid rgba(255,255,255,0.12)",
                                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between gap-1.5">
                                                        <span className="text-[10px] text-text-muted tabular-nums truncate">
                                                            {ev.start}–{ev.end}
                                                        </span>
                                                        <span
                                                            className="flex items-center justify-center w-4 h-4 rounded-full shrink-0"
                                                            style={{ background: `color-mix(in srgb, ${cat.color} 25%, transparent)` }}
                                                        >
                                                            <Icon size={9} style={{ color: cat.color }} />
                                                        </span>
                                                    </div>
                                                    {!compact && (
                                                        <span className="block text-xs font-bold text-text-primary truncate mt-1 leading-tight">
                                                            {ev.title}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}