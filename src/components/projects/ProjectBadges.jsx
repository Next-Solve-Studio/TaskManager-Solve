import {
    PRIORITY_MAP,
    STATUS_MAP,
} from "@/components/projects/ProjectsConfig";



export function StatusBadge({ status }) {
    const s = STATUS_MAP[status];
    if (!s) return null;
    const Icon = s.icon;
    return (
        <span
             style={{
                color: s.color,
                backgroundColor: s.bg,
                borderColor: s.border,
            }}
            className={`inline-flex items-center gap-1 rounded-[20px] text-[11px] font-semibold whitespace-nowrap border py-0.75 px-2.5`}
        >
            <Icon size={11} />
            {s.label}
        </span>
    );
}

export function PriorityBadge({ priority }) {
    const p = PRIORITY_MAP[priority];
    if (!p) return null;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 8px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                color: p.color,
                background: p.bg,
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
            }}
        >
            {p.label}
        </span>
    );
}
