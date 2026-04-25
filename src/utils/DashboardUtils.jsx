import { differenceInDays, startOfMonth } from "date-fns";
export function toDate(value) {
    if (!value) return null;
    if (value?.toDate) return value.toDate();
    return new Date(value);
}

export function calcProgress(project) {
    const start = toDate(project.startDate);
    const end = toDate(project.expectedDeliveryDate);
    if (!start || !end) return 0;
    const total = differenceInDays(end, start);
    if (total <= 0) return 100;
    const elapsed = differenceInDays(new Date(), start);
    return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
}

export function buildWeeklyData(projects) {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const data = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((semana) => ({
        semana,
        concluidos: 0,
        em_andamento: 0,
        suporte: 0,
    }));

    projects.forEach((p) => {
        const date = toDate(p.createdAt);
        if (!date) return;
        const dayOfMonth = differenceInDays(date, monthStart);
        if (dayOfMonth < 0 || dayOfMonth > 31) return;
        const weekIdx = Math.min(Math.floor(dayOfMonth / 7), 3);
        if (p.status === "concluido") data[weekIdx].concluidos += 1;
        else if (p.status === "em_andamento") data[weekIdx].em_andamento += 1;
        else if (p.status === "suporte") data[weekIdx].suporte += 1;
    });

    return data;
}
