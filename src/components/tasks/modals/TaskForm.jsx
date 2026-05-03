"use client";
import {
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    MdAdd,
    MdClose,
    MdDelete,
    MdOutlineChecklist,
    MdOutlineTaskAlt,
} from "react-icons/md";
import { Avatar } from "@/components/ui/AvatarBadge";
import { menuPaper, muiDark } from "@/styles/StyleInputs";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/StatusBadge";
import { formatDateInput } from "@/utils/FormatDateProjects";

function TaskForm({ open, onClose, task, users, usersMap, onSubmit, loading}) {
    const isEdit = Boolean(task)

    const defaultValues = {
        title: "",
        description: "",
        assignedTo: [],
        startDate: "",
        endDate: "",
        priority: "media",
        status: "pendente",
        solution: "",
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({ defaultValues });

     // Checklist gerenciado separadamente
    const [checklistItems, setChecklistItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    useEffect(() => {
        if (open) {
            if (task) {
                reset({
                    title: task.title || "",
                    description: task.description || "",
                    assignedTo: task.assignedTo || [],
                    startDate: formatDateInput(task.startDate),
                    endDate: formatDateInput(task.endDate),
                    priority: task.priority || "media",
                    status: task.status || "em_andamento",
                    solution: task.solution || "",
                })
                setChecklistItems(task.checklist || [])
            } else{
                reset(defaultValues)
                setChecklistItems([])
            }
            setNewItem("")
        }
    }, [open, task, reset])

     const addChecklistItem = () => {
        const trimmed = newItem.trim();
        if (!trimmed) return;
        setChecklistItems((prev) => [
            ...prev,
            { id: Date.now().toString(), text: trimmed, done: false },
        ]);
        setNewItem("");
    };

    const toggleChecklistItem = (id) => {
        setChecklistItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, done: !item.done } : item,
            ),
        );
    };

    const removeChecklistItem = (id) => {
        setChecklistItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onValid = (data) => {
        onSubmit({ ...data, checklist: checklistItems });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border-main2)",
                    borderRadius: "18px",
                    backgroundImage: "none",
                    color: "var(--color-text-primary)",
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
                            <MdOutlineTaskAlt className="text-brand-500 text-base" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary m-0">
                                {isEdit ? "Editar Tarefa" : "Nova Tarefa"}
                            </p>
                            <p className="text-[16px] font-extrabold text-text-primary m-0 leading-tight">
                                {isEdit ? task.title : "Criar tarefa"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-bg-surface cursor-pointer"
                    >
                        <MdClose size={18} />
                    </button>
                </div>
            </DialogTitle>

            <form onSubmit={handleSubmit(onValid)}>
                <DialogContent
                    sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}
                >
                    {/* Título */}
                    <TextField
                        label="Título *"
                        size="small"
                        fullWidth
                        sx={muiDark}
                        {...register("title", { required: "Título obrigatório" })}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    {/* Descrição */}
                    <TextField
                        label="Descrição"
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        sx={muiDark}
                        {...register("description")}
                    />

                    {/* Responsáveis */}
                    <Controller
                        name="assignedTo"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth size="small" sx={muiDark}>
                                <InputLabel>Responsáveis</InputLabel>
                                <Select
                                    multiple
                                    value={field.value}
                                    MenuProps={menuPaper}
                                    onChange={field.onChange}
                                    input={<OutlinedInput label="Responsáveis" />}
                                    renderValue={(selected) => (
                                        <div className="flex flex-wrap gap-1">
                                            {selected.map((uid) => (
                                                <Chip
                                                    key={uid}
                                                    label={usersMap[uid]?.name || uid}
                                                    size="small"
                                                    sx={{
                                                        background: "rgba(25,202,104,0.15)",
                                                        color: "var(--color-brand-500)",
                                                        fontSize: 11,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                            
                                >
                                    {users.map((u) => (
                                         <MenuItem key={u.id} value={u.id}>
                                            <Checkbox
                                                checked={field.value.includes(u.id)}
                                                size="small"
                                                sx={{
                                                    color: "var(--color-brand-500)",
                                                    "&.Mui-checked": { color: "var(--color-brand-500)" },
                                                }}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    name={u.name}
                                                    uid={u.id}
                                                    size={22}
                                                    src={u.photo}               // URL da foto
                                                />
                                                <span className="text-[13px]">{u.name}</span>
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-3">
                        <TextField
                            label="Início"
                            type="date"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={muiDark}
                            {...register("startDate")}
                        />
                        <TextField
                            label="Fim"
                            type="date"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={muiDark}
                            {...register("endDate")}
                        />
                    </div>

                    {/* Prioridade + Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth size="small" sx={muiDark}>
                                    <InputLabel>Prioridade</InputLabel>
                                    <Select {...field} label="Prioridade" MenuProps={menuPaper}>
                                        {Object.entries(PRIORITY_MAP).map(([key, val]) => (
                                            <MenuItem key={key} value={key}>
                                                <span
                                                    style={{
                                                        color: val.color,
                                                        fontWeight: 600,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {val.label}
                                                </span>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth size="small" sx={muiDark}>
                                    <InputLabel>Status</InputLabel>
                                    <Select {...field} label="Status" MenuProps={menuPaper}>
                                        {Object.entries(STATUS_MAP).map(([key, val]) => (
                                            <MenuItem key={key} value={key}>
                                                <span style={{ color: val.color, fontWeight: 600, fontSize: 13 }}>
                                                    {val.label}
                                                </span>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </div>

                    {/* Solução */}
                    <TextField
                        label="Solução"
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        sx={muiDark}
                        {...register("solution")}
                        placeholder="Descreva como a tarefa foi ou será resolvida..."
                    />

                    {/* Checklist */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                            <MdOutlineChecklist className="text-brand-500 text-base" />
                            <span className="text-[12px] font-bold uppercase tracking-widest text-text-secondary">
                                Checklist
                            </span>
                            <span className="text-[10px] text-text-muted ml-auto">
                                {checklistItems.filter((i) => i.done).length}/{checklistItems.length}
                            </span>
                        </div>

                        {/* Items existentes */}
                        <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
                            {checklistItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 bg-bg-surface rounded-lg px-3 py-1.5 group"
                                >
                                    <Checkbox
                                        checked={item.done}
                                        onChange={() => toggleChecklistItem(item.id)}
                                        size="small"
                                        sx={{
                                            p: 0,
                                            color: "var(--color-text-muted)",
                                            "&.Mui-checked": { color: "var(--color-brand-500)" },
                                        }}
                                    />
                                    <span
                                        className={`text-[12px] flex-1 ${
                                            item.done
                                                ? "line-through text-text-muted"
                                                : "text-text-primary"
                                        }`}
                                    >
                                        {item.text}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeChecklistItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-error hover:text-error/80 transition-all cursor-pointer"
                                    >
                                        <MdDelete size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Adicionar item */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addChecklistItem();
                                    }
                                }}
                                placeholder="Adicionar item ao checklist..."
                                className="flex-1 bg-bg-surface border border-border-main2 rounded-lg px-3 py-1.5 text-[12px] text-text-primary placeholder:text-text-muted outline-none focus:border-brand-500/50 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={addChecklistItem}
                                className="w-8 h-8 flex items-center justify-center bg-brand-500/15 hover:bg-brand-500/25 text-brand-500 rounded-lg transition-colors cursor-pointer"
                            >
                                <MdAdd size={16} />
                            </button>
                        </div>
                    </div>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-surface border border-border-main2 transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 rounded-xl text-[13px] font-bold bg-brand-500 hover:bg-brand-600 text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <CircularProgress size={13} sx={{ color: "white" }} />}
                        {isEdit ? "Salvar alterações" : "Criar tarefa"}
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default memo(TaskForm)