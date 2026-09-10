"use client";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/AvatarBadge";
import { FormatDocument } from "@/utils/FormatCnpj/CPF";
import { userDetailsSchema } from "@/utils/userDetailsSchema";
import { useUsers } from "@/context/UsersContext";
import { useCustomFields } from "@/context/CustomFieldsContext";
import { ROLE_LABELS, ROLES_STYLES } from "@/lib/roles";
import { menuPaper, muiDark2 } from "@/styles/StyleInputs";

export default function UserEditModal({ open, onClose, user }) {
    const { updateUser } = useUsers();
    const { userFields } = useCustomFields();
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [cpf, setCpf] = useState("");
    const [endereco, setEndereco] = useState("");
    const [customData, setCustomData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open && user) {
            setSelectedRole(user.role || "");
            setCpf(user.cpf || "");
            setEndereco(user.endereco || "");
            setCustomData(user.customData || {});
            setErrors({});
        }
    }, [open, user]);

    const handleClose = () => {
        if (!loading) onClose();
    };

    const handleSave = async () => {
        if (!user || !changed) {
            onClose();
            return;
        }
        setLoading(true);
        try {
            const details = await userDetailsSchema.validate(
                { cpf, endereco, customData },
                { abortEarly: false },
            );
            await updateUser(user.id, selectedRole, details, user.name);
            toast.success(`Usuário ${user.name} atualizado!`);
            onClose();
        } catch (err) {
            if (err.name === "ValidationError") {
                setErrors(
                    Object.fromEntries(
                        err.inner.map((error) => [error.path, error.message]),
                    ),
                );
            } else {
                console.error(err);
                toast.error(err.message || "Erro ao atualizar usuário");
            }
        } finally {
            setLoading(false);
        }
    };

    const meta = ROLES_STYLES[selectedRole];
    const changed =
        selectedRole !== user?.role ||
        cpf !== (user?.cpf || "") ||
        endereco !== (user?.endereco || "") ||
        JSON.stringify(customData) !== JSON.stringify(user?.customData || {});

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
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
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px 12px",
                    borderBottom: "1px solid var(--color-border-main)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(34,211,238,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MdEdit className="text-brand-500 text-[17px]" />
                    </div>
                    <span className="text-text-primary font-bold text-base">
                        Editar Usuário
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                        borderRadius: 6,
                        display: "flex",
                    }}
                >
                    <MdClose size={20} />
                </button>
            </DialogTitle>

            <DialogContent className="flex flex-col gap-4 py-5 px-6">
                {user && (
                    <div className="flex items-center mt-4 gap-3 p-3 rounded-md bg-bg-surface border border-border-main">
                        <Avatar
                            name={user.name}
                            uid={user.id}
                            size={40}
                            src={user.photo}
                        />
                        <div style={{ minWidth: 0 }}>
                            <p className="text-text-primary font-bold text-sm m-0 mb-0.5">
                                {user.name}
                            </p>
                            <p className="text-text-secondary text-xs m-0 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}

                <TextField
                    label="CPF (Opcional)"
                    value={FormatDocument(cpf)}
                    onChange={(e) => {
                        setCpf(e.target.value.replace(/\D/g, "").slice(0, 11));
                    }}
                    error={!!errors.cpf}
                    helperText={errors.cpf}
                    size="small"
                    fullWidth
                    sx={muiDark2}
                />
                <TextField
                    label="Endereço (Opcional)"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    error={!!errors.endereco}
                    helperText={errors.endereco}
                    size="small"
                    fullWidth
                    sx={muiDark2}
                />

                <FormControl size="small" fullWidth sx={muiDark2}>
                    <InputLabel>Cargo</InputLabel>
                    <Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        label="Cargo"
                        MenuProps={menuPaper}
                    >
                        {Object.entries(ROLE_LABELS).map(([value, label]) => {
                            const m = ROLES_STYLES[value];
                            const Icon = m?.icon;
                            return (
                                <MenuItem
                                    key={value}
                                    value={value}
                                    sx={{
                                        fontSize: 13,
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        {Icon && (
                                            <Icon className={`${m.color} text-[15px]`} />
                                        )}
                                        <span>{label}</span>
                                    </div>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {meta && (
                    <div
                        className={`${meta.bg} ${meta.border} rounded-md border flex items-start gap-2.5 py-2.5 px-3.5`}
                    >
                        <meta.icon className={`${meta.color} mt-px text-base shrink-0`} />
                        <p className={`${meta.color} m-0 opacity-[0.9] text-[12px] leading-normal`}>
                            {meta.description}
                        </p>
                    </div>
                )}

                {userFields?.length > 0 && (
                    <>
                        <div className="w-full h-px bg-border-main my-1" />
                        <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 px-1">
                            Campos Personalizados
                        </p>
                        {userFields.map((field) => (
                            <TextField
                                key={field.id}
                                label={field.name}
                                value={customData[field.id] || ""}
                                onChange={(e) =>
                                    setCustomData((prev) => ({
                                        ...prev,
                                        [field.id]: e.target.value,
                                    }))
                                }
                                type={
                                    field.type === "number"
                                        ? "number"
                                        : field.type === "date"
                                        ? "date"
                                        : "text"
                                }
                                multiline={field.type === "textarea"}
                                rows={field.type === "textarea" ? 3 : 1}
                                select={field.type === "boolean"}
                                InputLabelProps={
                                    field.type === "date" ? { shrink: true } : undefined
                                }
                                size="small"
                                fullWidth
                                sx={muiDark2}
                                SelectProps={
                                    field.type === "boolean"
                                        ? { MenuProps: menuPaper }
                                        : undefined
                                }
                            >
                                {field.type === "boolean" && [
                                    <MenuItem key="sim" value="Sim" style={{ fontSize: 13 }}>
                                        Sim
                                    </MenuItem>,
                                    <MenuItem key="nao" value="Não" style={{ fontSize: 13 }}>
                                        Não
                                    </MenuItem>,
                                ]}
                            </TextField>
                        ))}
                    </>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    padding: "8px 24px 20px",
                    gap: 1,
                    borderTop: "1px solid var(--color-border-main)",
                }}
            >
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
                    type="button"
                    onClick={handleSave}
                    disabled={loading || !changed}
                    style={{
                        background:
                            changed && !loading
                                ? "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600))"
                                : "var(--color-brand-500)",
                        border: "none",
                        borderRadius: 8,
                        color: changed ? "#000" : "#6b7280",
                        padding: "8px 24px",
                        cursor: loading || !changed ? "not-allowed" : "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow:
                            changed && !loading
                                ? "0 4px 14px var(--color-surface-green-alt)"
                                : "none",
                        transition: "all 0.2s",
                    }}
                >
                    {loading && (
                        <CircularProgress size={13} style={{ color: "#fff" }} />
                    )}
                    Salvar Alterações
                </button>
            </DialogActions>
        </Dialog>
    );
}