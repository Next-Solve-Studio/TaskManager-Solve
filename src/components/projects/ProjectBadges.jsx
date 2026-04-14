import {
  avatarColor,
  getInitials,
  PRIORITY_MAP,
  STATUS_MAP,
} from "@/components/projects/ProjectsConfig";

export function Avatar({ name, uid, size = 32 }) {
  const color = avatarColor(uid || name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `${color}20`,
        border: `2px solid ${color}50`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 700,
        color,
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

export function StatusBadge({ status }) {
  const s = STATUS_MAP[status];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
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
