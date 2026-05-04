import { useMemo } from "react";
import { StatPill } from "@/components/ui/StatPill";

export default function TasksStats({ tasks }) {

    // calcula número de tarefas por status com base em todas as tarefas
    const stats = useMemo(
        () => ({
            total: tasks.length,
            concluido: tasks.filter((t) => t.status === "concluido").length,
            em_andamento: tasks.filter((t) => t.status === "em_andamento")
                .length,
            pausado: tasks.filter((t) => t.status === "pausado").length,
        }),
        [tasks],
    );

    // Lista das chaves que desejo exibir (pode omitir "suporte", por exemplo)
    const visibleKeys = ['total', 'em_andamento', 'concluido', 'pausado'];
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {visibleKeys.map((key) => (
                <StatPill
                    key={key}
                    type={key}    
                    value={stats[key] || 0}
                />
            ))}
        </div>
    );
}
