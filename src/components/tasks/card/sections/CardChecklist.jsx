import { MdCheckCircleOutline, MdOutlineChecklist } from "react-icons/md";
import { useTasks } from "@/context/TasksContext";

export default function CardChecklist({ task }) {
    const { updateChecklist } = useTasks()
    // Garante que checklist seja sempre um array
    const checklist = Array.isArray(task.checklist) ? task.checklist : [];
    // conta quantos itens do checklist estao como concluídos
    const doneCount = checklist.filter((i) => i.done).length;
    // calcula a porcentagem de conclusão
    const progress = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

    // função para alterar estado de um item da checklist
    const toggleItem = async (id) => {
        // se o id do item, for igual o clicado pelo user, invertemos a propriedade done
        const updated = checklist.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item,
        );
        try{
            await updateChecklist(task.id, updated);
        } catch (err) {
            console.error("Erro ao atualizar checklist: ", err)
            toast.error("Erro ao atualizar checklist")
        }
        
    };
    return (
        <>
            {checklist.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <MdOutlineChecklist className="text-text-muted text-sm" />
                            <span className="text-[11px] text-text-muted">
                                {doneCount}/{checklist.length}
                            </span>
                        </div>
                        <span className="text-[10px] text-text-muted">{progress}%</span>
                    </div>
                    {/* Barra de progresso */}
                    <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {/* Items do checklist (máx 3 visíveis) */}
                    <div className="flex flex-col gap-1">
                        {checklist.slice(0, 3).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className="flex items-center gap-2 text-left group cursor-pointer"
                            >
                                <MdCheckCircleOutline
                                    size={14}
                                    className={`shrink-0 transition-colors ${
                                        item.done
                                            ? "text-brand-500"
                                            : "text-text-muted group-hover:text-text-secondary"
                                    }`}
                                />
                                <span
                                    className={`text-[11px] ${
                                        item.done
                                            ? "line-through text-text-muted"
                                            : "text-text-secondary group-hover:text-text-primary"
                                    }`}
                                >
                                    {item.text}
                                </span>
                            </button>
                        ))}
                        {checklist.length > 3 && (
                            <span className="text-[10px] text-text-muted pl-5">
                                +{checklist.length - 3} itens...
                            </span>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
