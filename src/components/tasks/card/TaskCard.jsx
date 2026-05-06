import { memo } from "react";

import CardHeader from "./sections/CardHeader";
import CardFooter from "./sections/CardFooter";
import CardChecklist from "./sections/CardChecklist";

function TaskCard({ task, usersMap, onEdit, onDelete}) {
    
    const assignedUsers = (task.assignedTo || [])
        .map((uid) => usersMap[uid])
        .filter(Boolean)

    return (
        <div className="bg-bg-card border border-border-main2 rounded-xl p-4 flex flex-col gap-3 
        hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 select-none
        max-w-130 ">
            {/* Header */}
            <CardHeader task={task} onEdit={onEdit} onDelete={onDelete}/>

            {/* Descrição */}
            {task.description && (
                <p className="text-[12px] text-text-secondary leading-relaxed">
                    {task.description.length > 90
                        ? `${task.description.slice(0, 90)}…`
                        : task.description}
                </p>
            )}

            {/* Checklist progress */}
            <CardChecklist task={task}/>

            {/* Footer: responsáveis + datas */}
            <CardFooter task={task} assignedUsers={assignedUsers}/>
        </div>
    )
}

export default memo(TaskCard);