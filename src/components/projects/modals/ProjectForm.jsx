"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    MdAttachMoney,
    MdClose,
    MdCode,
    MdComputer,
    MdOutlineRocketLaunch,
    MdAttachFile,
    MdDownload,
    MdDelete,
    MdPictureAsPdf,
    MdTableChart,
    MdDescription, MdTextSnippet, MdUpload
} from "react-icons/md"; 
import { useProjectAttachments } from "@/hooks/useProjectAttachments";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/roles";
import { RiGitBranchLine } from "react-icons/ri";
import CanDo from "@/components/auth/CanDo";
import { projectSchema } from "@/components/projects/schema/ProjectsConfig";
import { Avatar } from "@/components/ui/AvatarBadge";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/badges/StatusBadge";
import { menuPaper, muiDark } from "@/styles/StyleInputs";
import { formatDateInput } from "@/utils/FormatDateProjects";
import { useSettings } from "@/context/SettingsContext";
import { useCustomFields } from "@/context/CustomFieldsContext";

export function ProjectForm({
    open,
    onClose,
    project,
    users,
    clients,
    onSubmit,
    usersMap,
    loading,
}) {
    const isEdit = Boolean(project);
    const { systemSettings } = useSettings();
    const settings = systemSettings?.projectCardSettings || {};
    const { projectFields } = useCustomFields();
    const { currentUser } = useAuth();
    const fileInputRef = useRef(null);
    const { attachments, uploading, error: attError, upload, download, remove, setError: setAttError } =
    
    useProjectAttachments(isEdit ? project?.id : null, isEdit ? project?.companyId : null);

    function AttachFileIcon({ type }) {
        if (type === "application/pdf") return <MdPictureAsPdf size={18} className="text-red-400 shrink-0" />;
        if (type?.includes("word") || type?.includes("rtf")) return <MdDescription size={18} className="text-blue-400 shrink-0" />;
        if (type?.includes("excel") || type?.includes("spreadsheet") || type === "text/csv") return <MdTableChart size={18} className="text-green-400 shrink-0" />;
        return <MdTextSnippet size={18} className="text-text-muted shrink-0" />;
    }

    const formatSize = (b) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;
    const canDeleteAtt = (att) => att.uploadedBy === currentUser?.uid || currentUser?.role === ROLES.ADMIN;

    const defaultValues = {
        title: "",
        description: "",
        client: "",
        status: "em_andamento",
        priority: "media",
        developers: [],
        startDate: "",
        deliveryDate: "",
        techStack: "",
        repositoryUrl: "",
        hosting: "",
        expectedDeliveryDate: "",
        totalValue: 0,
        paidValue: 0,
        customData: {},
    };

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        //cria o gerenciador do formulário
        resolver: yupResolver(projectSchema), // Agora o formulário sabe as regras de cada campo feitos  no projectSchema
        defaultValues,
    });

    useEffect(() => {
        if (open) {
            if (project) {
                // se o projeto existe, então é edição
                reset({
                    title: project.title || "",
                    description: project.description || "",
                    client: project.client || "",
                    status: project.status || "em_andamento",
                    priority: project.priority || "media",
                    developers: project.developers || [],
                    startDate: formatDateInput(project.startDate).dateOrigin,
                    expectedDeliveryDate: formatDateInput(
                        project.expectedDeliveryDate,
                    ).dateOrigin,
                    deliveryDate: formatDateInput(project.deliveryDate)
                        .dateOrigin,
                    techStack: Array.isArray(project.techStack)
                        ? project.techStack.join(", ")
                        : project.techStack || "",
                    repositoryUrl: project.repositoryUrl || "",
                    hosting: project.hosting || "",
                    totalValue: project.totalValue,
                    paidValue: project.paidValue,
                    customData: project.customData || {},
                });
            } else {
                // se não, criação e limpa o form
                reset(defaultValues);
            }
        }
    }, [open, project, reset]);

    const handleClose = () => {
        if (!loading) onClose();
    };

    const handleFormSubmit = (data) => {
        const fixTimezone = (dateString) => {
            if (!dateString) return "";
            // Cria a data adicionando 'T12:00:00' para garantir que,
            // independente do fuso (-3, -4, etc), não mude de dia.
            const d = new Date(`${dateString}T12:00:00`);
            return d.toISOString(); // ou envie como objeto Date, dependendo do seu backend
        };

        // função para enviar dados, e ja recebe eles validados pelo react hook form
        onSubmit({
            ...data,
            startDate: fixTimezone(data.startDate),
            expectedDeliveryDate: fixTimezone(data.expectedDeliveryDate),
            deliveryDate: fixTimezone(data.deliveryDate),
            techStack: data.techStack
                ? data.techStack
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                : [],
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        background: "var(--color-bg-card)",
                        backgroundImage: "none",
                        border: "1px solid var(--color-border-main)",
                        borderRadius: "16px",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                    },
                },
            }}
        >
            <DialogTitle
                className="flex items-center justify-between border-b border-border-main
                pt-5 px-6 pb-3"
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-500/15">
                        <MdOutlineRocketLaunch
                            style={{
                                color: "var(--color-brand-500)",
                                fontSize: 18,
                            }}
                        />
                    </div>
                    <span className="text-text-primary font-bold text-base">
                        {isEdit ? "Editar Projeto" : "Novo Projeto"}
                    </span>
                </div>
                <button
                    onClick={handleClose}
                    disabled={loading}
                    type="button"
                    className="bg-none text-text-muted cursor-pointer rounded-md flex p-1 border-none hover:text-text-primary transition-colors"
                >
                    <MdClose size={20} />
                </button>
            </DialogTitle>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent className="flex flex-col gap-4 py-5 px-6">
                    <div className="grid grid-cols-2 gap-3">
                        <TextField
                            label="Título *"
                            {...register("title")}
                            error={Boolean(errors.title)}
                            helperText={errors.title?.message}
                            fullWidth
                            size="small"
                            sx={muiDark}
                            className={settings?.showClient !== false ? "" : "col-span-2"}
                        />

                        {settings?.showClient !== false && (
                            <FormControl
                                size="small"
                                error={Boolean(errors.client)}
                                sx={muiDark}
                            >
                                <InputLabel>Cliente *</InputLabel>
                                <Controller
                                    name="client"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Cliente *"
                                            MenuProps={menuPaper}
                                        >
                                            {clients.map((c) => (
                                                <MenuItem
                                                    key={c.id}
                                                    value={c.id}
                                                    style={{
                                                        fontSize: 13,
                                                        color: "var(--color-text-primary)",
                                                    }}
                                                >
                                                    {c.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        )}
                    </div>

                    {/* Description */}
                    {settings?.showDescription !== false && (
                        <TextField
                            label="Descrição"
                            {...register("description")}
                            multiline
                            rows={3}
                            fullWidth
                            size="small"
                            sx={muiDark}
                        />
                    )}

                    <CanDo permission="canViewFinancials">
                        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-brand-500/5 border border-brand-500/10">
                            <div className="col-span-2 flex items-center gap-2 mb-1">
                                <MdAttachMoney
                                    className="text-brand-500"
                                    size={18}
                                />
                                <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                                    Informações Financeiras (Apenas ADM)
                                </span>
                            </div>
                            <TextField
                                label="Valor Total (R$)"
                                type="number"
                                {...register("totalValue")}
                                error={Boolean(errors.totalValue)}
                                helperText={errors.totalValue?.message}
                                fullWidth
                                size="small"
                                sx={muiDark}
                            />
                            <TextField
                                label="Valor Pago (R$)"
                                type="number"
                                {...register("paidValue")}
                                error={Boolean(errors.paidValue)}
                                helperText={errors.paidValue?.message}
                                fullWidth
                                size="small"
                                sx={muiDark}
                            />
                        </div>
                    </CanDo>

                    {/* Status + Priority */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormControl
                            size="small"
                            error={Boolean(errors.status)}
                            sx={muiDark}
                        >
                            <InputLabel>Status *</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Status *"
                                        MenuProps={menuPaper}
                                        disabled={!isEdit}
                                    >
                                        {Object.entries(STATUS_MAP).map(
                                            ([val, cfg]) => (
                                                <MenuItem
                                                    key={val}
                                                    value={val}
                                                    style={{
                                                        color: cfg.color,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {cfg.label}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <FormControl
                            size="small"
                            error={Boolean(errors.priority)}
                            sx={muiDark}
                        >
                            <InputLabel>Prioridade *</InputLabel>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Prioridade *"
                                        MenuProps={menuPaper}
                                    >
                                        {Object.entries(PRIORITY_MAP).map(
                                            ([val, cfg]) => (
                                                <MenuItem
                                                    key={val}
                                                    value={val}
                                                    style={{
                                                        color: cfg.color,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {cfg.label}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </div>

                    {settings?.showDevelopers !== false && (
                        <FormControl
                            size="small"
                            error={Boolean(errors.developers)}
                            sx={muiDark}
                            fullWidth
                        >
                            <InputLabel>Desenvolvedores *</InputLabel>
                            <Controller
                                name="developers"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        multiple
                                        label="Desenvolvedores *"
                                        input={
                                            <OutlinedInput label="Desenvolvedores *" />
                                        }
                                        MenuProps={menuPaper}
                                        renderValue={(selected) => (
                                            <div className="flex flex-wrap gap-1">
                                                {selected.map((uid) => {
                                                    const u = usersMap[uid];
                                                    return (
                                                        <Chip
                                                            key={uid}
                                                            label={u?.name || uid}
                                                            size="small"
                                                            sx={{
                                                                background:
                                                                    "rgba(25, 202, 104, 0.15)",
                                                                color: "var(--color-brand-500)",
                                                                fontSize: 11,
                                                                height: 22,
                                                                "& .MuiChip-label":
                                                                    { px: 1 },
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    >
                                        {users.map((u) => (
                                            <MenuItem
                                                key={u.id}
                                                value={u.id}
                                                style={{ fontSize: 13 }}
                                            >
                                                <Checkbox
                                                    checked={field.value?.includes(
                                                        u.id,
                                                    )}
                                                    size="small"
                                                    sx={{
                                                        color: "var(--color-font-gray2)",
                                                        "&.Mui-checked": {
                                                            color: "var(--color-brand-500)",
                                                        },
                                                        padding: "0 8px 0 0",
                                                    }}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Avatar
                                                        name={u.name}
                                                        uid={u.id}
                                                        size={22}
                                                        referrerPolicy="no-referrer"
                                                        src={u.photo}
                                                    />
                                                    <span className="text-secondary">
                                                        {u.name}
                                                    </span>
                                                    <span className="text-text-muted text-[11px]">
                                                        ({u.role || "membro"})
                                                    </span>
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.developers && (
                                <FormHelperText>
                                    {errors.developers.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    )}

                    {/* StartDate + DeliveryDate */}
                    {settings?.showDates !== false && (
                        <div className="grid gap-3 grid-cols-2">
                            <TextField
                                label="Data de Início"
                                type="date"
                                {...register("startDate")}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={muiDark}
                            />
                            <TextField
                                label="Previsão de Entrega"
                                type="date"
                                {...register("expectedDeliveryDate")}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={muiDark}
                            />
                            {project?.status === "concluido" && (
                                <TextField
                                    label="Data de Entrega"
                                    type="date"
                                    sx={muiDark}
                                    {...register("deliveryDate")}
                                />
                            )}
                        </div>
                    )}

                    {/* TechStack + Hosting */}
                    {(settings?.showTechStack !== false || settings?.showRepository !== false) && (
                        <div className="grid gap-3 grid-cols-2">
                            {settings?.showTechStack !== false && (
                                <TextField
                                    label="Tech Stack (separado por vírgula)"
                                    {...register("techStack")}
                                    fullWidth
                                    size="small"
                                    sx={muiDark}
                                    className={settings?.showRepository === false ? "col-span-2" : ""}
                                    placeholder="React, Node.js, Firebase..."
                                    InputProps={{
                                        startAdornment: (
                                            <MdCode
                                                size={15}
                                                className="text-font-gray2 mr-1.5"
                                            />
                                        ),
                                    }}
                                />
                            )}
                            {settings?.showRepository !== false && (
                                <TextField
                                    label="Hosting"
                                    {...register("hosting")}
                                    fullWidth
                                    size="small"
                                    sx={muiDark}
                                    className={settings?.showTechStack === false ? "col-span-2" : ""}
                                    placeholder="Vercel, AWS, Netlify..."
                                    InputProps={{
                                        startAdornment: (
                                            <MdComputer
                                                size={15}
                                                className="text-font-gray2 mr-1.5"
                                            />
                                        ),
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Repository URL */}
                    {settings?.showRepository !== false && (
                        <TextField
                            label="URL do Site"
                            {...register("repositoryUrl")}
                            error={Boolean(errors.repositoryUrl)}
                            helperText={errors.repositoryUrl?.message}
                            fullWidth
                            size="small"
                            sx={muiDark}
                            placeholder="https://github.com/..."
                            InputProps={{
                                startAdornment: (
                                    <RiGitBranchLine
                                        size={15}
                                        className="text-font-gray2 mr-1.5"
                                    />
                                ),
                            }}
                        />
                    )}
                                
                    {projectFields.length > 0 && (
                        <>
                            <div className="w-full h-px bg-border-main my-2" />
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 px-1">Campos Personalizados</p>
                            {projectFields.map(field => (
                                <TextField
                                    key={field.id}
                                    {...register(`customData.${field.id}`)}
                                    label={field.name}
                                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                    multiline={field.type === "textarea"}
                                    rows={field.type === "textarea" ? 3 : 1}
                                    select={field.type === "boolean"}
                                    fullWidth
                                    size="small"
                                    InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                                    sx={muiDark}
                                    defaultValue={project?.customData?.[field.id] || ""}
                                    SelectProps={field.type === "boolean" ? { MenuProps: menuPaper } : undefined}
                                >
                                    {field.type === "boolean" && [
                                        <MenuItem key="sim" value="Sim" style={{ fontSize: 13 }}>Sim</MenuItem>,
                                        <MenuItem key="nao" value="Não" style={{ fontSize: 13 }}>Não</MenuItem>
                                    ]}
                                </TextField>
                            ))}
                        </>
                    )}
                    {isEdit && (
                        <>
                            <div className="w-full h-px bg-border-main my-1" />
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <MdAttachFile className="text-text-muted" size={16} />
                                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                                        Anexos ({attachments.length})
                                    </p>
                                </div>

                                {/* Upload zone */}
                                <div
                                    onClick={() => !uploading && fileInputRef.current?.click()}
                                    className="rounded-xl border-2 border-dashed flex items-center gap-3 px-4 py-3 mb-3 transition-all"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.1)",
                                        background: "rgba(255,255,255,0.02)",
                                        cursor: uploading ? "not-allowed" : "pointer",
                                    }}
                                >
                                    <MdUpload size={20} className="text-text-muted shrink-0" />
                                    <div>
                                        <p className="text-sm text-text-secondary">
                                            {uploading ? "Enviando..." : "Clique para anexar arquivo"}
                                        </p>
                                        <p className="text-xs text-text-muted">PDF, DOC, XLS, PPT, TXT, CSV · máx. 10 MB</p>
                                    </div>
                                    <input ref={fileInputRef} type="file" className="hidden"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.odt,.ods"
                                        multiple
                                        onChange={e => { Array.from(e.target.files).forEach(f => upload(f)); }}
                                    />
                                </div>

                                {attError && (
                                    <p className="text-xs text-red-400 mb-2" onClick={() => setAttError(null)} style={{ cursor: "pointer" }}>
                                        {attError}
                                    </p>
                                )}

                                {/* Lista */}
                                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                                    {attachments.length === 0 ? (
                                        <p className="text-xs text-text-muted text-center py-3">Nenhum arquivo anexado</p>
                                    ) : (
                                        attachments.map(att => (
                                            <div key={att.id} className="flex items-center gap-2 p-2 rounded-lg"
                                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <AttachFileIcon type={att.type} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-text-primary truncate">{att.name}</p>
                                                    <p className="text-[10px] text-text-muted">{formatSize(att.size)} · {att.uploadedByName}</p>
                                                </div>
                                                <div className="flex items-center gap-0.5 shrink-0">
                                                    <button type="button" onClick={() => download(att)}
                                                        className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-brand-500 transition-colors">
                                                        <MdDownload size={15} />
                                                    </button>
                                                    {canDeleteAtt(att) && (
                                                        <button type="button" onClick={() => remove(att)}
                                                            className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-red-400 transition-colors">
                                                            <MdDelete size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>

                <DialogActions className="gap-2 border-t border-border-main py-4 px-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            text-[13px] font-semibold cursor-pointer
                            rounded-lg py-2 px-5 text-text-secondary
                            border border-border-main bg-bg-surface
                            hover:bg-bg-surface/60 duration-200 transition-all
                        "
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`border-none rounded-lg text-black py-2 px-6 text-[13px] font-bold flex items-center gap-1.5 
                            ${
                                loading
                                    ? "bg-brand-500/40 cursor-not-allowed shadow-none"
                                    : "bg-linear-to-br from-brand-500 to-brand-600 cursor-pointer duration-200 transition-all shadow-[0_4px_14px_#A2C2B059] sm:hover:to-brand-700 sm:hover:from-brand-700"
                            }`}
                    >
                        {loading && (
                            <CircularProgress
                                size={14}
                                className="text-black"
                            />
                        )}
                        {isEdit ? "Salvar Alterações" : "Criar Projeto"}
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
export default memo(ProjectForm);
