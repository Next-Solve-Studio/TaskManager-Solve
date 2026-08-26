"use client";
import { addDays, addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
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

    const [weekOffset, setWeekOffset] = useState(0);
    const [filterUserId, setFilterUserId] = useState("me");
    const [events, setEvents] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [googleStatus, setGoogleStatus] = useState({ connected: false, checked: false });

    const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekKey = getWeekKey(weekStart);

    useEffect(() => {
        if (!currentUser?.companyId) {
            setEvents([]);
            setLoadingSchedules(false);
            return;
        }
        setLoadingSchedules(true);

        const canViewAll = can("canViewAllUsersSchedule");

        const q = canViewAll
            ? query(
                  collection(db, "scheduleEvents"),
                  where("companyId", "==", currentUser.companyId),
                  where("weekKey", "==", weekKey),
              )
            : query(
                  collection(db, "scheduleEvents"),
                  where("companyId", "==", currentUser.companyId),
                  where("weekKey", "==", weekKey),
                  where("people", "array-contains", currentUser.uid),
              );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setEvents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
                setLoadingSchedules(false);
            },
            (error) => {
                console.error(error);
                if (error.code !== "permission-denied") {
                    toast.error(getErrorMessage(error, "Erro ao carregar agenda"));
                }
                setLoadingSchedules(false);
            },
        );
        return unsubscribe;
    }, [currentUser?.companyId, currentUser?.uid, weekKey, can]);

    const refreshGoogleStatus = useCallback(async () => {
        if (!currentUser?.uid) return;
        try {
            const data = await authedFetch("/api/google/status");
            setGoogleStatus({ connected: !!data.connected, email: data.email, checked: true });
        } catch {
            setGoogleStatus({ connected: false, checked: true });
        }
    }, [currentUser?.uid]);

    useEffect(() => {
        refreshGoogleStatus();
    }, [refreshGoogleStatus]);

    const connectGoogle = useCallback(() => {
        window.location.href = "/api/google/auth";
    }, []);

    const disconnectGoogle = useCallback(async () => {
        await authedFetch("/api/google/disconnect", { method: "POST" });
        await refreshGoogleStatus();
    }, [refreshGoogleStatus]);

    const saveMeeting = useCallback(
        async (eventData) => {
            const dayIndex = WEEK_DAYS.findIndex((d) => d.key === eventData.dayKey);
            const date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");
            return authedFetch("/api/schedule/meetings", {
                method: "POST",
                body: JSON.stringify({ ...eventData, weekKey, date }),
            });
        },
        [weekKey, weekStart],
    );

    const deleteMeeting = useCallback((id) => authedFetch(`/api/schedule/meetings/${id}`, { method: "DELETE" }), []);

    const goToPreviousWeek = useCallback(() => setWeekOffset((o) => o - 1), []);
    const goToNextWeek = useCallback(() => setWeekOffset((o) => o + 1), []);
    const goToCurrentWeek = useCallback(() => setWeekOffset(0), []);
    const isCurrentWeek = weekOffset === 0;

    const value = useMemo(
        () => ({
            weekOffset, weekStart, weekEnd, weekKey, isCurrentWeek,
            goToPreviousWeek, goToNextWeek, goToCurrentWeek,
            filterUserId, setFilterUserId,
            events, loadingSchedules,
            saveMeeting, deleteMeeting,
            googleStatus, connectGoogle, disconnectGoogle,
        }),
        [weekOffset, weekStart, weekEnd, weekKey, isCurrentWeek, goToPreviousWeek, goToNextWeek, goToCurrentWeek,
         filterUserId, events, loadingSchedules, saveMeeting, deleteMeeting, googleStatus, connectGoogle, disconnectGoogle],
    );

    return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};