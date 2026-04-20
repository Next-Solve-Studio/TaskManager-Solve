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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    MdClose,
    MdCode,
    MdComputer,
    MdOutlineRocketLaunch,
    MdPerson,
} from "react-icons/md";
import { RiGitBranchLine } from "react-icons/ri";
import { projectSchema } from "@/components/projects/ProjectsConfig";
import { Avatar } from "@/components/ui/AvatarBadge";
import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/StatusBadge";
import { formatDateInput } from "@/utils/FormatDateProjects";
import { muiDark } from "@/utils/StyleInputs";

const menuPaper = {
    PaperProps: {
        style: {
            background: "#171C23",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
        },
    },
};

export default function ProjectForm({
    open,
    onClose,
    project,
    users,
    onSubmit,
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
                style: {
                    background: "#171C23",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
                },
            }}
        >
            <DialogTitle
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(25,202,104,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MdOutlineRocketLaunch
                            style={{ color: "#19CA68", fontSize: 18 }}
                        />
                    </div>
                    <span
                        style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}
                    >
                        {isEdit ? "Editar Projeto" : "Novo Projeto"}
                    </span>
                </div>
                <button
                    onClick={handleClose}
                    disabled={loading}
                    type="button"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6b7280",
                        padding: 4,
                        borderRadius: 6,
                        display: "flex",
                    }}
                >
                    <MdClose size={20} />
                </button>
            </DialogTitle>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent
                    style={{
                        padding: "20px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    {/* Title + Client */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}
                    >
                        <TextField
                            label="Título *"
                            {...register("title")}
                            error={Boolean(errors.title)}
                            helperText={errors.title?.message}
                            fullWidth
                            size="small"
                            sx={muiDark}
                        />
                        <TextField
                            label="Cliente"
                            {...register("client")}
                            fullWidth
                            size="small"
                            sx={muiDark}
                            InputProps={{
                                startAdornment: (
                                    <MdPerson
                                        size={15}
                                        style={{
                                            color: "#6b7280",
                                            marginRight: 6,
                                        }}
                                    />
                                ),
                            }}
                        />
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
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}
                    >
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
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 4,
                                            }}
                                        >
                                            {selected.map((uid) => {
                                                const u = users.find(
                                                    (x) => x.id === uid,
                                                );
                                                return (
                                                    <Chip
                                                        key={uid}
                                                        label={u?.name || uid}
                                                        size="small"
                                                        style={{
                                                            background:
                                                                "rgba(25,202,104,0.15)",
                                                            color: "#19CA68",
                                                            fontSize: 11,
                                                            height: 22,
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
                                                    color: "#6b7280",
                                                    "&.Mui-checked": {
                                                        color: "#19CA68",
                                                    },
                                                    padding: "0 8px 0 0",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                }}
                                            >
                                                <Avatar
                                                    name={u.name}
                                                    uid={u.id}
                                                    size={22}
                                                    src={u.photo}
                                                />
                                                <span
                                                    style={{ color: "#e5e7eb" }}
                                                >
                                                    {u.name}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: "#6b7280",
                                                    }}
                                                >
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
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}
                    >
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
                                {...register("deliveryDate")}
                                disabled
                            />
                        )}
                    </div>

                    {/* TechStack + Hosting */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}
                    >
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
                                        style={{
                                            color: "#6b7280",
                                            marginRight: 6,
                                        }}
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
                                        style={{
                                            color: "#6b7280",
                                            marginRight: 6,
                                        }}
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
                                    style={{ color: "#6b7280", marginRight: 6 }}
                                />
                            ),
                        }}
                    />
                </DialogContent>

                <DialogActions
                    style={{
                        padding: "12px 24px 20px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        gap: 8,
                    }}
                >
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            color: "#9ca3af",
                            padding: "8px 20px",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: loading
                                ? "rgba(25,202,104,0.4)"
                                : "linear-gradient(135deg, #19CA68, #1AD76F)",
                            border: "none",
                            borderRadius: 8,
                            color: "#000",
                            padding: "8px 24px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: 13,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: loading
                                ? "none"
                                : "0 4px 14px rgba(25,202,104,0.35)",
                        }}
                    >
                        {loading && (
                            <CircularProgress
                                size={14}
                                style={{ color: "#000" }}
                            />
                        )}
                        {isEdit ? "Salvar Alterações" : "Criar Projeto"}
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
