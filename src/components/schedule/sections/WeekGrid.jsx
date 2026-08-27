"use client";
import { addDays, format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight, MdEventBusy, MdFlag, MdPerson, MdVideocam } from "react-icons/md";
import { CATEGORIES, WEEK_DAYS } from "@/context/ScheduleContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";

const HOUR_START = 6;
const DISPLAY_HOURS = Array.from({ length: 25 }, (_, i) => (HOUR_START + i) % 24);
const TILE_GAP = 4;

const CAT_ICONS = {
    reuniao: MdVideocam,
    foco: MdFlag,
    pessoal: MdPerson,
    ausencia: MdEventBusy,
};

function toDisplayMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    const real = h * 60 + m;
    return (real - HOUR_START * 60 + 24 * 60) % (24 * 60);
}

export default function WeekGrid({ weekStart, events, users, onSelectEvent, onCreateAt }) {
    const isMobile = useIsMobile();
    const ROW_HEIGHT = isMobile ? 68 : 56;
    const totalHeight = 24 * ROW_HEIGHT;

    const [dayWindowStart, setDayWindowStart] = useState(0);

    useEffect(() => {
        const todayIdx = WEEK_DAYS.findIndex((_, i) => isToday(addDays(weekStart, i)));
        setDayWindowStart(todayIdx >= 0 ? Math.min(Math.max(todayIdx - 1, 0), 3) : 0);
    }, [weekStart]);

    const visibleDayIndexes = isMobile
        ? [dayWindowStart, dayWindowStart + 1, dayWindowStart + 2, dayWindowStart + 3]
        : [0, 1, 2, 3, 4, 5, 6];

    const gridColsClass = isMobile ? "grid-cols-[64px_repeat(4,1fr)]" : "grid-cols-[64px_repeat(7,1fr)]";

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
                {isMobile && (
                    <div className="flex items-center justify-between px-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setDayWindowStart((s) => Math.max(s - 1, 0))}
                            disabled={dayWindowStart === 0}
                            className="p-1.5 rounded-lg text-text-muted disabled:opacity-30 hover:bg-bg-surface"
                        >
                            <MdChevronLeft size={18} />
                        </button>
                        <span className="text-[11px] text-text-muted">Deslize os dias</span>
                        <button
                            type="button"
                            onClick={() => setDayWindowStart((s) => Math.min(s + 1, 3))}
                            disabled={dayWindowStart === 3}
                            className="p-1.5 rounded-lg text-text-muted disabled:opacity-30 hover:bg-bg-surface"
                        >
                            <MdChevronRight size={18} />
                        </button>
                    </div>
                )}
                <div className="overflow-x-auto overflow-y-hidden">
                    <div className={isMobile ? "min-w-full" : "min-w-190"}>
                        <div className={`grid ${gridColsClass} gap-1.5 px-2 pt-2 border-b border-border-main2 bg-bg-card/80`}>
                            <div />
                            {visibleDayIndexes.map((i) => {
                                const day = WEEK_DAYS[i];
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

                        <div className="overflow-y-auto overscroll-y-contain" style={{ maxHeight: ROW_HEIGHT * 11 }}>
                            <div className={`grid ${gridColsClass} gap-1.5 p-2 relative`}>
                                <div className="relative" style={{ height: totalHeight }}>
                                    {DISPLAY_HOURS.map((h, i) => (
                                        <span
                                            key={`${h}-${i}`}
                                            className={`absolute right-3 font-medium text-text-muted tabular-nums ${isMobile ? "text-[11px]" : "text-[10px]"}`}
                                            style={{ top: i * ROW_HEIGHT + 2 }}
                                        >
                                            {i === 24 ? `${String((HOUR_START - 1 + 24) % 24).padStart(2, "0")}:59` : `${String(h).padStart(2, "0")}:00`}
                                        </span>
                                    ))}
                                </div>

                                {visibleDayIndexes.map((dayIndex) => {
                                    const day = WEEK_DAYS[dayIndex];
                                    const date = addDays(weekStart, dayIndex);
                                    const today = isToday(date);
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
                                                const displayHour = Math.floor((e.clientY - rect.top) / ROW_HEIGHT);
                                                const realHour = DISPLAY_HOURS[Math.min(displayHour, 23)];
                                                onCreateAt?.(day.key, `${String(realHour).padStart(2, "0")}:00`);
                                            }}
                                        >
                                            {DISPLAY_HOURS.slice(0, -1).map((h, i) => (
                                                <div
                                                    key={`${h}-${i}`}
                                                    className="absolute left-0.5 right-0.5 rounded-lg pointer-events-none backdrop-blur-sm"
                                                    style={{
                                                        top: i * ROW_HEIGHT + TILE_GAP / 2,
                                                        height: ROW_HEIGHT - TILE_GAP,
                                                        background: today
                                                            ? "linear-gradient(135deg, color-mix(in srgb, var(--color-brand-500) 16%, var(--color-bg-card)), color-mix(in srgb, var(--color-text-primary) 3%, var(--color-bg-card)))"
                                                            : "color-mix(in srgb, var(--color-text-primary) 4%, var(--color-bg-card))",
                                                        border: "1px solid color-mix(in srgb, var(--color-text-primary) 14%, transparent)",
                                                        boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-text-primary) 18%, transparent)",
                                                    }}
                                                />
                                            ))}

                                            {dayEvents.map((ev) => {
                                                const startOffset = toDisplayMinutes(ev.start);
                                                const endOffset = toDisplayMinutes(ev.end);
                                                const top = startOffset * (ROW_HEIGHT / 60);
                                                const durationMinutes = ((endOffset - startOffset + 1440) % 1440) || 1440;
                                                const height = Math.max(durationMinutes * (ROW_HEIGHT / 60), ROW_HEIGHT * 0.55);
                                                const cat = CATEGORIES[ev.cat] || CATEGORIES.foco;
                                                const Icon = CAT_ICONS[ev.cat] || CAT_ICONS.foco;
                                                const compact = height < ROW_HEIGHT * 0.85;
                                                const creator = users?.find((u) => u.id === ev.createdBy);
                                                return (
                                                    <button
                                                        key={ev.id}
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}
                                                        className={`absolute w-full rounded-xl text-left overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:z-20 transition-all duration-150 backdrop-blur-md ${
                                                            isMobile ? "px-3 py-2.5" : "px-2.5 py-2"
                                                        }`}
                                                        style={{
                                                            top,
                                                            height,
                                                            background: `color-mix(in srgb, ${cat.color} 14%, var(--color-bg-card))`,
                                                            border: "1px solid color-mix(in srgb, var(--color-text-primary) 16%, transparent)",
                                                            boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-text-primary) 22%, transparent)",
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between gap-1.5">
                                                            <span className={`text-text-muted tabular-nums truncate ${isMobile ? "text-[11px]" : "text-[10px]"}`}>
                                                                {ev.start}–{ev.end}
                                                            </span>
                                                            <span
                                                                className={`flex items-center justify-center rounded-full shrink-0 ${isMobile ? "w-5 h-5" : "w-[18px] h-[18px]"}`}
                                                                style={{ background: `color-mix(in srgb, ${cat.color} 30%, transparent)` }}
                                                            >
                                                                <Icon size={isMobile ? 11 : 10} style={{ color: cat.color }} />
                                                            </span>
                                                        </div>
                                                        {!compact && (
                                                            <span className={`block font-bold text-text-primary truncate mt-1 leading-tight ${isMobile ? "text-sm" : "text-[13px]"}`}>
                                                                {ev.title}
                                                            </span>
                                                        )}
                                                        {!compact && creator && (
                                                            <span
                                                                className={`absolute bottom-1.5 right-2.5 text-text-muted truncate max-w-[55%] ${isMobile ? "text-[11px]" : "text-[10px]"}`}
                                                            >
                                                                {creator.name?.split(" ")[0]}
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
        </div>
    );
}