export function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className="rounded-xl px-4 py-3 text-sm shadow-2xl"
            style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-main)",
            }}
        >
            <p className="text-text-primary font-semibold mb-2">{label}</p>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: entry.color }}
                    />
                    <span className="text-text-secondary">{entry.name}:</span>
                    <span className="text-text-primary font-bold">
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
