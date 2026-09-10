"use client";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { AiOutlineUser } from "react-icons/ai";
import { FaBuilding, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { muiDark } from "@/styles/StyleInputs";
import { FormatDocument } from "@/utils/FormatCnpj/CPF";

export default function Form({
    onSubmit,
    register,
    errors,
    documentValue,
    setValue,
    loading,
    seePassword,
    setSeePassword,
    isFreePlan,
}) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <TextField
                {...register("companyName")}
                label="Nome da Empresa"
                variant="outlined"
                error={!!errors.companyName}
                helperText={errors.companyName?.message}
                sx={muiDark}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaBuilding color="var(--color-brand-500)" size={19} />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                {...register("name")}
                label="Seu Nome (Administrador)"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={muiDark}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <AiOutlineUser color="var(--color-brand-500)" size={19} />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                {...register("email")}
                label="E-mail Corporativo"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={muiDark}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdOutlineEmail color="var(--color-brand-500)" size={19} />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <div className="relative flex items-center">
                <TextField
                    {...register("password")}
                    label="Senha"
                    variant="outlined"
                    type={seePassword ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={muiDark}
                    className="w-full"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IoMdLock color="var(--color-brand-500)" size={19} />
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
            <TextField
                {...register("cnpj")}
                label="CPF/CNPJ"
                variant="outlined"
                error={!!errors.cnpj}
                value={FormatDocument(documentValue)}
                onChange={(e) => {
                    setValue("cnpj", FormatDocument(e.target.value), { shouldValidate: true });
                }}
                helperText={errors.cnpj?.message ?? "Obrigatório — verificação de uso do plano gratuito"}
                sx={muiDark}
            />
            <TextField {...register("endereco")} label="Endereço (Opcional)" variant="outlined" sx={muiDark} />

            <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r from-brand-600 to-brand-500 shadow-[0_4px_24px_rgba(26,215,111,0.35)] disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
                {loading ? <CircularProgress size={22} color="inherit" /> : isFreePlan ? "Cadastrar Empresa" : "Continuar para Pagamento"}
            </button>
        </form>
    );
}