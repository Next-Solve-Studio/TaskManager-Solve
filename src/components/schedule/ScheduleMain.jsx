"use client";

import { useMemo, useCallback } from "react";
import {
    addDays,
    format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import EmptyState from "./sections/EmptyState";
import { CircularProgress } from "@mui/material";

import { useSchedule, WEEK_DAYS } from "@/context/ScheduleContext";
import { useUsers } from "@/context/UsersContext";
import { useAuth } from "@/context/AuthContext";
import UserScheduleCard from "./card/UsersScheduleCard";
import { Avatar } from "@/utils/AvatarBadge"
import CardScheduleEdit from "./card/CardScheduleEdit";
import UsersFilter from "./sections/UsersFilter";
import ScheduleHeader from "./sections/ScheduleHeader";
import WeekNavigation from "./sections/WeekNavigation";

export default function ScheduleMain() {
    const { currentUser } = useAuth();
    const { users, loadingUsers } = useUsers();
    const {
        weekStart,
        weekEnd,
        isCurrentWeek,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
        filterUserId,
        setFilterUserId,
        schedules,
        loadingSchedules,
        saveDay,
    } = useSchedule();

    const isViewingAll = filterUserId === "all";
    const isViewingMe = filterUserId === "me";

    // Doc da agenda do usuário atual para a semana visualizada
    const myScheduleDoc = useMemo(
        () => schedules.find((s) => s.userId === currentUser?.uid),
        [schedules, currentUser?.uid],
    );

    // Doc do usuário filtrado (se não for "me" nem "all")
    const filteredScheduleDoc = useMemo(() => {
        if (isViewingMe) return myScheduleDoc;
        if (isViewingAll) return null;
        return schedules.find((s) => s.userId === filterUserId);
    }, [schedules, filterUserId, isViewingMe, isViewingAll, myScheduleDoc]);

    const activeScheduleDoc = isViewingAll ? null : filteredScheduleDoc;

    // Pode editar apenas a própria agenda
    const canEditDay = isViewingMe;

    const handleSave = useCallback(
        async (dayKey, description) => {
            await saveDay(dayKey, description);
        },
        [saveDay],
    );

    const weekLabel = useMemo(() => {
        const start = format(weekStart, "d 'de' MMM", { locale: ptBR });
        const end = format(weekEnd, "d 'de' MMM", { locale: ptBR });
        return `${start} – ${end}`;
    }, [weekStart, weekEnd]);

    
    return (
        <div className="min-h-screen bg-background-page text-white py-6 space-y-6 font-sans">

            <ScheduleHeader isViewingAll={isViewingAll} activeScheduleDoc={activeScheduleDoc}/>

            {/* ── NAVEGAÇÃO DE SEMANA + FILTROS ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Navegação de semana */}
                <WeekNavigation
                    isCurrentWeek={isCurrentWeek}
                    goToCurrentWeek={goToCurrentWeek}
                    goToNextWeek={goToNextWeek}
                    goToPreviousWeek={goToPreviousWeek}
                    weekLabel={weekLabel}
                />

                {/* Filtros de usuário */}
                <UsersFilter
                    users={users}
                    isViewingAll={isViewingAll}
                    isViewingMe={isViewingMe}
                    setFilterUserId={setFilterUserId}
                    filterUserId={filterUserId}
                    loadingUsers ={loadingUsers}
                    currentUser={currentUser}
                />
            </div>

            {/* ── CONTEÚDO PRINCIPAL ── */}
            {loadingSchedules ? (
                <div className="flex items-center justify-center py-20 gap-3">
                    <CircularProgress size={24} style={{ color: "#19CA68" }} />
                    <span className="text-font-gray2 text-sm">
                        Carregando agenda...
                    </span>
                </div>
            ) : isViewingAll ? (
                // ── MODO TODOS ──
                <div className="space-y-4">
                    {schedules.length === 0 ? (
                        <EmptyState weekLabel={weekLabel} />
                    ) : (
                        schedules.map((doc) => (
                            <UserScheduleCard
                                key={doc.id}
                                scheduleDoc={doc}
                                weekStart={weekStart}
                                users={users}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div>
                    {/* Cabeçalho do dev visualizado (se não for "eu") */}
                    {!isViewingMe && (
                        <div
                            className="flex items-center gap-3 mb-4 p-4 rounded-2xl"
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            {(() => {
                                const u = users.find((u) => u.id === filterUserId);
                                return u ? (
                                    <>
                                        <Avatar name={u.name} uid={u.id} />
                                        <div>
                                            <p className="text-white font-semibold">{u.name}</p>
                                            <p className="text-font-gray2 text-xs">
                                                Visualizando agenda
                                            </p>
                                        </div>
                                    </>
                                ) : null;
                            })()}
                        </div>
                    )}

                    {/* Grid de 7 dias */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
                        {WEEK_DAYS.map(({ key, label }, i) => {
                            const date = addDays(weekStart, i);
                            return (
                                <CardScheduleEdit
                                    key={key}
                                    dayKey={key}
                                    dayLabel={label}
                                    date={date}
                                    scheduleDoc={activeScheduleDoc}
                                    canEdit={canEditDay}
                                    onSave={handleSave}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}