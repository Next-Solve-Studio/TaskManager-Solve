export function ProgressBar({ value, color }) {
    return (
        <div className="w-full h-1.5 rounded-full bg-[var(--color-border-main)] overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(value, 100)}%`, background: color }}
            />
        </div>
    );
}
