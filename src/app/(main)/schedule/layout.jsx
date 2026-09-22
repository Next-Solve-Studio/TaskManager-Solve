"use client";
import { ScheduleProvider } from "@/context/ScheduleContext";

export default function ScheduleLayout({ children }) {
    return (
        <ScheduleProvider>
            {children}
        </ScheduleProvider>
    );
}