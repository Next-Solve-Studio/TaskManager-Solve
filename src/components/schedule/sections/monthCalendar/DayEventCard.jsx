
'use client'
import { CAT } from "./MonthCalendar";

export default function DayEventCard({ event, onSelect }) {
    const cfg = CAT[event.cat] ?? CAT.reuniao;
    const Icon = cfg.icon;
    return (
        <button
            type="button"
            onClick={() => onSelect(event)}
            className="w-full text-left flex items-start gap-3 p-4 rounded-2xl border border-border-main bg-bg-card hover:border-brand-500/30 transition-all"
        >
            <div
                className="flex flex-col items-center shrink-0"
                style={{ minWidth: 42 }}
            >
                <span className="text-text-primary font-bold text-sm leading-none">
                    {event.start}
                </span>
                <div
                    className="w-0.5 mt-1.5 rounded-full flex-1 min-h-5"
                    style={{ background: cfg.color, opacity: 0.35 }}
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon
                        style={{
                            color: cfg.color,
                            fontSize: 14,
                            flexShrink: 0,
                        }}
                    />
                    <span className="text-text-primary font-semibold text-sm truncate">
                        {event.title}
                    </span>
                </div>
                {event.description && (
                    <p className="text-text-muted text-xs truncate mb-2">
                        {event.description}
                    </p>
                )}
                <div className="flex items-center gap-2">
                    <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}
                    >
                        {cfg.label}
                    </span>
                    <span className="text-text-muted text-[11px]">
                        {event.start} – {event.end}
                    </span>
                </div>
            </div>
        </button>
    );
}
