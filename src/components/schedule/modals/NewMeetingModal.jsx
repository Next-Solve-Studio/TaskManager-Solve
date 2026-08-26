"use client";
import { CircularProgress, TextField, MenuItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/AvatarBadge";
import { CATEGORIES, WEEK_DAYS } from "@/context/ScheduleContext";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { muiDark, menuPaper } from "@/styles/StyleInputs";

const emptyForm = (dayKey, start) => ({
    title: "", dayKey: dayKey || WEEK_DAYS[0].key, start: start || "09:00", end: "10:00",
    cat: "reuniao", description: "", people: [],
});

export default function NewMeetingModal({ open, onClose, onSaved, users, currentUserId, saveMeeting, googleStatus, connectGoogle, initialDayKey, initialStart, editingEvent }) {
    const [form, setForm] = useState(emptyForm());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        if (editingEvent) {
            setForm({
                title: editingEvent.title, dayKey: editingEvent.dayKey, start: editingEvent.start, end: editingEvent.end,
                cat: editingEvent.cat, description: editingEvent.description || "",
                people: editingEvent.people.filter((id) => id !== currentUserId),
            });
        } else {
            setForm(emptyForm(initialDayKey, initialStart));
        }
        setError("");
    }, [open, editingEvent, initialDayKey, initialStart, currentUserId]);

    if (!open) return null;

    const togglePerson = (id) => {
        setForm((f) => ({ ...f, people: f.people.includes(id) ? f.people.filter((p) => p !== id) : [...f.people, id] }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || form.start >= form.end) {
            setError("Dê um título e confira o horário (fim depois do início).");
            return;
        }
        if (form.cat === "reuniao" && !googleStatus.connected) {
            setError("Conecte o Google Calendar antes de criar uma reunião.");
            return;
        }
        setError("");
        setSaving(true);
        try {
            await saveMeeting({
                id: editingEvent?.id, title: form.title.trim(), dayKey: form.dayKey, start: form.start, end: form.end,
                cat: form.cat, description: form.description.trim(), peopleIds: form.people,
            });
            toast.success(editingEvent ? "Evento atualizado." : "Evento criado na agenda.");
            onSaved?.();
        } catch (err) {
            toast.error(getErrorMessage(err, "Erro ao salvar evento"));
        } finally {
            setSaving(false);
        }
    };

    const otherUsers = users.filter((u) => u.id !== currentUserId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl p-5 bg-bg-card border border-border-main shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-base font-semibold text-text-primary">{editingEvent ? "Editar evento" : "Nova Atividade"}</h3>
                    <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <MdClose size={18} />
                    </button>
                </div>

                {form.cat === "reuniao" && !googleStatus.connected && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-500 flex items-center justify-between gap-2">
                        <span>Conecte o Google Calendar para gerar o link do Meet.</span>
                        <button type="button" onClick={connectGoogle} className="font-semibold underline shrink-0">Conectar</button>
                    </div>
                )}

                <div className="flex flex-col gap-3 mb-4">
                    <input type="text" placeholder="Título" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2.5 text-sm bg-bg-surface border border-border-main2 text-text-primary outline-none focus:border-brand-500" />

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Dia da Semana"
                        value={form.dayKey}
                        onChange={(e) => setForm((f) => ({ ...f, dayKey: e.target.value }))}
                        sx={muiDark}
                        slotProps={{ select: { MenuProps: menuPaper } }}
                    >
                        {WEEK_DAYS.map((d) => (
                            <MenuItem key={d.key} value={d.key}>
                                {d.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="time"
                            fullWidth
                            size="small"
                            label="Início"
                            value={form.start}
                            onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
                            sx={muiDark}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            type="time"
                            fullWidth
                            size="small"
                            label="Fim"
                            value={form.end}
                            onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
                            sx={muiDark}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Stack>

                    <div className="flex gap-2 flex-wrap">
                        {Object.entries(CATEGORIES).map(([key, c]) => (
                            <button key={key} type="button" onClick={() => setForm((f) => ({ ...f, cat: key }))}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${form.cat === key ? "border-text-muted text-text-primary bg-bg-surface" : "border-border-main2 text-text-secondary"}`}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <textarea rows={3} placeholder="Pauta (opcional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full resize-none rounded-lg px-3 py-2.5 text-sm bg-bg-surface border border-border-main2 text-text-primary outline-none focus:border-brand-500" />
                </div>

                <p className="text-[11px] uppercase tracking-wide text-text-muted mb-2">Participantes</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {otherUsers.map((u) => {
                        const selected = form.people.includes(u.id);
                        return (
                            <button key={u.id} type="button" onClick={() => togglePerson(u.id)}
                                className={`flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full text-xs border ${selected ? "border-brand-500 text-text-primary bg-brand-500/10" : "border-border-main2 text-text-secondary"}`}>
                                <Avatar name={u.name} uid={u.id} src={u.photo} size={20} />
                                {u.name.split(" ")[0]}
                            </button>
                        );
                    })}
                </div>

                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-bg-surface border border-border-main text-text-secondary hover:bg-bg-side">
                        Cancelar
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold bg-brand-500 text-black hover:brightness-110 disabled:opacity-60">
                        {saving && <CircularProgress size={14} style={{ color: "#000" }} />}
                        {editingEvent ? "Salvar" : "Criar evento"}
                    </button>
                </div>
            </div>
        </div>
    );
}