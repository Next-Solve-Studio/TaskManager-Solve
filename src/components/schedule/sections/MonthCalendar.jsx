"use client";
import { format, isSameMonth, isToday, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import { MdEventBusy, MdFlag, MdPerson, MdVideocam } from "react-icons/md";

const WEEK_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const CAT = {
    reuniao:  { icon: MdVideocam,  color: "#22d3ee", bg: "rgba(34,211,238,0.12)",  label: "Reunião"  },
    foco:     { icon: MdFlag,      color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "Foco"     },
    pessoal:  { icon: MdPerson,    color: "#a855f7", bg: "rgba(168,85,247,0.12)",  label: "Pessoal"  },
    ausencia: { icon: MdEventBusy, color: "#ef4444", bg: "rgba(239,68,68,0.12)",   label: "Ausência" },
};

function EventPill({ event, onClick }) {
    const cfg  = CAT[event.cat] ?? CAT.reuniao;
    const Icon = cfg.icon;
    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(event); }}
            title={event.title}
            className="w-full text-left flex items-center gap-1 px-1.5 py-0.75 rounded-md text-[11px] truncate hover:opacity-80 transition-opacity"
            style={{ background: cfg.bg, borderLeft: `2px solid ${cfg.color}` }}
        >
            <Icon style={{ color: cfg.color, fontSize: 10, flexShrink: 0 }} />
            <span className="truncate font-medium" style={{ color: "var(--color-text-primary)" }}>
                {event.start} {event.title}
            </span>
        </button>
    );
}

function DayCell({ date, monthBase, dayEvents, onSelectEvent, onDayCreate }) {
    const other = !isSameMonth(date, monthBase);
    const today = isToday(date);
    const dStr  = format(date, "yyyy-MM-dd");
    const MAX   = 3;
    const over  = dayEvents.length - MAX;

    const isTodayCell = () =>{
        if (today){
            return  "bg-brand-500 text-black shadow-[0_0_12px_rgba(26,215,111,0.55)]"
        }
        else if(other)  {
            return "text-text-muted opacity-30"
        }
        else {
            return ""
        }
    }

    return (
        <div
            className="relative min-h-27.5 border-t border-r group transition-all duration-150 hover:bg-white/[0.035] focus-within:bg-white/[0.035]"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
            <button
                type="button"
                className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                onClick={() => onDayCreate(dStr)}
                aria-label={`Adicionar compromisso em ${format(date, "dd/MM/yyyy")}`}
            />

            <div className="relative z-10 p-1.5 pointer-events-none flex flex-col h-full">
                
                <div className="flex justify-end mb-1">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all
                        ${isTodayCell()}`}>
                        {date.getDate()}
                    </span>
                </div>

                <div className="flex flex-col gap-0.5 pointer-events-auto">
                    {dayEvents.slice(0, MAX).map(ev => (
                        <EventPill key={ev.id} event={ev} onClick={onSelectEvent} />
                    ))}
                    {over > 0 && (
                        <span className="text-[10px] text-text-muted pl-1 hover:text-text-primary cursor-default">
                            +{over} mais
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function MiniDayCell({ date, monthBase, dayEvents, isSelected, onSelect }) {
    const other = !isSameMonth(date, monthBase);
    const today = isToday(date);
    const dots  = dayEvents.slice(0, 3);

    const isSelectedCell =()=>{
        if (isSelected) {
            return "bg-white/15 text-brand-400"
        }
        else if(other) {
            return "text-text-muted opacity-30"
        }
        else{
            return "text-text-primary"
        }
    }

    return (
        <button
            type="button"
            onClick={() => onSelect(date)}
            className="flex flex-col items-center py-1 rounded-xl w-full transition-colors hover:bg-white/5"
        >
            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                ${today      ? "bg-brand-500 text-black shadow-[0_0_10px_rgba(26,215,111,0.5)]" :
                  isSelectedCell()}`}>
                {date.getDate()}
            </span>
            <div className="flex gap-0.75 mt-0.5 h-1.5 items-center">
                {dots.map(ev => {
                    const c = (CAT[ev.cat] ?? CAT.reuniao).color;
                    return <span key={ev.id} className="w-1 h-1 rounded-full" style={{ background: c }} />;
                })}
            </div>
        </button>
    );
}

