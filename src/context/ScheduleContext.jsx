"use client";
import { addDays, addMonths, addWeeks, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, useMemo as _,} from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebaseConfig";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useRole } from "@/hooks/useRole";

const ScheduleContext = createContext();
export const useSchedule = () => useContext(ScheduleContext);

export const getWeekKey = (date) => {
    const startMonday = startOfWeek(new Date(date), { weekStartsOn: 1 });
    return format(startMonday, "yyyy-MM-dd");
};

export const WEEK_DAYS = [
    { key: "segunda", label: "Segunda" },
    { key: "terca", label: "Terça" },
    { key: "quarta", label: "Quarta" },
    { key: "quinta", label: "Quinta" },
    { key: "sexta", label: "Sexta" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
];

export const CATEGORIES = {
    reuniao: { label: "Reunião (Meet)", color: "var(--color-cyan-400)" },
    foco: { label: "Foco / tarefa", color: "var(--color-amber-500)" },
    pessoal: { label: "Pessoal", color: "var(--color-purple-500)" },
    ausencia: { label: "Ausência", color: "var(--color-error)" },
};

async function authedFetch(url, options = {}) {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("Não autenticado");
    const res = await fetch(url, {
        ...options,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || "Erro na requisição");
    return json;
}

export const ScheduleProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const { can } = useRole();

    const [weekOffset, setWeekOffset]           = useState(0);
    const [events, setEvents]                   = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);

    const [view, setView]                       = useState("month");
    const [monthOffset, setMonthOffset]         = useState(0);
    const [selectedDate, setSelectedDate]       = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
    const [monthEvents, setMonthEvents]         = useState([]);
    const [loadingMonthEvents, setLoadingMonthEvents] = useState(true);

    const [filterUserId, setFilterUserId]       = useState("me");
    const [googleStatus, setGoogleStatus]       = useState({ connected: false, checked: false });

    const weekStart   = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
    const weekEnd     = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekKey     = getWeekKey(weekStart);
    const isCurrentWeek = weekOffset === 0;

    const monthBase     = useMemo(() => addMonths(startOfMonth(new Date()), monthOffset), [monthOffset]);
    const calGridStart  = useMemo(() => startOfWeek(startOfMonth(monthBase), { weekStartsOn: 1 }), [monthBase]);
    const calGridEnd    = useMemo(() => endOfWeek(endOfMonth(monthBase), { weekStartsOn: 1 }), [monthBase]);
    const calStartStr   = useMemo(() => format(calGridStart, "yyyy-MM-dd"), [calGridStart]);
    const calEndStr     = useMemo(() => format(calGridEnd,   "yyyy-MM-dd"), [calGridEnd]);
    const isCurrentMonth = monthOffset === 0;

    useEffect(() => {
        if (!currentUser?.companyId) { setEvents([]); setLoadingSchedules(false); return; }
        setLoadingSchedules(true);
        const canViewAll = can("canViewAllUsersSchedule");
        const q = canViewAll
            ? query(collection(db, "scheduleEvents"),
                where("companyId", "==", currentUser.companyId),
                where("weekKey",   "==", weekKey))
            : query(collection(db, "scheduleEvents"),
                where("companyId", "==", currentUser.companyId),
                where("weekKey",   "==", weekKey),
                where("people",    "array-contains", currentUser.uid));
        return onSnapshot(q,
            snap => { setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoadingSchedules(false); },
            err  => { if (err.code !== "permission-denied") toast.error(getErrorMessage(err, "Erro ao carregar agenda")); setLoadingSchedules(false); }
        );
    }, [currentUser?.companyId, currentUser?.uid, weekKey, can]);

    useEffect(() => {
        if (!currentUser?.companyId) { setMonthEvents([]); setLoadingMonthEvents(false); return; }
        setLoadingMonthEvents(true);
        const canViewAll = can("canViewAllUsersSchedule");
        const q = canViewAll
            ? query(collection(db, "scheduleEvents"),
                where("companyId", "==", currentUser.companyId),
                where("date", ">=", calStartStr),
                where("date", "<=", calEndStr))
            : query(collection(db, "scheduleEvents"),
                where("companyId", "==", currentUser.companyId),
                where("people",    "array-contains", currentUser.uid),
                where("date", ">=", calStartStr),
                where("date", "<=", calEndStr));
        return onSnapshot(q,
            snap => { setMonthEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoadingMonthEvents(false); },
            err  => { if (err.code !== "permission-denied") console.error(err); setLoadingMonthEvents(false); }
        );
    }, [currentUser?.companyId, currentUser?.uid, calStartStr, calEndStr, can]);

    const refreshGoogleStatus = useCallback(async () => {
        if (!currentUser?.uid) return;
        try {
            const data = await authedFetch("/api/google/status");
            setGoogleStatus({ connected: !!data.connected, email: data.email, checked: true });
        } catch { setGoogleStatus({ connected: false, checked: true }); }
    }, [currentUser?.uid]);

    useEffect(() => { refreshGoogleStatus(); }, [refreshGoogleStatus]);

    const connectGoogle    = useCallback(() => { window.location.href = "/api/google/auth"; }, []);
    const disconnectGoogle = useCallback(async () => { await authedFetch("/api/google/disconnect", { method: "POST" }); await refreshGoogleStatus(); }, [refreshGoogleStatus]);

    const saveMeeting = useCallback(async (eventData) => {
        let date, wKey;
        if (eventData.date) {
            date = eventData.date;
            wKey = getWeekKey(eventData.date);
        } else {
            const dayIndex = WEEK_DAYS.findIndex(d => d.key === eventData.dayKey);
            date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");
            wKey = weekKey;
        }
        return authedFetch("/api/schedule/meetings", {
            method: "POST",
            body: JSON.stringify({ ...eventData, weekKey: wKey, date }),
        });
    }, [weekKey, weekStart]);

    const deleteMeeting = useCallback((id) => authedFetch(`/api/schedule/meetings/${id}`, { method: "DELETE" }), []);

    const goToPreviousWeek  = useCallback(() => setWeekOffset(o => o - 1), []);
    const goToNextWeek      = useCallback(() => setWeekOffset(o => o + 1), []);
    const goToCurrentWeek   = useCallback(() => setWeekOffset(0), []);
    const goToPrevMonth     = useCallback(() => setMonthOffset(o => o - 1), []);
    const goToNextMonth     = useCallback(() => setMonthOffset(o => o + 1), []);
    const goToCurrentMonth  = useCallback(() => { setMonthOffset(0); setSelectedDate(new Date()); }, []);

    const value = useMemo(() => ({
        // week
        weekOffset, weekStart, weekEnd, weekKey, isCurrentWeek,
        goToPreviousWeek, goToNextWeek, goToCurrentWeek,
        events, loadingSchedules,
        // month
        view, setView,
        monthBase, calGridStart, calGridEnd, isCurrentMonth,
        goToPrevMonth, goToNextMonth, goToCurrentMonth,
        monthEvents, loadingMonthEvents,
        selectedDate, setSelectedDate,
        // common
        filterUserId, setFilterUserId,
        saveMeeting, deleteMeeting,
        googleStatus, connectGoogle, disconnectGoogle,
    }), [
        weekOffset, weekStart, weekEnd, weekKey, isCurrentWeek,
        goToPreviousWeek, goToNextWeek, goToCurrentWeek, events, loadingSchedules,
        view, monthBase, calGridStart, calGridEnd, isCurrentMonth,
        goToPrevMonth, goToNextMonth, goToCurrentMonth, monthEvents, loadingMonthEvents,
        selectedDate,
        filterUserId, saveMeeting, deleteMeeting, googleStatus, connectGoogle, disconnectGoogle,
    ]);

    return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};