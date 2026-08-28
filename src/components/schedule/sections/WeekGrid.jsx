"use client";
import { addDays, format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
    MdChevronLeft,
    MdChevronRight,
    MdEventBusy,
    MdFlag,
    MdPerson,
    MdVideocam,
} from "react-icons/md";
import { Avatar } from "@/components/ui/AvatarBadge";
import { CATEGORIES, WEEK_DAYS } from "@/context/ScheduleContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";

const HOUR_START = 6;
const DISPLAY_HOURS = Array.from({ length: 25 }, (_, i) => ({
    hour: (HOUR_START + i) % 24,
    index: i,
    id: `hour-slot-${i}`,
}));
const TILE_GAP = 5;

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

export default function WeekGrid({
    weekStart,
    events,
    users,
    onSelectEvent,
    onCreateAt,
}) {
    const isMobile = useIsMobile();
    const ROW_HEIGHT = isMobile ? 68 : 75;
    const totalHeight = 24 * ROW_HEIGHT;

    const [dayWindowStart, setDayWindowStart] = useState(0);

    useEffect(() => {
        const todayIdx = WEEK_DAYS.findIndex((_, i) =>
            isToday(addDays(weekStart, i)),
        );
        setDayWindowStart(
            todayIdx >= 0 ? Math.min(Math.max(todayIdx - 1, 0), 4) : 0,
        );
    }, [weekStart]);

    const visibleDayIndexes = isMobile
        ? [dayWindowStart, dayWindowStart + 1, dayWindowStart + 2]
        : [0, 1, 2, 3, 4, 5, 6];

    const gridColsClass = isMobile
        ? "grid-cols-[64px_repeat(3,1fr)]"
        : "grid-cols-[64px_repeat(7,1fr)]";

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4 px-1">
                {Object.entries(CATEGORIES).map(([key, c]) => {
                    const Icon = CAT_ICONS[key];
                    return (
                        <span
                            key={key}
                            className="flex items-center gap-1.5 text-xs text-text-muted"
                        >
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
                            onClick={() =>
                                setDayWindowStart((s) => Math.max(s - 1, 0))
                            }
                            disabled={dayWindowStart === 0}
                            className="p-1.5 rounded-lg text-text-muted disabled:opacity-30 hover:bg-bg-surface"
                        >
                            <MdChevronLeft size={18} />
                        </button>
                        <span className="text-[11px] text-text-muted">
                            Deslize os dias
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setDayWindowStart((s) => Math.min(s + 1, 4))
                            }
                            disabled={dayWindowStart === 4}
                            className="p-1.5 rounded-lg text-text-muted disabled:opacity-30 hover:bg-bg-surface"
                        >
                            <MdChevronRight size={18} />
                        </button>
                    </div>
                )}
                <div className="overflow-x-auto overflow-y-hidden">
                    <div className={isMobile ? "min-w-full" : "min-w-190"}>
                        <div
                            className={`grid ${gridColsClass} gap-1.5 px-2 pt-2 border-b border-border-main2 bg-bg-card/80`}
                        >
                            <div />
                            {visibleDayIndexes.map((i) => {
                                const day = WEEK_DAYS[i];
                                const date = addDays(weekStart, i);
                                const today = isToday(date);
                                return (
                                    <div
                                        key={day.key}
                                        className="text-center pb-3"
                                    >
                                        <p
                                            className={`text-[11px] uppercase tracking-wide ${today ? "text-brand-500 font-semibold" : "text-text-muted"}`}
                                        >
                                            {format(date, "EEEEEE", {
                                                locale: ptBR,
                                            })}
                                        </p>
                                        <p
                                            className={`text-sm font-semibold mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full ${
                                                today
                                                    ? "bg-brand-500 text-black shadow-[0_0_0_4px_rgba(25,202,104,0.18)]"
                                                    : "text-text-primary"
                                            }`}
                                        >
                                            {format(date, "d")}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            className="overflow-y-auto overscroll-y-contain"
                            style={{ maxHeight: ROW_HEIGHT * 11 }}
                        >
                            <div
                                className={`grid ${gridColsClass} gap-1.5 p-2 relative`}
                            >
                                <div
                                    className="relative"
                                    style={{ height: totalHeight }}
                                >
                                    {DISPLAY_HOURS.map((slot) => (
                                        <span
                                            key={slot.id}
                                            className={`absolute right-3 font-medium text-text-muted tabular-nums ${isMobile ? "text-[11px]" : "text-[10px]"}`}
                                            style={{
                                                top:
                                                    slot.index * ROW_HEIGHT + 2,
                                            }}
                                        >
                                            {slot.index === 24
                                                ? `${String((HOUR_START - 1 + 24) % 24).padStart(2, "0")}:59`
                                                : `${String(slot.hour).padStart(2, "0")}:00`}
                                        </span>
                                    ))}
                                </div>

                                {visibleDayIndexes.map((dayIndex) => {
                                    const day = WEEK_DAYS[dayIndex];
                                    const date = addDays(weekStart, dayIndex);
                                    const today = isToday(date);
                                    const dayEvents = events.filter(
                                        (e) => e.dayKey === day.key,
                                    );

                                    return (
                                        <div
                                            key={day.key}
                                            className="relative"
                                            style={{ height: totalHeight }}
                                        >
                                            {/* Área clicável para criar evento — fica abaixo de tudo */}
                                            <button
                                                type="button"
                                                aria-label={`Criar evento em ${day.key}`}
                                                className="absolute inset-0 w-full cursor-pointer bg-transparent border-0 p-0"
                                                style={{ zIndex: 0 }}
                                                onClick={(e) => {
                                                    const rect =
                                                        e.currentTarget.getBoundingClientRect();
                                                    const displayHour =
                                                        Math.floor(
                                                            (e.clientY -
                                                                rect.top) /
                                                                ROW_HEIGHT,
                                                        );
                                                    const realHour =
                                                        DISPLAY_HOURS[
                                                            Math.min(
                                                                displayHour,
                                                                23,
                                                            )
                                                        ].hour;
                                                    onCreateAt?.(
                                                        day.key,
                                                        `${String(realHour).padStart(2, "0")}:00`,
                                                    );
                                                }}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        onCreateAt?.(
                                                            day.key,
                                                            "09:00",
                                                        );
                                                    }
                                                }}
                                            />

                                            {/* Tiles de fundo — pointer-events none */}
                                            {DISPLAY_HOURS.slice(0, -1).map(
                                                (slot) => (
                                                    <div
                                                        key={`bg-${slot.id}`}
                                                        className="absolute left-0.5 right-0.5 rounded-lg pointer-events-none backdrop-blur-sm overflow-hidden"
                                                        style={{
                                                            top:
                                                                slot.index *
                                                                    ROW_HEIGHT +
                                                                TILE_GAP / 2,
                                                            height:
                                                                ROW_HEIGHT -
                                                                TILE_GAP,
                                                            zIndex: 1,
                                                            background: today
                                                                ? "linear-gradient(135deg, color-mix(in srgb, var(--color-brand-500) 16%, var(--color-bg-card)), color-mix(in srgb, var(--color-text-primary) 3%, var(--color-bg-card)))"
                                                                : "color-mix(in srgb, var(--color-text-primary) 4%, var(--color-bg-card))",
                                                            border: "1px solid color-mix(in srgb, var(--color-text-primary) 14%, transparent)",
                                                            boxShadow:
                                                                "inset 0 1px 0 color-mix(in srgb, var(--color-text-primary) 18%, transparent)",
                                                        }}
                                                    />
                                                ),
                                            )}

                                            {/* Eventos — ficam acima do botão de criação */}
                                            {dayEvents.map((ev) => {
                                                const startOffset =
                                                    toDisplayMinutes(ev.start);
                                                const endOffset =
                                                    toDisplayMinutes(ev.end);
                                                const top =
                                                    startOffset *
                                                    (ROW_HEIGHT / 60);
                                                const durationMinutes =
                                                    (endOffset -
                                                        startOffset +
                                                        1440) %
                                                        1440 || 1440;
                                                const height = Math.max(
                                                    durationMinutes *
                                                        (ROW_HEIGHT / 60),
                                                    ROW_HEIGHT * 0.55,
                                                );
                                                const cat =
                                                    CATEGORIES[ev.cat] ||
                                                    CATEGORIES.foco;
                                                const Icon =
                                                    CAT_ICONS[ev.cat] ||
                                                    CAT_ICONS.foco;
                                                const compact =
                                                    height < ROW_HEIGHT * 0.85;
                                                const creator = users?.find(
                                                    (u) =>
                                                        u.id === ev.createdBy,
                                                );
                                                return (
                                                    <div
                                                        key={ev.id}
                                                        className="absolute w-full transition-transform duration-150 hover:-translate-y-0.5"
                                                        style={{
                                                            top,
                                                            height,
                                                            zIndex: 10,
                                                        }}
                                                    >
                                                        <button
                                                            key={ev.id}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onSelectEvent(
                                                                    ev,
                                                                );
                                                            }}
                                                            className={`absolute w-full rounded-xl text-left overflow-hidden shadow-lg hover:shadow-xl backdrop-blur-md ${
                                                                isMobile
                                                                    ? "px-3 py-2.5"
                                                                    : "px-2.5 py-2"
                                                            }`}
                                                            style={{
                                                                top: 0,
                                                                height: "100%",
                                                                zIndex: 10,
                                                                background: `color-mix(in srgb, ${cat.color} 14%, var(--color-bg-card))`,
                                                                border: "1px solid color-mix(in srgb, var(--color-text-primary) 16%, transparent)",
                                                                boxShadow:
                                                                    "inset 0 1px 0 color-mix(in srgb, var(--color-text-primary) 22%, transparent)",
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between gap-1.5">
                                                                <span
                                                                    className={`text-text-muted tabular-nums truncate ${isMobile ? "text-[11px]" : "text-[10px]"}`}
                                                                >
                                                                    {ev.start}–
                                                                    {ev.end}
                                                                </span>
                                                                <span
                                                                    className={`flex items-center justify-center rounded-full shrink-0 ${isMobile ? "w-5 h-5" : "w-4.5 h-4.5"}`}
                                                                    style={{
                                                                        background: `color-mix(in srgb, ${cat.color} 30%, transparent)`,
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        size={
                                                                            isMobile
                                                                                ? 11
                                                                                : 10
                                                                        }
                                                                        style={{
                                                                            color: cat.color,
                                                                        }}
                                                                    />
                                                                </span>
                                                            </div>
                                                            {!compact && (
                                                                <span
                                                                    className={`block font-bold text-text-primary truncate mt-1 leading-tight ${isMobile ? "text-sm" : "text-[13px]"}`}
                                                                >
                                                                    {ev.title}
                                                                </span>
                                                            )}
                                                            {!compact &&
                                                                !isMobile &&
                                                                creator && (
                                                                    <span
                                                                        className={`mt-auto self-end inline-flex w-fit max-w-full rounded-md px-1 truncate  ${isMobile ? "text-[11px]" : "text-[10px]"}`}
                                                                        style={{
                                                                            background: `color-mix(in srgb, ${cat.color} 30%, transparent)`,
                                                                            color: cat.color,
                                                                        }}
                                                                    >
                                                                        {
                                                                            creator.name?.split(
                                                                                " ",
                                                                            )[0]
                                                                        }
                                                                    </span>
                                                                )}
                                                        </button>
                                                        {isMobile &&
                                                            creator && (
                                                                <div className="absolute bottom-0 right-0 z-20 rounded-full shadow-md">
                                                                    <Avatar
                                                                        name={
                                                                            creator.name
                                                                        }
                                                                        uid={
                                                                            creator.id
                                                                        }
                                                                        src={
                                                                            creator.photo
                                                                        }
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                    </div>
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
