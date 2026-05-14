import { addDays, format } from "date-fns";

export const formatDateInput = (date) => {
    if (!date) return "";

    const d =
        typeof date.toDate === "function" ? date.toDate() : new Date(date);

    // biome-ignore lint/suspicious/noGlobalIsNan: <>
    if (isNaN(d.getTime())) return "";

    // console.log(d.toISOString().split("T")[0]);

    return {
        dateOrigin: d.toISOString().split("T")[0], // yyyy-MM-dd
        dateFormatted: format(
            addDays(d.toISOString().split("T")[0], 1),
            "dd/MM/yyyy",
        ),
    };
};

export const parseDate = (date) => {
    if (!date) return null;

    if (typeof date.toDate === "function") return date.toDate(); // Firebase Timestamp

    if (date instanceof Date) {
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
