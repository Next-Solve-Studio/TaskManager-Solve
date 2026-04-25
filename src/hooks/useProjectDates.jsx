"use client";
import { differenceInDays, format } from "date-fns";
import { useMemo } from "react";
import { parseDate } from "@/utils/FormatDateProjects";

export function useProjectsDates(project) {
    const startDateInfo = useMemo(() => {
        // Converte a string (ex: "2024-01-15") em um objeto Date. Se a string for inválida, parseDate deve retornar null
        const start = parseDate(project.startDate);
        if (!start) return null;

        // Formata a data no padrão brasileiro
        return { formatted: format(start, "dd/MM/yyyy") };
    }, [project.startDate]);

    // executa essa função apenas quando project.expectedDeliveryDate mudar. Se não mudar, reutiliza o valor antigo
    const expectedInfo = useMemo(() => {
        //se não houver previsão de entrega, retorna null
        if (!project.expectedDeliveryDate) return null;

        // Converte a string da data prevista em objeto Date
        const due = parseDate(project.expectedDeliveryDate);
        if (!due) return null;

        const diff = differenceInDays(due, new Date()); // calcula quantos dias faltam para a entrega, se for negativa, ja passou
        const formatted = format(due, "dd/MM/yyyy");

        if (diff < 0)
            return {
                text: `${Math.abs(diff)}d atrasado`,
                color: "var(--color-error)",
                formatted,
            };
        if (diff <= 7)
            return {
                text: `${diff}d restantes`,
                color: "var(--color-warning)",
                formatted,
            };

        return {
            text: formatted,
            color: "var(--color-font-gray2)",
            formatted,
        };
    }, [project.expectedDeliveryDate]);

    // executa essa função apenas quando project.deliveryDate mudar. Se não mudar, reutiliza o valor antigo
    const deliveredInfo = useMemo(() => {
        if (!project.deliveryDate) return null;

        // Converte a string da data de entrega em objeto Date
        const delivered = parseDate(project.deliveryDate);
        if (!delivered) return null;

        // Formata a data no padrão brasileiro
        return {
            formatted: format(delivered, "dd/MM/yyyy"),
        };
    }, [project.deliveryDate]);

    const supportInfo = useMemo(() => {
        if (!project.supportEndDate) return null;

        // Converte a string da data de entrega em objeto Date
        const support = parseDate(project.supportEndDate);
        if (!support) return null;

        // Formata a data no padrão brasileiro
        return {
            formatted: format(support, "dd/MM/yyyy"),
        };
    }, [project.supportEndDate]);

    const deliveryStatus = useMemo(() => {
        // Só calcula se ambas as datas existirem
        if (!project.deliveryDate || !project.expectedDeliveryDate) return null;

        const delivered = parseDate(project.deliveryDate);
        const expected = parseDate(project.expectedDeliveryDate);
        if (!delivered || !expected) return null;

        const diff = differenceInDays(delivered, expected);

        if (diff > 0)
            return { text: `${diff}d atrasado`, color: "var(--color-error)" };
        if (diff < 0)
            return {
                text: `${Math.abs(diff)}d adiantado`,
                color: "var(--color-success)",
            };

        return { text: "No prazo", color: "var(--color-cyan-500)" };
    }, [project.deliveryDate, project.expectedDeliveryDate]);

    return {
        startDateInfo,
        expectedInfo,
        deliveredInfo,
        deliveryStatus,
        supportInfo,
    };
}
