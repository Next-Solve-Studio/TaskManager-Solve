"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
} from "@mui/material";
import { MdClose, MdDelete, MdAdd } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCustomFields } from "@/context/CustomFieldsContext";
import { menuPaper, muiDark } from "@/styles/StyleInputs";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const schema = yup.object().shape({
    name: yup.string().required("O nome do campo é obrigatório"),
    type: yup.string().required("O tipo do campo é obrigatório"),
});

const FIELD_TYPES = [
    { value: "text", label: "Texto Simples" },
    { value: "textarea", label: "Texto Longo" },
    { value: "number", label: "Número" },
    { value: "date", label: "Data" },
    { value: "boolean", label: "Caixa de Seleção (Sim/Não)" },
];

export default function CustomFieldFormModal({ open, onClose, entity, entityLabel }) {
    const { clientFields, projectFields, taskFields, userFields, saveCustomFields, loading } = useCustomFields();

    const getEntityFields = () => {
        if (entity === "client") return clientFields;
        if (entity === "project") return projectFields;
        if (entity === "task") return taskFields;
        if (entity === "user") return userFields;
        return [];
    };

    const currentFields = getEntityFields();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            type: "text",
        },
    });

    const onSubmit = async (data) => {
        const newField = {
            id: uuidv4(),
            name: data.name,
            type: data.type,
            createdAt: new Date().toISOString(),
        };

        const updatedFields = [...currentFields, newField];
        try {
            await saveCustomFields(entity, updatedFields);
            reset();
        } catch (error) {
            console.error("Erro ao adicionar campo", error);
        }
    };

    const handleDelete = async (fieldId) => {
        const updatedFields = currentFields.filter((f) => f.id !== fieldId);
        try {
            await saveCustomFields(entity, updatedFields);
        } catch (error) {
            console.error("Erro ao excluir campo", error);
        }
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
                    border: "1px solid var(--color-border-main)",
                    borderRadius: "16px",
                    color: "var(--color-text-primary)",
                },
            }}
        >
            <DialogTitle className="flex items-center justify-between border-b border-border-main p-4">
                <span className="font-bold">
                    Campos Personalizados - {entityLabel}
                </span>
                <IconButton onClick={onClose} sx={{ color: "var(--color-text-muted)" }}>
                    <MdClose />
                </IconButton>
            </DialogTitle>

            <DialogContent className="p-4 flex flex-col gap-6 mt-3">
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-start pt-2 gap-4">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nome do Campo"
                                size="small"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={muiDark}
                            />
                        )}
                    />

                    <FormControl size="small" fullWidth sx={muiDark} error={!!errors.type}>
                        <InputLabel>Tipo</InputLabel>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    {...field} 
                                    label="Tipo"
                                    MenuProps={{ PaperProps: { sx: menuPaper } }}
                                >
                                    {FIELD_TYPES.map((t) => (
                                        <MenuItem key={t.value} value={t.value}>
                                            {t.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            background: "var(--color-brand-500)",
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": { background: "var(--color-brand-600)", boxShadow: "none" },
                            height: "40px",
                            minWidth: "120px"
                        }}
                    >
                        <MdAdd size={20} className="mr-1" /> Adicionar
                    </Button>
                </form>

                <div className="flex flex-col gap-2 mt-4">
                    <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-2">
                        Campos Atuais ({currentFields.length})
                    </p>
                    {currentFields.length === 0 ? (
                        <p className="text-text-secondary text-sm">Nenhum campo personalizado cadastrado.</p>
                    ) : (
                        currentFields.map((field) => (
                            <div key={field.id} className="flex items-center justify-between bg-bg-surface p-3 rounded-lg border border-border-main">
                                <div className="flex flex-col">
                                    <span className="font-bold text-text-primary text-sm">{field.name}</span>
                                    <span className="text-text-muted text-[11px] capitalize">
                                        {FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {field.createdAt && (
                                        <span className="text-text-muted text-[10px]">
                                            {format(new Date(field.createdAt), "dd/MM/yyyy")}
                                        </span>
                                    )}
                                    <IconButton
                                        onClick={() => handleDelete(field.id)}
                                        size="small"
                                        sx={{ color: "var(--color-error)" }}
                                        title="Excluir Campo"
                                    >
                                        <MdDelete size={18} />
                                    </IconButton>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
