"use client";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useSchedule, WEEK_DAYS } from "@/context/ScheduleContext";
import { useUsers } from "@/context/UsersContext";
import useIsMobile from "@/hooks/responsive/useIsMobile";
import EventDetailModal from "./modals/EventDetailModal";
import NewMeetingModal from "./modals/NewMeetingModal";
import MonthCalendar from "./sections/MonthCalendar";
import UsersFiltersSchedule from "./sections/UsersFilterSchedule";
import WeekGrid from "./sections/WeekGrid";
import WeekNavigation from "./sections/WeekNavigation";

export default function ScheduleMain() {
    const { currentUser } = useAuth();
    const { users, loadingUsers } = useUsers();
    const isMobile = useIsMobile();

    const {
        weekStart, weekEnd, isCurrentWeek,
        goToPreviousWeek, goToNextWeek, goToCurrentWeek,
        filterUserId, setFilterUserId,
        events, loadingSchedules,
        view, setView,
        monthBase, calGridStart, calGridEnd, isCurrentMonth,
        goToPrevMonth, goToNextMonth, goToCurrentMonth,
        monthEvents, loadingMonthEvents,
        selectedDate, setSelectedDate,
        saveMeeting, deleteMeeting,
        googleStatus, connectGoogle,
    } = useSchedule();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalState, setModalState]       = useState(null);

    const isViewingAll   = filterUserId === "all";
    const isViewingMe    = filterUserId === "me";
    const activePersonId = isViewingMe ? currentUser?.uid : isViewingAll ? null : filterUserId;

    const visibleWeekEvents = useMemo(
        () => activePersonId ? events.filter(e => e.people?.includes(activePersonId)) : events,
        [events, activePersonId]
    );
    const visibleMonthEvents = useMemo(
        () => activePersonId ? monthEvents.filter(e => e.people?.includes(activePersonId)) : monthEvents,
        [monthEvents, activePersonId]
    );

    const weekLabel = useMemo(() => {
        const s = format(weekStart, "d 'de' MMM", { locale: ptBR });
        const e = format(weekEnd,   "d 'de' MMM", { locale: ptBR });
        return `${s} – ${e}`;
    }, [weekStart, weekEnd]);

    const monthLabel = useMemo(() => {
        const raw = format(monthBase, "MMMM yyyy", { locale: ptBR });
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }, [monthBase]);

    // Mobile sempre mostra month view
    const effectiveView = isMobile ? "month" : view;

    // Abre modal de criação com a data do dia clicado
    const handleDayCreate = (dateStr) => {
        const d      = new Date(dateStr + "T12:00:00");
        const dow    = d.getDay();
        const dayKey = WEEK_DAYS[dow === 0 ? 6 : dow - 1]?.key;
        setModalState({ create: true, date: dateStr, dayKey });
    };

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-4 font-sans">

            {/* ── Título ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Minha Agenda</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Gerencie seus eventos e compromissos
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setModalState({ create: true })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-black font-bold text-sm hover:bg-brand-600 transition-colors shadow-[0_4px_14px_#A2C2B040]"
                >
                    <MdAdd size={18} />
                    <span className="hidden sm:inline">Novo Evento</span>
                </button>
            </div>

            {/* ── Barra de navegação + filtros ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* Navegação */}
                {effectiveView === "month" ? (
                    <div className="flex items-center gap-1.5">
                        <button type="button" onClick={goToPrevMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                            <MdChevronLeft size={20} />
                        </button>
                        <span className="text-text-primary font-bold text-base min-w-[170px] text-center select-none">
                            {monthLabel}
                        </span>
                        <button type="button" onClick={goToNextMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                            <MdChevronRight size={20} />
                        </button>
                        {!isCurrentMonth && (
                            <button type="button" onClick={goToCurrentMonth}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-main text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                                Atual
                            </button>
                        )}
                    </div>
                ) : (
                    <WeekNavigation
                        isCurrentWeek={isCurrentWeek}
                        goToCurrentWeek={goToCurrentWeek}
                        goToNextWeek={goToNextWeek}
                        goToPreviousWeek={goToPreviousWeek}
                        weekLabel={weekLabel}
                    />
                )}

                {/* Toggle Mês/Semana + filtros de usuário */}
                <div className="flex items-center gap-3 flex-nowrap">
                    {!isMobile && (
                        <div className="flex items-center rounded-xl border border-border-main  bg-bg-surface p-0.5 gap-0.5">
                            {["month", "week"].map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setView(v)}
                                    className={`px-3 py-1.5 cursor-pointer rounded-[10px] text-sm font-semibold transition-all ${
                                        view === v
                                            ? "bg-bg-card text-text-primary shadow-sm"
                                            : "text-text-muted hover:text-text-primary"
                                    }`}
                                >
                                    {v === "month" ? "Mês" : "Semana"}
                                </button>
                            ))}
                        </div>
                    )}
                    <UsersFiltersSchedule
                        users={users}
                        isViewingAll={isViewingAll}
                        isViewingMe={isViewingMe}
                        setFilterUserId={setFilterUserId}
                        filterUserId={filterUserId}
                        loadingUsers={loadingUsers}
                        currentUser={currentUser}
                    />
                </div>
            </div>

            {/* ── Conteúdo principal ── */}
            {effectiveView === "month" ? (
                loadingMonthEvents ? (
                    <div className="flex items-center justify-center py-20 gap-3">
                        <CircularProgress size={24} style={{ color: "#19CA68" }} />
                    </div>
                ) : (
                    <MonthCalendar
                        monthBase={monthBase}
                        calGridStart={calGridStart}
                        calGridEnd={calGridEnd}
                        events={visibleMonthEvents}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        onSelectEvent={setSelectedEvent}
                        onDayCreate={handleDayCreate}
                        isMobile={isMobile}
                    />
                )
            ) : (
                loadingSchedules ? (
                    <div className="flex items-center justify-center py-20 gap-3">
                        <CircularProgress size={24} style={{ color: "#19CA68" }} />
                        <span className="text-text-secondary text-sm">Carregando agenda...</span>
                    </div>
                ) : (
                    <WeekGrid
                        weekStart={weekStart}
                        events={visibleWeekEvents}
                        users={users}
                        onSelectEvent={setSelectedEvent}
                        onCreateAt={(dayKey, start) => setModalState({ create: true, dayKey, start })}
                    />
                )
            )}

            {/* ── Modais ── */}
            <EventDetailModal
                event={selectedEvent}
                users={users}
                currentUserId={currentUser?.uid}
                deleteMeeting={deleteMeeting}
                onClose={() => setSelectedEvent(null)}
                onDeleted={() => setSelectedEvent(null)}
                onEdit={(ev) => { setSelectedEvent(null); setModalState({ editingEvent: ev }); }}
            />

            <NewMeetingModal
                open={!!modalState}
                onClose={() => setModalState(null)}
                onSaved={() => setModalState(null)}
                users={users}
                currentUserId={currentUser?.uid}
                saveMeeting={saveMeeting}
                googleStatus={googleStatus}
                connectGoogle={connectGoogle}
                initialDayKey={modalState?.date}
                initialStart={modalState?.start}
                editingEvent={modalState?.editingEvent}
            />
        </div>
    );
}