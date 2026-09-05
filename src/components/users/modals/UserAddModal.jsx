"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    MenuItem,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { IoMdLock } from "react-icons/io";
import { MdAdd, MdClose, MdOutlineEmail, MdPerson } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, ROLES } from "@/lib/roles";
import { menuPaper, muiDark } from "@/styles/StyleInputs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCustomFields } from "@/context/CustomFieldsContext";

const schema = yup.object({
    mode: yup.string().oneOf(["invite", "direct"]).required(),
    name: yup.string().min(3, "Mínimo 3 caracteres").required("Obrigatório"),
    email: yup.string().email("E-mail inválido").required("Obrigatório"),
    password: yup.string().when("mode", {
        is: "direct",
        then: (s) => s.min(6, "Mínimo 6 caracteres").required("Obrigatório"),
        otherwise: (s) => s.notRequired(),
    }),
    role: yup.string().required("Obrigatório"),
}).required();

export default function UserAddModal({ open, onClose }) {
    const { currentUser, registerEmployee, inviteEmployee } = useAuth();
    const { userFields } = useCustomFields();
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            mode: "invite",
            name: "",
            email: "",
            password: "",
            role: ROLES.DEVELOPER,
            customData: {},
        },
    });

    const mode = watch("mode");

    const handleClose = () => {
        if (!loading) {
            reset();
            onClose();
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (data.mode === "direct") {
                await registerEmployee(
                    data.name,
                    data.email,
                    data.password,
                    currentUser.companyId,
                    data.role,
                    data.customData,
                );
                toast.success("Usuário cadastrado com sucesso!");
            } else {
                await inviteEmployee(
                    data.name,
                    data.email,
                    currentUser.companyId,
                    data.role,
                    data.customData,
                );
                toast.success("Convite enviado! A pessoa recebe um e-mail para criar a própria senha.");
            }
            reset();
            onClose();
        } catch (err) {
            toast.error(err.message || "Erro ao cadastrar usuário");
            console.error("Erro ao cadastrar usuário:", err);
        } finally {
            setLoading(false);
        }
    };

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
                            background: "rgba(26, 215, 111, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MdAdd className="text-brand-500 text-[18px]" />
                    </div>
                    <span className="text-text-primary font-bold text-base">
                        Novo Usuário
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

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="flex flex-col gap-4 py-5 px-6">
                    <div className="flex bg-bg-surface border border-border-main rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setValue("mode", "invite")}
                            className={`flex-1 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                                mode === "invite" ? "bg-bg-card text-brand-500" : "text-text-muted hover:text-text-primary"
                            }`}
                        >
                            Convite por e-mail
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue("mode", "direct")}
                            className={`flex-1 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                                mode === "direct" ? "bg-bg-card text-brand-500" : "text-text-muted hover:text-text-primary"
                            }`}
                        >
                            Criar com senha agora
                        </button>
                    </div>

                    <TextField
                        {...register("name")}
                        fullWidth
                        label="Nome"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={muiDark}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MdPerson className="text-brand-500" size={18} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        {...register("email")}
                        fullWidth
                        label="E-mail"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={muiDark}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MdOutlineEmail className="text-brand-500" size={18} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {mode === "direct" && (
                        <div className="flex w-full relative items-center">
                            <TextField
                                {...register("password")}
                                fullWidth
                                label="Senha"
                                type={seePassword ? "text" : "password"}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={muiDark}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IoMdLock className="text-brand-500" size={18} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <button
                                type="button"
                                className="absolute right-3 text-text-muted hover:text-brand-500"
                                onClick={() => setSeePassword(!seePassword)}
                            >
                                {seePassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    )}

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                label="Cargo"
                                error={!!errors.role}
                                helperText={errors.role?.message}
                                sx={muiDark}
                                SelectProps={{ MenuProps: menuPaper }}
                            >
                                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                    <MenuItem
                                        key={value}
                                        value={value}
                                        sx={{ fontSize: 13, color: "var(--color-text-primary)" }}
                                    >
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {userFields.length > 0 && (
                        <>
                            <div className="w-full h-px bg-border-main my-2" />
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 px-1">Campos Personalizados</p>
                            {userFields.map(field => (
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
                        type="submit"
                        disabled={loading}
                        style={{
                            background: loading
                                ? "rgba(26,215,111,0.2)"
                                : "linear-gradient(135deg, var(--color-brand-400), var(--color-brand-500))",
                            border: "none",
                            borderRadius: 8,
                            color: loading ? "#6b7280" : "#000",
                            padding: "8px 24px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: 13,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: loading
                                ? "none"
                                : "0 4px 14px rgba(26,215,111,0.3)",
                            transition: "all 0.2s",
                        }}
                    >
                        {loading && (
                            <CircularProgress size={13} style={{ color: "#000" }} />
                        )}
                        {mode === "direct" ? "Cadastrar Usuário" : "Enviar Convite"}
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    );
}