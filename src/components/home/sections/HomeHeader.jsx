"use client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import { RiRocketLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

export default function HomeHeader({
    completionRate,
    counts,
    nearDeadline,
    today,
}) {
    const { currentUser } = useAuth();

    const hour = today.getHours();
    const greeting =
        hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    const firstName = useMemo(() => {
        const name = currentUser?.name || currentUser?.displayName || "Dev";
        return name.split(" ")[0];
    }, [currentUser]);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <RiRocketLine className="text-brand-500 text-xl" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-bg-hover2">
                        Dashboard
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                    {greeting},{" "}
                    <span
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, #19CA68, #22d3ee)",
                        }}
                    >
                        {firstName}
                    </span>{" "}
                    👋
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                    {format(today, "EEEE, d 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                    })}
                </p>
            </div>

            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-bg-card border border-border-main">
                <div className="text-center">
                    <p className="text-xl font-bold text-brand-500">
                        {completionRate}%
                    </p>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wide">
                        Concluído
                    </p>
                </div>
                <div className="w-px h-10 bg-border-main" />
                <div className="text-center">
                    <p className="text-xl font-bold text-cyan-400">
                        {counts.em_andamento}
                    </p>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wide">
                        Projetos Ativos
                    </p>
                </div>
                <div className="w-px h-10 bg-border-main" />
                <div className="text-center">
                    <p className="text-xl font-bold text-warning">
                        {nearDeadline.length}
                    </p>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wide">
                        Prazo Próximo
                    </p>
                </div>
            </div>
        </div>
    );
}
