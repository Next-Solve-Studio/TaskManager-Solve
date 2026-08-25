"use client";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSchedule } from "@/context/ScheduleContext";
import { useUsers } from "@/context/UsersContext";
import EventDetailModal from "./modals/EventDetailModal";
import NewMeetingModal from "./modals/NewMeetingModal";
import ScheduleHeader from "./sections/ScheduleHeader";
import UsersFiltersSchedule from "./sections/UsersFilterSchedule";
import WeekGrid from "./sections/WeekGrid";
import WeekNavigation from "./sections/WeekNavigation";

export default function ScheduleMain() {
    const { currentUser } = useAuth();
    const { users, loadingUsers } = useUsers();
    const {
        weekStart, weekEnd, isCurrentWeek, goToPreviousWeek, goToNextWeek, goToCurrentWeek,
        filterUserId, setFilterUserId, events, loadingSchedules, saveMeeting, deleteMeeting,
        googleStatus, connectGoogle,
    } = useSchedule();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalState, setModalState] = useState(null);

    const isViewingAll = filterUserId === "all";
    const isViewingMe = filterUserId === "me";
    const activePersonId = isViewingMe ? currentUser?.uid : isViewingAll ? null : filterUserId;

    const visibleEvents = useMemo(
        () => (activePersonId ? events.filter((e) => e.people.includes(activePersonId)) : events),
        [events, activePersonId],
    );

    const weekLabel = useMemo(() => {
        const start = format(weekStart, "d 'de' MMM", { locale: ptBR });
        const end = format(weekEnd, "d 'de' MMM", { locale: ptBR });
        return `${start} – ${end}`;
    }, [weekStart, weekEnd]);

    return (
        <div className="min-h-screen bg-bg-main text-text-primary py-6 space-y-6 font-sans">
            <ScheduleHeader onNewMeeting={() => setModalState({ create: true })} googleStatus={googleStatus} connectGoogle={connectGoogle} />

            <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-3">
                <WeekNavigation isCurrentWeek={isCurrentWeek} goToCurrentWeek={goToCurrentWeek} goToNextWeek={goToNextWeek} goToPreviousWeek={goToPreviousWeek} weekLabel={weekLabel} />
                <UsersFiltersSchedule users={users} isViewingAll={isViewingAll} isViewingMe={isViewingMe} setFilterUserId={setFilterUserId} filterUserId={filterUserId} loadingUsers={loadingUsers} currentUser={currentUser} />
            </div>

            {loadingSchedules ? (
                <div className="flex items-center justify-center py-20 gap-3">
                    <CircularProgress size={24} style={{ color: "#19CA68" }} />
                    <span className="text-font-gray2 text-sm">Carregando agenda...</span>
                </div>
            ) : (
                <WeekGrid weekStart={weekStart} events={visibleEvents} onSelectEvent={setSelectedEvent} onCreateAt={(dayKey, start) => setModalState({ create: true, dayKey, start })} />
            )}

            <EventDetailModal
                event={selectedEvent} users={users} currentUserId={currentUser?.uid} deleteMeeting={deleteMeeting}
                onClose={() => setSelectedEvent(null)} onDeleted={() => setSelectedEvent(null)}
                onEdit={(ev) => { setSelectedEvent(null); setModalState({ editingEvent: ev }); }}
            />

            <NewMeetingModal
                open={!!modalState} onClose={() => setModalState(null)} onSaved={() => setModalState(null)}
                users={users} currentUserId={currentUser?.uid} saveMeeting={saveMeeting}
                googleStatus={googleStatus} connectGoogle={connectGoogle}
                initialDayKey={modalState?.dayKey} initialStart={modalState?.start} editingEvent={modalState?.editingEvent}
            />
        </div>
    );
}