'use client'
import { format, isSameMonth, isToday } from "date-fns";
import EventPill from "./EventPill";

export default function DayCell({date, monthBase, dayEvents, onSelectEvent, onDayCreate}) {
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
