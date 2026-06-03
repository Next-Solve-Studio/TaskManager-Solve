"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    MenuItem,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose, IoMdLock } from "react-icons/io";
import { MdOutlineEmail, MdPerson } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { ROLES, ROLE_LABELS } from "@/lib/roles";


const schema = yup.object({
    name: yup.string().min(3, "Mínimo 3 caracteres").required("Obrigatório"),
    email: yup.string().email("E-mail inválido").required("Obrigatório"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Obrigatório"),
    role: yup.string().required("Obrigatório"),
}).required();

export default function UserAddModal({ open, onClose }) {
    const { registerEmployee, currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { role: ROLES.DEVELOPER }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // No Firebase Client SDK, criar user desloga o atual. 
            // Para SaaS, idealmente chamamos a API que criamos.
            // Mas para funcionar no sandbox, vamos simular que o admin cria via API.
            
            // 1. Criar o usuário no Auth (isso é o problema no client-side)
            // Em uma app real, você usaria Firebase Admin SDK no backend.
            // Aqui, vamos tentar usar a API route que criamos.
            
            // Para o Auth, como não temos Admin SDK fácil aqui, 
            // vamos instruir que o Admin deve ser feito via backend.
            
            const response = await fetch("/api/register-employee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    companyId: currentUser.companyId,
                    uid: `temp_${Date.now()}` // Simulação de UID se não tivermos Admin SDK
                }),
            });

            if (response.ok) {
                toast.success("Usuário cadastrado com sucesso!");
                reset();
                onClose();
            } else {
                throw new Error("Erro ao cadastrar");
            }
        } catch (error) {
            toast.error("Erro ao cadastrar usuário");
        } finally {
            setLoading(false);
        }
    };

    const fieldSx = {
        mb: 2,
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "var(--bg-surface)",
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" 
            PaperProps={{ sx: { borderRadius: "20px", bgcolor: "var(--bg-main)", backgroundImage: "none" } }}>
            <DialogTitle sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="text-xl font-bold text-text-primary">Novo Usuário</span>
                <IconButton onClick={onClose} size="small"><IoMdClose /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register("name")}
                        fullWidth
                        label="Nome"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={fieldSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><MdPerson /></InputAdornment> } }}
                    />
                    <TextField
                        {...register("email")}
                        fullWidth
                        label="E-mail"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={fieldSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><MdOutlineEmail /></InputAdornment> } }}
                    />
                    <TextField
                        {...register("password")}
                        fullWidth
                        label="Senha"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={fieldSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><IoMdLock /></InputAdornment> } }}
                    />
                    <TextField
                        {...register("role")}
                        select
                        fullWidth
                        label="Cargo"
                        error={!!errors.role}
                        helperText={errors.role?.message}
                        sx={fieldSx}
                    >
                        {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        ))}
                    </TextField>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 mt-2 rounded-xl font-bold text-white bg-brand-500 shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar Usuário"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
