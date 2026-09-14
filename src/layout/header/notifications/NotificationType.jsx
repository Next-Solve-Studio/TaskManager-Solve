import {
    MdAccessTime,
    MdCalendarToday,
    MdEvent,
    MdFolder,
    MdWarning,
} from "react-icons/md";

export const TYPE_CONFIG = {
    task_overdue: {
        icon: MdWarning,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        label: "Tarefa vencida",
    },
    task_soon: {
        icon: MdAccessTime,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        label: "Vence em breve",
    },
    project_overdue: {
        icon: MdWarning,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        label: "Projeto vencido",
    },
    project_soon: {
        icon: MdFolder,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        label: "Prazo próximo",
    },
    event_today: {
        icon: MdEvent,
        color: "text-brand-400",
        bg: "bg-brand-500/10",
        border: "border-brand-500/20",
        label: "Evento hoje",
    },
    event_upcoming: {
        icon: MdCalendarToday,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        label: "Em breve",
    },
};