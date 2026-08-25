/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";
import { MdClose, MdVideocam } from "react-icons/md";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/AvatarBadge";
import { CATEGORIES } from "@/context/ScheduleContext";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function EventDetailModal({ event, users, currentUserId, onClose, onEdit, onDeleted, deleteMeeting }) {
    if (!event) return null;
    const cat = CATEGORIES[event.cat] || CATEGORIES.foco;
    const isOwner = event.createdBy === currentUserId;
    const participants = event.people.map((id) => users.find((u) => u.id === id)).filter(Boolean);

    const handleDelete = async () => {
        try {
            const result = await deleteMeeting(event.id);
            if (result.googleCancelled === false) {
                toast.warning("Evento excluído do sistema, mas não deu para cancelar no Google Calendar — cancele manualmente por lá.");
            } else {
                toast.success("Evento excluído.");
            }
            onDeleted?.();
        } catch (err) {
            toast.error(getErrorMessage(err, "Erro ao excluir evento"));
        }
    };

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
            <div className="w-full max-w-md rounded-2xl p-5 bg-bg-card border border-border-main shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-semibold text-text-primary">{event.title}</h3>
                    <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <MdClose size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    {cat.label}
                </div>

                <p className="text-sm text-text-secondary mb-4">{event.start} – {event.end}</p>

                {event.description && <p className="text-sm text-text-secondary leading-relaxed mb-4">{event.description}</p>}

                <p className="text-[11px] uppercase tracking-wide text-text-muted mb-2">Participantes</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {participants.map((u) => (
                        <span key={u.id} className="flex items-center gap-1.5 bg-bg-surface rounded-full pl-1 pr-3 py-1 text-xs text-text-secondary">
                            <Avatar name={u.name} uid={u.id} src={u.photo} size={20} />
                            {u.name}
                        </span>
                    ))}
                </div>

                {event.meetLink && (
                    <a href={event.meetLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold mb-3 bg-cyan-400/15 border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/20">
                        <MdVideocam size={16} />
                        Entrar no Google Meet
                    </a>
                )}

                {isOwner && (
                    <div className="flex gap-2">
                        <button type="button" onClick={() => onEdit(event)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-bg-surface border border-border-main text-text-secondary hover:bg-bg-side">
                            Editar
                        </button>
                        <button type="button" onClick={handleDelete} className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20">
                            Excluir
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}