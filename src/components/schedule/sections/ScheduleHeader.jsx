"use client";
import { useMemo } from "react";
import { FiCalendar } from "react-icons/fi";

export default function ScheduleHeader({ isViewingAll, activeScheduleDoc }) {
    const filledDays = useMemo(() => {
        const doc = isViewingAll ? null : activeScheduleDoc;
        if (!doc) return 0;
        return Object.values(doc.days || {}).filter((d) =>
            d?.description?.trim(),
        ).length;
    }, [activeScheduleDoc, isViewingAll]);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <FiCalendar className="text-brand-500 text-lg" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-bg-hover2">
                        Agenda
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Minha Agenda
                </h1>
                <p className="text-sm text-font-gray2 mt-1">
                    Registre o que foi feito em cada dia da semana
                </p>
            </div>

            {/* Mini stats */}
            {!isViewingAll && (
                <div
                    className="flex items-center flex-wrap gap-4 px-4 py-3 rounded-2xl shrink-0"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="text-center">
                        <div>
                            <p className="text-xl font-bold text-brand-500">
                                {filledDays}
                            </p>
                            <p className="text-[10px] text-font-gray2 uppercase tracking-wide">
                                Preenchidos
                            </p>
                        </div>
                    </div>
                    <div className="text-center flex  gap-3">
                        <div className="w-px h-10 bg-white/5" />
                        <div>
                            <p className="text-xl font-bold text-font-gray2">
                                {7 - filledDays}
                            </p>
                            <p className="text-[10px] text-font-gray2 uppercase tracking-wide">
                                Pendentes
                            </p>
                        </div>
                    </div>
                    
                    <div className="text-center flex  gap-3">
                        <div className="w-px h-10 bg-white/5" />
                        <div>
                            <p className="text-xl font-bold text-cyan-400">
                                {Math.round((filledDays / 7) * 100)}%
                            </p>
                            <p className="text-[10px] text-font-gray2 uppercase tracking-wide">
                                Completo
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
