"use client";
import { collection, onSnapshot, query, where, limit } from "firebase/firestore";
import { useEffect, useState, useMemo, useCallback } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

function toDate(val) {
    if (!val) return null;
    if (typeof val?.toDate === "function") return val.toDate();
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    return null;
}

const DONE_TASK = ["concluida", "concluído"];
const DONE_PROJECT = ["concluido", "cancelado"];

export function useNotifications() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readIds, setReadIds] = useState(new Set());

    // Carrega IDs lidos do localStorage quando o usuário muda
    useEffect(() => {
        if (!currentUser?.uid) return;
        try {
            const stored = localStorage.getItem(`notif_read_${currentUser.uid}`);
            setReadIds(stored ? new Set(JSON.parse(stored)) : new Set());
        } catch {
            setReadIds(new Set());
        }
    }, [currentUser?.uid]);

    useEffect(() => {
        if (!currentUser?.uid || !currentUser?.companyId) {
            setLoading(false);
            return;
        }
        const { uid, companyId } = currentUser;
        let loaded = 0;
        const markLoaded = () => { if (++loaded >= 3) setLoading(false); };
        const unsubs = [];

        unsubs.push(onSnapshot(
            query(collection(db, "tasks"),
                where("companyId", "==", companyId),
                where("assignedTo", "array-contains", uid),
                limit(100)),
            snap => { setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() }))); markLoaded(); },
            () => markLoaded()
        ));

        unsubs.push(onSnapshot(
            query(collection(db, "projects"),
                where("companyId", "==", companyId),
                where("developers", "array-contains", uid),
                limit(50)),
            snap => { setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() }))); markLoaded(); },
            () => markLoaded()
        ));

        unsubs.push(onSnapshot(
            query(collection(db, "scheduleEvents"),
                where("companyId", "==", companyId),
                where("people", "array-contains", uid),
                limit(30)),
            snap => { setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }))); markLoaded(); },
            () => markLoaded()
        ));

        return () => unsubs.forEach(u => u());
    }, [currentUser?.uid, currentUser?.companyId]);

    const allNotifications = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const result = [];

        tasks.forEach(task => {
            if (DONE_TASK.includes(task.status)) return;
            const end = toDate(task.endDate);
            if (!end) return;
            const days = differenceInCalendarDays(end, today);
            if (days < 0) {
                result.push({
                    id: `t-ov-${task.id}`, type: "task_overdue",
                    title: task.title,
                    subtitle: `Venceu há ${Math.abs(days)} dia${Math.abs(days) !== 1 ? "s" : ""}`,
                    href: "/tasks", priority: 0,
                });
            } else if (days <= 3) {
                result.push({
                    id: `t-sn-${task.id}`, type: "task_soon",
                    title: task.title,
                    subtitle: days === 0 ? "Vence hoje" : `Vence em ${days} dia${days !== 1 ? "s" : ""}`,
                    href: "/tasks", priority: 1,
                });
            }
        });

        projects.forEach(proj => {
            if (DONE_PROJECT.includes(proj.status)) return;
            const end = toDate(proj.expectedDeliveryDate);
            if (!end) return;
            const days = differenceInCalendarDays(end, today);
            if (days < 0) {
                result.push({
                    id: `p-ov-${proj.id}`, type: "project_overdue",
                    title: proj.title,
                    subtitle: `Prazo vencido há ${Math.abs(days)} dia${Math.abs(days) !== 1 ? "s" : ""}`,
                    href: "/projects", priority: 0,
                });
            } else if (days <= 7) {
                result.push({
                    id: `p-sn-${proj.id}`, type: "project_soon",
                    title: proj.title,
                    subtitle: days === 0 ? "Entrega hoje" : `Entrega em ${days} dia${days !== 1 ? "s" : ""}`,
                    href: "/projects", priority: 1,
                });
            }
        });

        events.forEach(ev => {
            if (!ev.date) return;
            const evDate = new Date(ev.date + "T00:00:00");
            const days = differenceInCalendarDays(evDate, today);
            if (days < 0 || days > 7) return;
            const dateLabel = days === 0 ? "Hoje" : days === 1 ? "Amanhã" : format(evDate, "dd/MM", { locale: ptBR });
            result.push({
                id: `ev-${ev.id}`,
                type: days === 0 ? "event_today" : "event_upcoming",
                title: ev.title,
                subtitle: `${dateLabel} às ${ev.start}`,
                href: "/schedule",
                priority: days === 0 ? 1 : 2,
            });
        });

        return result.sort((a, b) => a.priority - b.priority);
    }, [tasks, projects, events]);

    const saveReadIds = useCallback((next) => {
        setReadIds(next);
        try {
            localStorage.setItem(`notif_read_${currentUser?.uid}`, JSON.stringify([...next]));
        } catch {}
    }, [currentUser?.uid]);

    const markRead = useCallback((id) => {
        saveReadIds(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
        // saveReadIds recebe o Set atualizado diretamente
        setReadIds(prev => {
            const next = new Set(prev);
            next.add(id);
            try {
                localStorage.setItem(`notif_read_${currentUser?.uid}`, JSON.stringify([...next]));
            } catch {}
            return next;
        });
    }, [currentUser?.uid]);

    const clearAll = useCallback(() => {
        setReadIds(prev => {
            const next = new Set([...prev, ...allNotifications.map(n => n.id)]);
            try {
                localStorage.setItem(`notif_read_${currentUser?.uid}`, JSON.stringify([...next]));
            } catch {}
            return next;
        });
    }, [allNotifications, currentUser?.uid]);

    const notifications = useMemo(
        () => allNotifications.filter(n => !readIds.has(n.id)),
        [allNotifications, readIds]
    );

    return { notifications, loading, count: notifications.length, markRead, clearAll };
}