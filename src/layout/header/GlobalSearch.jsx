"use client";
import { useState, useEffect, useRef } from "react";
import { MdSearch, MdClose, MdFolderOpen, MdCheckBox, MdPeople } from "react-icons/md";
import { useRouter } from "next/navigation";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useProjects } from "@/context/ProjectsContext";
import { useClients } from "@/context/ClientsContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebaseConfig";

function Highlight({ text, term }) {
    if (!term || !text) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <span className="text-brand-400 font-semibold">{text.slice(idx, idx + term.length)}</span>
            {text.slice(idx + term.length)}
        </>
    );
}

const STATUS_LABEL = {
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    suporte: "Em Suporte",
    planejado: "Planejado",
    arquivado: "Arquivado",
};

export default function GlobalSearch({ isMobile, searchOpen, setSearchOpen }) {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState({ projects: [], tasks: [], clients: [] });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const router = useRouter();
    const { projects } = useProjects();
    const { clients } = useClients();
    const { currentUser } = useAuth();

    useEffect(() => {
        const handler = (e) => {
            if (!containerRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (searchOpen && inputRef.current) inputRef.current.focus();
    }, [searchOpen]);

    useEffect(() => {
        if (term.length < 2) {
            setResults({ projects: [], tasks: [], clients: [] });
            setOpen(false);
            return;
        }
        const t = setTimeout(async () => {
            const q = term.toLowerCase();
            const matchedProjects = (projects || [])
                .filter(p => (p.title || p.name || "").toLowerCase().includes(q))
                .slice(0, 4);
            const matchedClients = (clients || [])
                .filter(c => (c.name || "").toLowerCase().includes(q))
                .slice(0, 3);

            let matchedTasks = [];
            if (currentUser?.companyId) {
                try {
                    setLoading(true);
                    const q2 = query(
                        collection(db, "tasks"),
                        where("companyId", "==", currentUser.companyId),
                        limit(80)
                    );
                    const snap = await getDocs(q2);
                    matchedTasks = snap.docs
                        .map(d => ({ id: d.id, ...d.data() }))
                        .filter(t => (t.title || t.name || "").toLowerCase().includes(q))
                        .slice(0, 4);
                } catch {
                    matchedTasks = [];
                } finally {
                    setLoading(false);
                }
            }
            setResults({ projects: matchedProjects, tasks: matchedTasks, clients: matchedClients });
            setOpen(true);
        }, 300);
        return () => clearTimeout(t);
    }, [term, projects, clients, currentUser]);

    const navigate = (path) => {
        router.push(path);
        setTerm("");
        setOpen(false);
        setSearchOpen?.(false);
    };

    const clear = () => { setTerm(""); setOpen(false); };
    const cancel = () => { clear(); setSearchOpen?.(false); };

    const total = results.projects.length + results.tasks.length + results.clients.length;

    if (isMobile && !searchOpen) return null;

    return (
        <div ref={containerRef} className={isMobile ? "flex-1 relative flex items-center gap-2" : "w-full max-w-105 relative"}>
             <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    boxShadow: open ? "0 0 0 2px rgba(25,202,104,0.18), inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}>
                <MdSearch size={17} className="text-text-muted shrink-0" />
                <input
                    ref={inputRef}
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    onFocus={() => term.length >= 2 && setOpen(true)}
                    onKeyDown={e => {
                        if (e.key === "Escape") cancel();
                    }}
                    placeholder={isMobile ? "Buscar..." : "Buscar projetos, tarefas, clientes..."}
                    className="flex-1 min-w-0 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                {term && (
                    <button type="button" onClick={clear} className="text-text-muted hover:text-text-primary shrink-0">
                        <MdClose size={15} />
                    </button>
                )}
            </div>

            {isMobile && (
                <button type="button" onClick={cancel} className="text-xs text-text-muted hover:text-text-primary shrink-0 px-1">
                    Cancelar
                </button>
            )}

            {open && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border-main overflow-hidden z-60"
                    style={{ background: "var(--color-bg-card)", boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>

                    {loading && (
                        <p className="px-4 py-3 text-xs text-text-muted">Buscando tarefas...</p>
                    )}
                    {!loading && total === 0 && (
                        <p className="px-4 py-5 text-xs text-text-muted text-center">Nenhum resultado para "{term}"</p>
                    )}

                    {results.projects.length > 0 && (
                        <section>
                            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                Projetos
                            </div>
                            {results.projects.map(p => (
                                <button key={p.id} type="button" onClick={() => navigate("/projects")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-surface transition-colors text-left">
                                    <MdFolderOpen size={16} className="text-brand-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-text-primary truncate">
                                            <Highlight text={p.title || p.name} term={term} />
                                        </p>
                                        {p.status && (
                                            <p className="text-[11px] text-text-muted">{STATUS_LABEL[p.status] || p.status}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </section>
                    )}

                    {results.tasks.length > 0 && (
                        <section>
                            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                Tarefas
                            </div>
                            {results.tasks.map(t => (
                                <button key={t.id} type="button" onClick={() => navigate("/tasks")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-surface transition-colors text-left">
                                    <MdCheckBox size={16} className="text-cyan-400 shrink-0" />
                                    <p className="text-sm text-text-primary truncate">
                                        <Highlight text={t.title || t.name} term={term} />
                                    </p>
                                </button>
                            ))}
                        </section>
                    )}

                    {results.clients.length > 0 && (
                        <section>
                            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                Clientes
                            </div>
                            {results.clients.map(c => (
                                <button key={c.id} type="button" onClick={() => navigate("/clients")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-surface transition-colors text-left">
                                    <MdPeople size={16} className="text-purple-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-text-primary truncate">
                                            <Highlight text={c.name} term={term} />
                                        </p>
                                        {c.email && (
                                            <p className="text-[11px] text-text-muted truncate">{c.email}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}