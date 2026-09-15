
'use client'
import { CAT } from "./MonthCalendar";

export default function EventPill({event, onClick}) {
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
