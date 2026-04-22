"use client";
import { STATUS_MAP, PRIORITY_MAP } from "../ui/StatusBadge";
import * as yup from "yup";

export const projectSchema = yup.object({
    // define um esquema que valida um objeto
    title: yup
        .string()
        .min(3, "Mínimo 3 caracteres")
        .required("Título obrigatório"),
    description: yup.string().optional(),
    client: yup.string().optional(),
    status: yup.string().oneOf(Object.keys(STATUS_MAP)).required(),
    priority: yup.string().oneOf(Object.keys(PRIORITY_MAP)).required(),
    developers: yup
        .array()
        .of(yup.string())
        .min(1, "Selecione ao menos um desenvolvedor"),
    startDate: yup.string().optional(),
    deliveryDate: yup.string().optional(),
    techStack: yup.string().optional(),
    repositoryUrl: yup
        .string()
        .transform((value) => (value === "" ? undefined : value))
        .url("URL inválida")
        .nullable()
        .optional(),
    hosting: yup.string().optional(),
});
