import { MdOutlineTaskAlt, MdVisibility } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { AddButton } from "@/components/ui/Buttons/Buttons";

export default function TasksHeader({ handleOpenCreate, handleOpenSettings, tasks }) {
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
            <div className="flex gap-2 items-center">
                <CanDo permission="canManageProjectCardView">
                    <button
                        type="button"
                        onClick={handleOpenSettings}
                        className="h-10 px-3 bg-bg-surface border border-border-main2 rounded-xl text-text-muted hover:text-brand-500 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-center"
                        title="Configurar visualização global"
                    >
                        <MdVisibility size={20} />
                    </button>
                </CanDo>
                <CanDo permission="canCreateTasks">
                    <AddButton label="Nova Task" action={handleOpenCreate}/>
                </CanDo>
            </div>
        </div>
    );
}
