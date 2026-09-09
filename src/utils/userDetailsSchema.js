import * as yup from "yup";

export const userDetailsSchema = yup.object({
    cpf: yup
        .string()
        .transform((value) => value?.replace(/\D/g, ""))
        .default("")
        .test(
            "cpf-format",
            "CPF deve conter 11 dígitos",
            (value) => !value || value.length === 11,
        ),
    endereco: yup.string().trim().max(300, "Máximo de 300 caracteres").default(""),
});
