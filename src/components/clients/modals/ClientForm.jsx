"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
} from "@mui/material";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { MdClose, MdOutlinePeople } from "react-icons/md";
import * as yup from "yup";
import { useClients } from "@/context/ClientsContext";
import { useCustomFields } from "@/context/CustomFieldsContext";
import { menuPaper, muiDark } from "@/styles/StyleInputs";
import { FormatDocument } from "@/utils/FormatCnpj/CPF";
import { FormatPhone } from "@/utils/FormatPhone";

const schema = yup.object().shape({
    name: yup.string().required("O nome é obrigatório"),
    email: yup.string().email("E-mail inválido"),

    contato: yup
        .string()
        .required("O telefone é obrigatório")
        .test("phone-format", "Telefone inválido", (value) => {
            if (!value) return false;
            const numbers = value.replace(/\D/g, ""); // remove tudo que não é número
            return numbers.length === 11; // DDD + 9 dígitos
        }),
    documento: yup
        .string()
        .nullable()
        .test("doc-format", "Documento incompleto/inválido", (value) => {
            if (!value) return true;
            const numbers = value.replace(/\D/g, "");
            return numbers.length === 11 || numbers.length === 14;
        }),
    status: yup
        .string()
        .oneOf(["active", "inactive"])
        .required("O status é obrigatório"),
});

function ClientForm({ isOpen, onClose, client }) {
    const { createClient, updateClient } = useClients();
    const { clientFields } = useCustomFields();
    const isEditing = !!client;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: client?.name || "",
            email: client?.email || "",
            contato: client?.contato || "",
            documento: client?.documento || "",
            status: client?.status || "active",
            customData: client?.customData || {},
        },
    });

    const onSubmit = async (data) => {
        try {
            const cleanData = {
                ...data,
                contato: data.contato.replace(/\D/g, ""),
                documento: data.documento
                    ? data.documento.replace(/\D/g, "")
                    : "",
            };
            if (isEditing) {
                await updateClient(client.id, cleanData);
            } else {
                await createClient(cleanData);
            }
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) onClose();
    };

    const contactValue = watch("contato");
    const documentValue = watch("documento");

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
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
                <div className="flex items-center gap-[10px]">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-500/15">
                        <MdOutlinePeople
                            style={{
                                color: "var(--color-brand-500)",
                                fontSize: 18,
                            }}
                        />
                    </div>
                    <span className="text-text-primary font-bold text-base">
                        {isEditing ? "Editar Cliente" : "Novo Cliente"}
                    </span>
                </div>
                <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    type="button"
                    className="bg-none text-text-muted cursor-pointer rounded-md flex p-1 border-none hover:text-text-primary transition-colors"
                >
                    <MdClose size={20} />
                </button>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="flex flex-col gap-4 py-5 px-6">
                    <TextField
                        {...register("name")}
                        label="Nome do Cliente ou Empresa *"
                        fullWidth
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={muiDark}
                    />

                    <TextField
                        {...register("documento")}
                        label="CPF ou CNPJ (Opcional)"
                        fullWidth
                        size="small"
                        value={FormatDocument(documentValue)}
                        onChange={(e) => {
                            setValue(
                                "documento",
                                FormatDocument(e.target.value),
                                { shouldValidate: true },
                            );
                        }}
                        error={!!errors.documento}
                        helperText={errors.documento?.message}
                        sx={muiDark}
                    />

                    <TextField
                        {...register("email")}
                        label="E-mail de Contato"
                        fullWidth
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={muiDark}
                    />

                    <TextField
                        {...register("contato")}
                        label="Telefone / WhatsApp *"
                        fullWidth
                        size="small"
                        value={FormatPhone(contactValue)}
                        onChange={(e) => {
                            setValue("contato", e.target.value);
                        }}
                        error={!!errors.contato}
                        helperText={errors.contato?.message}
                        sx={muiDark}
                    />

                    <TextField
                        {...register("status")}
                        select
                        label="Status da Parceria *"
                        fullWidth
                        size="small"
                        defaultValue={client?.status || "active"}
                        sx={muiDark}
                        SelectProps={{
                            MenuProps: menuPaper,
                        }}
                    >
                        <MenuItem value="active" style={{ fontSize: 13 }}>
                            Ativo
                        </MenuItem>
                        <MenuItem value="inactive" style={{ fontSize: 13 }}>
                            Inativo
                        </MenuItem>
                    </TextField>

                    {clientFields.length > 0 && (
                        <>
                            <div className="w-full h-px bg-border-main my-2" />
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 px-1">Campos Personalizados</p>
                            {clientFields.map(field => (
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
                                    defaultValue={client?.customData?.[field.id] || ""}
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

                <DialogActions className="gap-2 border-t border-border-main py-4 px-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        className={`border-none rounded-lg text-black py-2 px-6 text-[13px] font-bold flex items-center gap-1.5 
                            ${
                                isSubmitting
                                    ? "bg-brand-500/40 cursor-not-allowed shadow-none"
                                    : "bg-linear-to-br from-brand-500 to-brand-600 cursor-pointer duration-200 transition-all shadow-[0_4px_14px_#A2C2B059] sm:hover:to-brand-700 sm:hover:from-brand-700"
                            }`}
                    >
                        {isSubmitting && (
                            <CircularProgress
                                size={14}
                                className="text-black"
                            />
                        )}
                        {isEditing ? "Salvar Alterações" : "Criar Cliente"}
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default memo(ClientForm);