function DayEventCard({ event, onSelect }) {
    const cfg  = CAT[event.cat] ?? CAT.reuniao;
    const Icon = cfg.icon;
    return (
        <button
            type="button"
            onClick={() => onSelect(event)}
            className="w-full text-left flex items-start gap-3 p-4 rounded-2xl border border-border-main bg-bg-card hover:border-brand-500/30 transition-all"
        >
            <div className="flex flex-col items-center shrink-0" style={{ minWidth: 42 }}>
                <span className="text-text-primary font-bold text-sm leading-none">{event.start}</span>
                <div className="w-0.5 mt-1.5 rounded-full flex-1 min-h-5"
                    style={{ background: cfg.color, opacity: 0.35 }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon style={{ color: cfg.color, fontSize: 14, flexShrink: 0 }} />
                    <span className="text-text-primary font-semibold text-sm truncate">{event.title}</span>
                </div>
                {event.description && (
                    <p className="text-text-muted text-xs truncate mb-2">{event.description}</p>
                )}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                    </span>
                    <span className="text-text-muted text-[11px]">{event.start} – {event.end}</span>
                </div>
            </div>
        </button>
    );
}

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
        Object.values(map).forEach(arr => {
            arr.sort((a, b) => a.start.localeCompare(b.start));
        });
        return map;
    }, [events]);

    const calDays = useMemo(() => {
        if (!calGridStart || !calGridEnd) return [];
        return eachDayOfInterval({ start: calGridStart, end: calGridEnd });
    }, [calGridStart, calGridEnd]);

    const selectedDayStr    = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
    const selectedDayEvents = selectedDayStr ? (eventsByDate[selectedDayStr] ?? []) : [];

    if (isMobile) {
        return (
            <div className="space-y-5">
                <div
                    className="border rounded-2xl p-3"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderColor: "rgba(255,255,255,0.08)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                >
                    <div className="grid grid-cols-7 mb-1">
                        {WEEK_LABELS.map(l => (
                            <div key={l} className="text-center text-[9px] font-bold uppercase tracking-wider text-text-muted py-1">
                                {l}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {calDays.map(d => {
                            const dStr = format(d, "yyyy-MM-dd");
                            return (
                                <MiniDayCell
                                    key={dStr}
                                    date={d}
                                    monthBase={monthBase}
                                    dayEvents={eventsByDate[dStr] ?? []}
                                    isSelected={dStr === selectedDayStr}
                                    onSelect={onSelectDate}
                                />
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-center mb-3">
                        <h3 className="text-text-primary font-bold text-sm">
                            Compromissos do dia{" "}
                            <span className="text-brand-400">
                                {selectedDate
                                    ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                                    : "—"}
                            </span>
                        </h3>
                    </div>

                    {selectedDayEvents.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-center">
                            <p className="text-text-muted text-sm">Nenhum compromisso neste dia.</p>
                            <button
                                type="button"
                                onClick={() => selectedDayStr && onDayCreate(selectedDayStr)}
                                className="mt-3 text-[12px] font-semibold text-brand-400 border border-brand-500/30 rounded-xl px-4 py-2 hover:bg-brand-500/10 transition-colors"
                            >
                                + Adicionar compromisso
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {selectedDayEvents.map(ev => (
                                <DayEventCard key={ev.id} event={ev} onSelect={onSelectEvent} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "var(--color-bg-card)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset",
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
                {WEEK_LABELS.map(l => (
                    <div
                        key={l}
                        className="text-center text-[11px] font-bold uppercase tracking-wider text-text-muted py-3"
                        style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}
                    >
                        {l}
                    </div>
                ))}
            </div>

            {/* Células dos dias */}
            <div className="grid grid-cols-7">
                {calDays.map(d => {
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