'use client' 
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { toast } from "sonner";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import {
    startOfWeek,
    endOfWeek,
    addWeeks,
    format,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const ScheduleContext = createContext() // contexto da agenda criado

export const useSchedule = () => useContext(ScheduleContext)
//hook personalizado, para usar useSchedule, ao inves de escrever useContext(ScheduleContext)

// Gera a chave da semana no formato "YYYY-Www"
export const getWeekKey = (date) => {
    const d = new Date(date)
    const startMonday = startOfWeek(d, {weekStartsOn: 1})
    return format(startMonday, "yyyy-'w'ww", {locale: ptBR})
    
}

export const WEEK_DAYS = [
    { key: "segunda", label: "Segunda" },
    { key: "terca",   label: "Terça" },
    { key: "quarta",  label: "Quarta" },
    { key: "quinta",  label: "Quinta" },
    { key: "sexta",   label: "Sexta" },
    { key: "sabado",  label: "Sábado" },
    { key: "domingo", label: "Domingo" },
];

export const ScheduleProvider = ({children}) => {
    const {currentUser} = useAuth()

    // Semana exibida (offset em relação à semana atual, 0 = atual)
    const [weekOffset, setWeekOffset] = useState(0)
}

/**
 * Firestore collection: "schedules"
 * Documento ID: "{userId}_{weekKey}"   ex: "abc123_2025-W24"
 * Estrutura do documento:
 * {
 *   userId: string,
 *   userName: string,
 *   weekKey: string,          // "2025-W24"
 *   weekStart: Timestamp,
 *   days: {
 *     segunda: { description: string, updatedAt: Timestamp },
 *     terca:   { description: string, updatedAt: Timestamp },
 *     quarta:  { description: string, updatedAt: Timestamp },
 *     quinta:  { description: string, updatedAt: Timestamp },
 *     sexta:   { description: string, updatedAt: Timestamp },
 *     sabado:  { description: string, updatedAt: Timestamp },
 *     domingo: { description: string, updatedAt: Timestamp },
 *   }
 * }
 */