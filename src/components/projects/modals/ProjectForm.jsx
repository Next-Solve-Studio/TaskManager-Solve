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
import { memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    MdClose,
    MdCode,
    MdComputer,
    MdOutlineRocketLaunch,
} from "react-icons/md";
import { RiGitBranchLine } from "react-icons/ri";
import { projectSchema } from "@/components/projects/schema/ProjectsConfig";
import { Avatar } from "@/components/ui/AvatarBadge";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/StatusBadge";
import { menuPaper, muiDark } from "@/styles/StyleInputs";
import { formatDateInput } from "@/utils/FormatDateProjects";

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
                    startDate: formatDateInput(project.startDate),
                    expectedDeliveryDate: formatDateInput(
                        project.expectedDeliveryDate,
                    ),
                    deliveryDate: formatDateInput(project.deliveryDate),
                    techStack: Array.isArray(project.techStack)
                        ? project.techStack.join(", ")
                        : project.techStack || "",
                    repositoryUrl: project.repositoryUrl || "",
                    hosting: project.hosting || "",
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
        // função para enviar dados, e ja recebe eles validados pelo react hook form
        onSubmit({
            ...data,
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
            PaperProps={{
                sx: {
                    background: "var(--color-bg-card)",
                    backgroundImage: "none",
                    border: "1px solid var(--color-border-main)",
                    borderRadius: "16px",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
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
                    {/* Title + Client */}
                    <div className="grid grid-cols-2 gap-3">
                        <TextField
                            label="Título *"
                            {...register("title")}
                            error={Boolean(errors.title)}
                            helperText={errors.title?.message}
                            fullWidth
                            size="small"
                            sx={muiDark}
                        />

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
                    </div>

                    {/* Description */}
                    <TextField
                        label="Descrição"
                        {...register("description")}
                        multiline
                        rows={3}
                        fullWidth
                        size="small"
                        sx={muiDark}
                    />

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

                    {/* StartDate + DeliveryDate */}
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

                    {/* TechStack + Hosting */}
                    <div className="grid gap-3 grid-cols-2">
                        <TextField
                            label="Tech Stack (separado por vírgula)"
                            {...register("techStack")}
                            fullWidth
                            size="small"
                            sx={muiDark}
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
                        <TextField
                            label="Hosting"
                            {...register("hosting")}
                            fullWidth
                            size="small"
                            sx={muiDark}
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
                    </div>

                    {/* Repository URL */}
                    <TextField
                        label="URL do Repositório"
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
