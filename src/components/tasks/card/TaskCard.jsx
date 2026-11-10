import { memo } from "react";
import CardChecklist from "./sections/CardChecklist";
import CardFooter from "./sections/CardFooter";
import CardHeader from "./sections/CardHeader";
import CustomFieldsDisplay from "@/components/ui/CustomFieldsDisplay";

function TaskCard({ task, usersMap, onEdit, onDelete, settings, selectable, selected, onToggleSelect }) {
    const assignedUsers = (task.assignedTo || [])
        .map((uid) => usersMap[uid])
        .filter(Boolean);

    return (
        <div
            className={`shadow-md bg-bg-card border rounded-xl p-4 flex flex-col gap-3
        hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 select-none
        max-w-130 ${selected ? "border-brand-500/60 ring-1 ring-brand-500/30" : "border-border-main2"}`}
        >
            {/* Header */}
            <CardHeader
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                selectable={selectable}
                selected={selected}
                onToggleSelect={onToggleSelect}
            />

            {/* Descrição */}
            {settings?.showDescription !== false && task.description && (
                <p className="text-[12px] text-text-secondary leading-relaxed">
                    {task.description.length > 90
                        ? `${task.description.slice(0, 90)}…`
                        : task.description}
                </p>
            )}

            {/* Checklist progress */}
            {settings?.showChecklist !== false && <CardChecklist task={task} />}

            {/* Campos personalizados */}
            <CustomFieldsDisplay entity="task" data={task} settings={settings} />

            {/* Footer: responsáveis + datas */}
            <CardFooter task={task} assignedUsers={assignedUsers} settings={settings} />
        </div>
    );
}

export default memo(TaskCard);
