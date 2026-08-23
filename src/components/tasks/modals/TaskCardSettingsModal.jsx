"use client";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Switch,
} from "@mui/material";
import { MdClose, MdVisibility } from "react-icons/md";

export default function TaskCardSettingsModal({
    open,
    onClose,
    settings,
    updateSystemSettings,
}) {
    const handleToggle = (key) => (e) => {
        const nextSettings = { ...settings, [key]: e.target.checked };
        updateSystemSettings({ taskCardSettings: nextSettings });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        background: "var(--color-bg-card)",
                        border: "1px solid var(--color-border-main2)",
                        borderRadius: "18px",
                        backgroundImage: "none",
                        color: "var(--color-text-primary)",
                    },
                },
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 3 }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
                            <MdVisibility className="text-brand-500 text-base" />
                        </div>
                        <div>
                            <p className="text-[16px] font-extrabold text-text-primary m-0 leading-tight">
                                Visualização da Tarefa
                            </p>
                            <p className="text-[11px] font-bold text-text-muted m-0">
                                Escolha o que exibir nos cards
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

            <DialogContent
                sx={{
                    pt: 2,
                    pb: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                <div className="flex items-center justify-between bg-bg-surface px-4 py-2 rounded-xl border border-border-main2">
                    <span className="text-[13px] font-semibold text-text-secondary">Descrição</span>
                    <Switch
                        size="small"
                        checked={settings.showDescription}
                        onChange={handleToggle("showDescription")}
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-brand-500)" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--color-brand-500)" } }}
                    />
                </div>
                <div className="flex items-center justify-between bg-bg-surface px-4 py-2 rounded-xl border border-border-main2">
                    <span className="text-[13px] font-semibold text-text-secondary">Checklist</span>
                    <Switch
                        size="small"
                        checked={settings.showChecklist}
                        onChange={handleToggle("showChecklist")}
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-brand-500)" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--color-brand-500)" } }}
                    />
                </div>
                <div className="flex items-center justify-between bg-bg-surface px-4 py-2 rounded-xl border border-border-main2">
                    <span className="text-[13px] font-semibold text-text-secondary">Responsáveis</span>
                    <Switch
                        size="small"
                        checked={settings.showAssignees}
                        onChange={handleToggle("showAssignees")}
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-brand-500)" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--color-brand-500)" } }}
                    />
                </div>
                <div className="flex items-center justify-between bg-bg-surface px-4 py-2 rounded-xl border border-border-main2">
                    <span className="text-[13px] font-semibold text-text-secondary">Datas</span>
                    <Switch
                        size="small"
                        checked={settings.showDates}
                        onChange={handleToggle("showDates")}
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-brand-500)" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--color-brand-500)" } }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
