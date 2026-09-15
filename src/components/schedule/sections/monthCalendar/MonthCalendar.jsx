"use client";
import { eachDayOfInterval, format } from "date-fns";
import { useMemo } from "react";
import { MdEventBusy, MdFlag, MdPerson, MdVideocam } from "react-icons/md";
import DayCell from "./DayCell";
import CalendarMobile from "./CalendarMobile";

export const WEEK_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const CAT = {
    reuniao: {
        icon: MdVideocam,
        color: "#22d3ee",
        bg: "rgba(34,211,238,0.12)",
        label: "Reunião",
    },
    foco: {
        icon: MdFlag,
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)",
        label: "Foco",
    },
    pessoal: {
        icon: MdPerson,
        color: "#a855f7",
        bg: "rgba(168,85,247,0.12)",
        label: "Pessoal",
    },
    ausencia: {
        icon: MdEventBusy,
        color: "#ef4444",
        bg: "rgba(239,68,68,0.12)",
        label: "Ausência",
    },
};

export default function MonthCalendar({
    monthBase,
    calGridStart,
    calGridEnd,
    events,
    selectedDate,
    onSelectDate,
    onSelectEvent,
    onDayCreate,
    isMobile,
}) {
    
    const eventsByDate = useMemo(() => {
        const map = {};
        for (const ev of events) {
            if (!ev.date) continue;
            if (!map[ev.date]) map[ev.date] = [];
            map[ev.date].push(ev);
        }
        Object.values(map).forEach((arr) => {
            arr.sort((a, b) => a.start.localeCompare(b.start));
        });
        return map;
    }, [events]);

    const calDays = useMemo(() => {
        if (!calGridStart || !calGridEnd) return [];
        return eachDayOfInterval({ start: calGridStart, end: calGridEnd });
    }, [calGridStart, calGridEnd]);

    const selectedDayStr = selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : null;
    const selectedDayEvents = selectedDayStr
        ? (eventsByDate[selectedDayStr] ?? [])
        : [];

    if (isMobile) {
        return (
            <CalendarMobile
                calDays={calDays}
                selectedDate={selectedDate}
                onSelectDate={onSelectDate}
                selectedDayStr={selectedDayStr}
                monthBase={monthBase}
                selectedDayEvents={selectedDayEvents}
                onDayCreate={onDayCreate}
                eventsByDate={eventsByDate}
                onSelectEvent={onSelectEvent}
            />
        )
    }

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "var(--color-bg-card)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow:
                    "0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset",
            }}
        >
            {/* Header dos dias da semana */}
            <div
                className="grid grid-cols-7"
                style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.025)",
                }}
            >
                {WEEK_LABELS.map((l) => (
                    <div
                        key={l}
                        className="text-center text-[11px] font-bold uppercase tracking-wider text-text-muted py-3"
                        style={{
                            borderRight: "1px solid rgba(255,255,255,0.04)",
                        }}
                    >
                        {l}
                    </div>
                ))}
            </div>

            {/* Células dos dias */}
            <div className="grid grid-cols-7">
                {calDays.map((d) => {
                    const dStr = format(d, "yyyy-MM-dd");
                    return (
                        <DayCell
                            key={dStr}
                            date={d}
                            monthBase={monthBase}
                            dayEvents={eventsByDate[dStr] ?? []}
                            onSelectEvent={onSelectEvent}
                            onDayCreate={onDayCreate}
                        />
                    );
                })}
            </div>
        </div>
    );
}
