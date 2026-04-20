// Célula editável de um dia
"use client";
import { CircularProgress } from "@mui/material";
import { format, isToday, isWeekend } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { MdCheck, MdClose, MdEdit } from "react-icons/md";
import { toast } from "sonner";
import useIsMobile from "@/responsive/useIsMobile";

export default function CardScheduleEdit({
    dayKey,
    dayLabel,
    date,
    scheduleDoc,
    canEdit,
    onSave,
}) {
    const isMobile= useIsMobile()
    const description = scheduleDoc?.days?.[dayKey]?.description || "";
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(description);
    const [saving, setSaving] = useState(false);
    const textareaRef = useRef(null);

    // Sync quando descrição mudar externamente
    useEffect(() => {
        if (!editing) setDraft(description);
    }, [description, editing]);

    useEffect(() => {
        if (editing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(
                textareaRef.current.value.length,
                textareaRef.current.value.length,
            );
        }
    }, [editing]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(dayKey, draft);
            setEditing(false);
            toast.success("Salvo!");
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setDraft(description);
        setEditing(false);
    };

    const todayDay = isToday(date);
    const weekend = isWeekend(date);

    return (
        <div
            className="flex flex-col gap-2 p-4 rounded-2xl transition-all duration-200 group relative"
            style={{
                background: todayDay
                    ? "rgba(25,202,104,0.06)"
                    : weekend
                      ? "rgba(255,255,255,0.015)"
                      : "rgba(255,255,255,0.025)",
                border: todayDay
                    ? "1px solid rgba(25,202,104,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                minHeight: "160px",
            }}
        >
            {/* Header do dia */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{
                                color: todayDay
                                    ? "#19CA68"
                                    : weekend
                                      ? "#4b5563"
                                      : "#6b7280",
                            }}
                        >
                            {dayLabel}
                        </span>
                        {todayDay && (
                            <span
                                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                style={{
                                    background: "rgba(25,202,104,0.15)",
                                    color: "#19CA68",
                                }}
                            >
                                Hoje
                            </span>
                        )}
                    </div>
                    <p className="text-white font-semibold text-base mt-0.5">
                        {format(date, "d", { locale: ptBR })}
                        <span className="text-[#4b5563] font-normal text-sm ml-1">
                            {format(date, "MMM", { locale: ptBR })}
                        </span>
                    </p>
                </div>

                {/* Botão editar (só para o próprio usuário e se pode editar) */}
                {canEdit && !editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="opacity-0 lg:group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded-lg hover:bg-white/10"
                        style={{ color: "#6b7280" }}
                    >
                        <MdEdit size={15} />
                    </button>
                )}
            </div>

            <div className="flex-1">
                {editing ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            ref={textareaRef}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            rows={4}
                            placeholder="O que você fez hoje?"
                            className="w-full resize-none rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#4b5563] outline-none transition-all duration-150"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(25,202,104,0.4)",
                                fontFamily: "inherit",
                            }}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                                style={{
                                    background: "rgba(25,202,104,0.15)",
                                    border: "1px solid rgba(25,202,104,0.3)",
                                    color: "#19CA68",
                                }}
                            >
                                {saving ? (
                                    <CircularProgress
                                        size={10}
                                        style={{ color: "#19CA68" }}
                                    />
                                ) : (
                                    <MdCheck size={13} />
                                )}
                                Salvar
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    color: "#6b7280",
                                }}
                            >
                                <MdClose size={13} />
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        className={`text-sm ${isMobile?'h-full w-full text-start' : ''} leading-relaxed ${description ? "text-[#d1d5db]" : "text-[#374151]"} ${canEdit && !description ? "italic" : ""}`}
                        style={{ whiteSpace: "pre-wrap" }}
                        onClick={() => setEditing(true)}
                    >
                        {description ||
                            (canEdit ? "Clique em ✏️ para adicionar..." : "—")}
                    </button>
                )}
            </div>
        </div>
    );
}
