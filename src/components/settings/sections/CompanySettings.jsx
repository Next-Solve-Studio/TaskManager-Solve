"use client";

import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { toast } from "sonner";
import { useCompany } from "@/context/CompanyContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";

export default function CompanySettings() {
    const { company, updateCompany } = useCompany();
    const isMobile = useIsMobile();
    
    const [formData, setFormData] = useState({
        name: "",
        cnpj: "",
        endereco: "",
    });
    const [baseData, setBaseData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (company) {
            const initialData = {
                name: company.name || "",
                cnpj: company.cnpj || "",
                endereco: company.endereco || "",
            };
            setFormData(initialData);
            setBaseData(initialData);
        }
    }, [company]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isDirty = JSON.stringify(formData) !== JSON.stringify(baseData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateCompany(formData);
            setBaseData(formData);
            toast.success("Dados da empresa atualizados com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar empresa: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldSx = {
        "& .MuiOutlinedInput-root": {
            color: "var(--color-text-primary)",
            backgroundColor: "var(--color-border-subtle)",
            borderRadius: "12px",
            "& fieldset": { borderColor: "var(--color-border-main)" },
            "&:hover fieldset": { borderColor: "rgba(var(--color-brand-500-rgb), 0.3)" },
            "&.Mui-focused fieldset": { borderColor: "var(--color-brand-500)" },
        },
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-text-primary font-bold text-lg">Dados da Empresa</h3>
                <p className="text-text-secondary text-xs">
                    Atualize as informações fiscais e de identificação da sua empresa.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Nome da Empresa</label>
                    <TextField fullWidth name="name" value={formData.name} onChange={handleChange} variant="outlined" sx={fieldSx} required />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">CNPJ</label>
                    <TextField fullWidth name="cnpj" value={formData.cnpj} onChange={handleChange} variant="outlined" placeholder="00.000.000/0000-00" sx={fieldSx} />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Endereço</label>
                    <TextField fullWidth name="endereco" value={formData.endereco} onChange={handleChange} variant="outlined" placeholder="Rua, Número, Cidade - UF" sx={fieldSx} />
                </div>
            </div>

            <div className="pt-4 border-t border-border-main">
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isDirty}
                    startIcon={<MdEdit className="text-white" />}
                    className={`${isMobile ? "w-full" : ""} shadow-lg shadow-brand-500/20`}
                    sx={{
                        backgroundColor: "var(--color-brand-500)",
                        "&:hover": { backgroundColor: "var(--color-brand-600)" },
                        "&.Mui-disabled": { backgroundColor: "var(--color-border-subtle)", color: "var(--color-text-muted)" },
                        textTransform: "none", borderRadius: "10px", color: "white", fontWeight: 700, px: 3, py: 1
                    }}
                >
                    {isSubmitting ? "Salvando..." : "Salvar Empresa"}
                </Button>
            </div>
        </Box>
    );
}