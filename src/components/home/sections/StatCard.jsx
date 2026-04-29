export function StatCard({ icon: Icon, label, value, color, bg, border }) {
    return (
        <div
            className="shadow-lg relative flex flex-col gap-3 p-5 rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: bg, border: `1px solid ${border}` }}
        >
            <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: color }}
            />
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ background: `${color}20` }}
                >
                    <Icon style={{ color, fontSize: 20 }} />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-text-primary tabular-nums">
                    {value}
                </p>
                <p className="text-sm text-text-secondary mt-0.5">{label}</p>
            </div>
        </div>
    );
}
