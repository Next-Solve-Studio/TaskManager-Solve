"use client";

import { useMemo } from "react";
import { MdRadar } from "react-icons/md";
import { Avatar } from "@/components/ui/AvatarBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ROLE_LABELS } from "@/lib/roles";

const MAX_BAR = 6;

const LOAD_LEVELS = {
    available: { color: "#10b981", label: "Disponível" },
    busy: { color: "#fbbf24", label: "Ocupado" },
    overloaded: { color: "#f43f5e", label: "Sobrecarregado" },
};

function getLevel(count) {
    if (count <= 2) return "available";
    if (count === 3) return "busy";
    return "overloaded";
}

export function TeamRadar({ users, projects }) {
    const devStats = useMemo(() => {
        const active = projects.filter(
            (p) => p.status !== "concluido" && p.status !== "arquivado",
        );
        return users.map((u) => {
            const count = active.filter((p) =>
                p.developers?.includes(u.id),
            ).length;
            return { user: u, count, level: getLevel(count) };
        });
    }, [users, projects]);

    const summary = useMemo(
        () => ({
            overloaded: devStats.filter((d) => d.level === "overloaded").length,
            busy: devStats.filter((d) => d.level === "busy").length,
            available: devStats.filter((d) => d.level === "available").length,
        }),
        [devStats],
    );

    return (
        <section className="rounded-2xl p-5 space-y-4 bg-bg-card border border-border-main">
            {/* cabeçalho */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MdRadar className="text-indigo-400 text-xl" />
                    <h2 className="text-base font-bold text-text-primary">
                        Radar do Time
                    </h2>
                </div>
                <span className="text-xs text-text-secondary">
                    {devStats.length} devs
                </span>
            </div>

            {/* grid de cards */}
            <div
                className="grid gap-3"
                style={{
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(148px, 1fr))",
                }}
            >
                {devStats.map(({ user, count, level }) => {
                    const { color, label } = LOAD_LEVELS[level];
                    return (
                        <div
                            key={user.id}
                            className="flex flex-col gap-3 rounded-xl px-3 pt-3 pb-2.5 bg-bg-surface border border-border-subtle hover:border-border-main transition-colors group"
                        >
                            <div className="flex flex-col items-center text-center gap-1.5">
                                <Avatar
                                    name={user.name}
                                    uid={user.id}
                                    src={user.photo}
                                    size={36}
                                />
                                <div>
                                    <p className="text-xs font-semibold text-text-primary leading-tight line-clamp-1">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] text-text-muted truncate">
                                        {ROLE_LABELS[user.role] || user.role}
                                    </p>
                                </div>
                            </div>

                            {/* barra de carga */}
                            <div className="space-y-1">
                                <ProgressBar
                                    value={(count / MAX_BAR) * 100}
                                    color={color}
                                />
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                        style={{
                                            color,
                                            background: `${color}18`,
                                            border: `1px solid ${color}40`,
                                        }}
                                    >
                                        {label}
                                    </span>
                                    <span className="text-[11px] font-semibold text-text-secondary tabular-nums">
                                        {count}
                                        <span className="text-[9px] font-normal">
                                            {" "}
                                            proj
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* rodapé resumo */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-border-main">
                {[
                    { key: "overloaded", label: "sobrecarregado" },
                    { key: "busy", label: "ocupado" },
                    { key: "available", label: "disponível" },
                ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: LOAD_LEVELS[key].color }}
                        />
                        <span className="text-xs text-text-secondary">
                            <span className="text-text-primary font-semibold">
                                {summary[key]}
                            </span>{" "}
                            {label}
                            {summary[key] !== 1 ? "s" : ""}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
