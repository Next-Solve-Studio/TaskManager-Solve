"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdHistory, MdNotificationsNone } from "react-icons/md";
import { Avatar } from "@/components/ui/AvatarBadge";
import { db } from "@/lib/firebaseConfig";
import { cleanOldLogs, getActivityMessage } from "@/utils/ActivityLogger";

export default function ActivityFeed() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "activity_logs"),
            orderBy("timestamp", "desc"),
            limit(10),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setActivities(logs);
            setLoading(false);
        });

        // Limpa logs com mais de 2 dias ao carregar o feed
        cleanOldLogs(2);

        return () => unsubscribe();
    }, []);

    // Lógica de renderização condicionaal
    const renderActivityContent = () => {
        if (loading) {
            return (
                <div className="py-10 flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent animate-spin rounded-full" />
                    <p className="text-xs text-text-muted">
                        Carregando feed...
                    </p>
                </div>
            );
        }

        if (activities.length === 0) {
            return (
                <div className="py-10 text-center space-y-2">
                    <MdNotificationsNone className="text-3xl text-text-muted/20 mx-auto" />
                    <p className="text-xs text-text-muted">
                        Nenhuma atividade registrada ainda.
                    </p>
                </div>
            );
        }

        return (
            <div className="relative max-h-80 overflow-y-auto pr-2 scroll-hidden">
                <div className="space-y-4">
                    {activities.map((log) => {
                        const timeAgo = log.timestamp
                            ? formatDistanceToNow(log.timestamp.toDate(), {
                                  addSuffix: true,
                                  locale: ptBR,
                              })
                            : "agora mesmo";

                        return (
                            <div
                                key={log.id}
                                className="relative flex items-start gap-3 p-2 group hover:bg-bg-surface rounded-lg transition-colors "
                            >
                                <div className="z-10 self-center">
                                    <Avatar
                                        name={log.userName}
                                        uid={log.userId}
                                        src={log.userPhoto}
                                        size={30}
                                    />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        <span className="font-bold text-text-primary">
                                            {log.userName.split(" ")[0]}
                                        </span>{" "}
                                        {getActivityMessage(log)}
                                    </p>
                                    <span className="text-[10px] text-text-muted mt-1 block">
                                        {timeAgo}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <section className="bg-bg-card border border-border-main rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MdHistory className="text-brand-500 text-xl" />
                    <h2 className="text-base font-bold text-text-primary">
                        Atividades Recentes
                    </h2>
                </div>
                <div className="text-[10px] flex items-center gap-2 bg-bg-surface px-2 py-0.5 rounded-full text-text-muted font-bold uppercase tracking-wider">
                    <p>Tempo Real</p>
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex size-2 rounded-full bg-info"></span>
                    </span>
                </div>
            </div>

            <div className="space-y-6">{renderActivityContent()}</div>
        </section>
    );
}
