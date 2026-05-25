export function DashboardHeader
({ title, subtitle, icon: Icon, iconColor = "#22d3ee", iconBg }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
                {/* Barra de acento brand → cyan */}
                <div
                    className="w-0.75 h-5 rounded-full shrink-0"
                    style={{ background: "linear-gradient(to bottom, #19ca68, #22d3ee)" }}
                />
                <div>
                    <h2 className="text-base font-bold text-text-primary">{title}</h2>
                    {subtitle && (
                        <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {Icon && (
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: iconBg ?? `${iconColor}18` }}
                >
                    <Icon style={{ color: iconColor, fontSize: 16 }} />
                </div>
            )}
        </div>
    );
}