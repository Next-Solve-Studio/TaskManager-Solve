'use client'
import { AiOutlineClear } from 'react-icons/ai';
import { MdSearch } from 'react-icons/md';

export default function ClientFilters({ search, setSearch, filterStatus, setFilterStatus }) {

    const hasFilters = search || filterStatus !== "all";

    const statusFilters = [
        { value: "all", label: "Todos" },
        { value: "active", label: "Ativos" },
        { value: "inactive", label: "Inativos" },
    ];

    const clearFilters = () => {
        setSearch("");
        setFilterStatus("all");
    };
    return (
        <div className="flex flex-wrap gap-2.5 p-3.5 bg-bg-card border border-border-main rounded-[14px] items-center shadow-md">
            <div
                style={{
                    position: "relative",
                    flex: "1 1 200px",
                    minWidth: 180,
                }}
            >
                <MdSearch
                    size={16}
                    style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-text-muted)",
                    }}
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome ou e-mail..."
                    className="w-full bg-bg-side border border-border-main rounded-lg p-[7px_10px_7px_32px] outline-none text-text-primary text-[13px] focus:border-brand-500 transition-colors"
                />
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {statusFilters.map((sf) => {
                    const active = filterStatus === sf.value;
                    return (
                        <button
                            key={sf.value}
                            type="button"
                            onClick={() => setFilterStatus(sf.value)}
                            className="px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer"
                            style={{
                                background: active
                                    ? "rgba(25,202,104,0.15)"
                                    : "var(--color-bg-side)",
                                border: active
                                    ? "1px solid rgba(25,202,104,0.35)"
                                    : "1px solid var(--color-border-main)",
                                color: active
                                    ? "var(--color-brand-500)"
                                    : "var(--color-text-muted)",
                            }}
                        >
                            {sf.label}
                        </button>
                    );
                })}
            </div>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    type="button"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: 8,
                        color: "#ef4444",
                        padding: "6px 8px",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                    }}
                >
                    <AiOutlineClear className="text-xl" />
                </button>
            )}
        </div>
    )
}
