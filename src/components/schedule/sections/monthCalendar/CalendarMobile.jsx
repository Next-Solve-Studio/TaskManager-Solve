'use client'
import MiniDayCell from "./MiniDayCell";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import DayEventCard from "./DayEventCard";
import { WEEK_LABELS } from "./MonthCalendar";

export default function CalendarMobile({monthBase, onDayCreate, calDays, selectedDate, onSelectDate, selectedDayEvents, selectedDayStr, eventsByDate, onSelectEvent}) {
    return (
        <div className="space-y-5">
            <div
                className="border rounded-2xl p-3"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderColor: "rgba(255,255,255,0.08)",
                    boxShadow:
                        "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
            >
                <div className="grid grid-cols-7 mb-1">
                    {WEEK_LABELS.map((l) => (
                        <div
                            key={l}
                            className="text-center text-[9px] font-bold uppercase tracking-wider text-text-muted py-1"
                        >
                            {l}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {calDays.map((d) => {
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
                                ? format(selectedDate, "d 'de' MMMM", {
                                        locale: ptBR,
                                    })
                                : "—"}
                        </span>
                    </h3>
                </div>

                {selectedDayEvents.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                        <p className="text-text-muted text-sm">
                            Nenhum compromisso neste dia.
                        </p>
                        <button
                            type="button"
                            onClick={() =>
                                selectedDayStr &&
                                onDayCreate(selectedDayStr)
                            }
                            className="mt-3 text-[12px] font-semibold text-brand-400 border border-brand-500/30 rounded-xl px-4 py-2 hover:bg-brand-500/10 transition-colors"
                        >
                            + Adicionar compromisso
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {selectedDayEvents.map((ev) => (
                            <DayEventCard
                                key={ev.id}
                                event={ev}
                                onSelect={onSelectEvent}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
