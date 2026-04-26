"use client";
import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebaseConfig";
import { logActivity } from "@/utils/ActivityLogger";

const ScheduleContext = createContext(); // contexto da agenda criado

export const useSchedule = () => useContext(ScheduleContext);
//hook personalizado, para usar useSchedule, ao inves de escrever useContext(ScheduleContext)

// Recebe uma data e retorna uma string no formato "2026-W24" (ano + num. da semana)
export const getWeekKey = (date) => {
    const d = new Date(date);
    // Segunda-feira é o primeiro dia da semana (weekStartsOn: 1).
    const startMonday = startOfWeek(d, { weekStartsOn: 1 });

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

export const ScheduleProvider = ({ children }) => {
    // provedor do contexto de auth
    const { currentUser } = useAuth();

    // Semana exibida (offset em relação à semana atual, 0 = atual)
    const [weekOffset, setWeekOffset] = useState(0);
    // controla se mostra minha agenda ("me"), agenda de outro usuário (UID) ou todos ("all").
    const [filterUserId, setFilterUserId] = useState("me");
    // array com os documentos baixados do Firestore
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);

    // addWeeks soma ou subtrai semanas da data atual
    const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), {
        weekStartsOn: 1,
    });
    // obtém o domingo da mesma semana, ja que weekStart comeca segunda
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    // gera a chave única da semana (ex: "2025-W16").
    const weekKey = getWeekKey(weekStart);

    useEffect(() => {
        // só busca dados se o usuário estiver logado.
        if (!currentUser?.uid) return;

        setLoadingSchedules(true);

        let q;

        if (filterUserId === "all") {
            // consulta todos os docs da weekKey específica, ordenando por nome do user
            q = query(
                collection(db, "schedules"),
                where("weekKey", "==", weekKey),
                orderBy("userName", "asc"),
            );
        } else {
            // Se o filtro for "me", usa o UID do usuário logado. Caso contrário, usa o UID digitado (ou undefined se for "all").
            const effectiveUserId =
                filterUserId === "me" ? currentUser.uid : filterUserId;

            // consulta apenas o doc do user específico, com filtro por weekKey e userId
            q = query(
                collection(db, "schedules"),
                where("weekKey", "==", weekKey),
                where("userId", "==", effectiveUserId),
            );
        }

        // escuta mudanças em tempo real. Toda vez que algum documento bater com a consulta, a função de callback é executada com o novo snapshot
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setSchedules(
                    snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
                );
                setLoadingSchedules(false);
            },
            (error) => {
                console.error(error);
                toast.error(`Erro ao carregar agenda: ${error.message}`);
                setLoadingSchedules(false);
            },
        );
        return unsubscribe;
    }, [currentUser?.uid, weekKey, filterUserId]);

    // callback para memorizar a função para que não seja recriada em toda renderização
    const saveDay = useCallback(
        async (dayKey, description, targetUserId) => {
            if (!currentUser?.uid) return;

            // se for passado targetUserId (ex: um admin editando agenda de outro), usa ele; senão usa o próprio
            const uid = targetUserId || currentUser.uid;
            // ID único do documento (ex: abc123_2026-W25)
            const docId = `${uid}_${weekKey}`;

            const docRef = doc(db, "schedules", docId);

            try {
                // cria o doc se não existir, ou atualiza os campos fornecidos
                await setDoc(
                    docRef,
                    {
                        userId: uid,
                        userName:
                            currentUser.name ||
                            currentUser.displayName ||
                            "Usuário",
                        weekKey,
                        weekStart: weekStart,
                    },
                    { merge: true },
                );

                // Depois atualiza apenas o campo do dia usando dot notation
                // Isso preserva todos os outros dias intactos
                await updateDoc(docRef, {
                    [`days.${dayKey}.description`]: description,
                    [`days.${dayKey}.updatedAt`]: new Date(),
                });

                // Log de Atividade
                const dayLabel = WEEK_DAYS.find((d) => d.key === dayKey)?.label || dayKey;
                await logActivity({
                    userId: currentUser.uid,
                    userName: currentUser.name || currentUser.displayName,
                    userPhoto: currentUser.photo || currentUser.photoURL,
                    action: 'update',
                    resourceType: 'schedule',
                    resourceId: docId,
                    resourceName: `Agenda de ${dayLabel}`,
                    details: {
                        field: 'description',
                        newValue: description?.substring(0, 50) + (description?.length > 50 ? '...' : '')
                    }
                });
            } catch (err) {
                console.error(err);
                toast.error(`Erro ao salvar o dia: ${err.message}`);
                throw err;
            }
        },
        [currentUser, weekKey, weekStart],
    );

    const goToPreviousWeek = useCallback(() => setWeekOffset((o) => o - 1), []);
    const goToNextWeek = useCallback(() => setWeekOffset((o) => o + 1), []);
    const goToCurrentWeek = useCallback(() => setWeekOffset(0), []);

    const isCurrentWeek = weekOffset === 0;
    const isFutureWeek = weekOffset > 0;

    const value = useMemo(
        () => ({
            weekOffset,
            weekStart,
            weekEnd,
            weekKey,
            isCurrentWeek,
            isFutureWeek,
            goToPreviousWeek,
            goToNextWeek,
            goToCurrentWeek,
            filterUserId,
            setFilterUserId,
            schedules,
            loadingSchedules,
            saveDay,
        }),
        [
            weekOffset,
            weekStart,
            weekEnd,
            weekKey,
            isCurrentWeek,
            isFutureWeek,
            goToPreviousWeek,
            goToNextWeek,
            goToCurrentWeek,
            filterUserId,
            schedules,
            loadingSchedules,
            saveDay,
        ],
    );

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
};

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
