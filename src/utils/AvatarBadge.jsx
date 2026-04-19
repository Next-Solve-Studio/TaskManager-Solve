export const AVATAR_COLORS = [
    "#19CA68",
    "#22d3ee",
    "#f59e0b",
    "#a78bfa",
    "#ef4444",
    "#fb923c",
    "#34d399",
    "#60a5fa",
    "#f472b6",
    "#facc15",
];

export function getInitials(name = "") {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("");
}

export function avatarColor(uid = "") {
    let hash = 0;
    for (const c of uid) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

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