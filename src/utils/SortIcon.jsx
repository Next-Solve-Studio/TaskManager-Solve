export default function SortIcon({ columnKey, sortKey, sortDir }) {
    const isActive = sortKey === columnKey;
    return (
        <span style={{ display: "inline-flex", flexDirection: "column", marginLeft: 4, gap: 1 }}>
            <span style={{
                fontSize: 8, lineHeight: 1,
                color: isActive && sortDir === "asc" ? "var(--color-brand-500)" : "var(--color-text-muted)",
                opacity: isActive && sortDir === "asc" ? 1 : 0.35,
            }}>▲</span>
            <span style={{
                fontSize: 8, lineHeight: 1,
                color: isActive && sortDir === "desc" ? "var(--color-brand-500)" : "var(--color-text-muted)",
                opacity: isActive && sortDir === "desc" ? 1 : 0.35,
            }}>▼</span>
        </span>
    );
}