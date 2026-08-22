import { MdOutlineCalendarToday, MdPerson } from "react-icons/md";
import { Avatar } from "@/components/ui/AvatarBadge";
import { formatDateInput } from "@/utils/FormatDateProjects";

export default function CardFooter({ assignedUsers, task, settings }) {
    const isOverdue =
        task.endDate &&
        task.status !== "concluido" &&
        new Date(
            task.endDate?.toDate
                ? task.endDate.toDate()
                : new Date(task.endDate),
        ) < new Date();

    if (settings?.showAssignees === false && settings?.showDates === false) {
        return null;
    }

    return (
        <div className="flex items-center justify-between pt-1 border-t border-border-main2/50">
            {/* Avatares dos responsáveis */}
            {settings?.showAssignees !== false && (
                <div className="flex items-center -space-x-1.5">
                {assignedUsers.length === 0 ? (
                    <div className="flex items-center gap-1 text-text-muted">
                        <MdPerson size={13} />
                        <span className="text-[11px]">Sem responsável</span>
                    </div>
                ) : (
                    assignedUsers.slice(0, 3).map((u) => (
                        <div key={u.id} title={u.name}>
                            <Avatar
                                name={u.name}
                                uid={u.id}
                                size={26}
                                src={u.photo}
                            />
                        </div>
                    ))
                )}
                {assignedUsers.length > 3 && (
                    <span className="text-[10px] text-text-muted ml-2">
                        +{assignedUsers.length - 3}
                    </span>
                )}
            </div>
            )}

            {/* Datas */}
            {settings?.showDates !== false && (task.startDate || task.endDate) && (
                <div
                    className={`flex items-center gap-1 text-[10px] ${
                        isOverdue ? "text-error" : "text-text-muted"
                    }`}
                >
                    <MdOutlineCalendarToday size={11} />
                    <span>
                        {formatDateInput(task.startDate).dateFormatted}
                        {task.startDate && task.endDate && " → "}
                        {formatDateInput(task.endDate).dateFormatted}
                    </span>
                </div>
            )}
        </div>
    );
}
