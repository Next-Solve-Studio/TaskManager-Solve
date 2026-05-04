import CanDo from "@/components/auth/CanDo";
import { MdAdd, MdOutlineTaskAlt } from "react-icons/md";

export default function TasksHeader({handleOpenCreate, tasks}) {
    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <MdOutlineTaskAlt className="text-brand-500 text-lg" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                        Gestão de Tarefas
                    </span>
                </div>
                <h1 className="text-[26px] font-extrabold text-text-primary m-0">
                    Tarefas
                </h1>
                <p className="text-[13px] text-text-muted mt-1">
                    {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""} no
                    sistema
                </p>
            </div>
            <CanDo permission="canCreateTasks">
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 px-5 py-1.5 bg-brand-500 hover:bg-brand-700 text-white text-[13px] font-bold rounded-lg transition-colors cursor-pointer tracking-wide"
                >
                    <MdAdd size={18} className="mt-0.5"/>
                    Nova Tarefa
                </button>
            </CanDo>
        </div>
    )
}
