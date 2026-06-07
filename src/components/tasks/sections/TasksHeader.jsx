import { MdOutlineTaskAlt } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { AddButton } from "@/components/ui/Buttons/Buttons";

export default function TasksHeader({ handleOpenCreate, tasks }) {
    return (
        <div className="flex items-end justify-between flex-wrap gap-4">
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
                    {tasks.length} tarefa{tasks.length === 1 ? "" : "s"} no
                    sistema
                </p>
            </div>
            <CanDo permission="canCreateTasks">
                <AddButton label="Nova Task" action={handleOpenCreate}/>
            </CanDo>
        </div>
    );
}
