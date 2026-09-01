'use client'
import { useMemo, useState, useRef, useEffect } from "react";
import { MdAttachMoney, MdKeyboardArrowDown } from "react-icons/md";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { GLASS_CARD } from "@/styles/StylesCard";

const BRAND = "#19CA68";
const BRAND_MUTED = "rgba(25,202,104,0.35)";
const PERIODS = ['Mensal', 'Semanal', 'Anual'];


export default function FinancialTrend({ filteredProjects, getDateObject }) {
    const [period, setPeriod] = useState('Mensal');
    const [open, setOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const currentMonthStr = useMemo(() => {
        const s = new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
        return s.charAt(0).toUpperCase() + s.slice(1);
    }, []);

    const revenueTrend = useMemo(() => {
        const resolve = getDateObject || ((d) => {
            if (!d) return null;
            if (typeof d?.toDate === 'function') return d.toDate();
            if (d instanceof Date) return d;
            const p = new Date(d); return isNaN(p.getTime()) ? null : p;
        });
        const groupKey = (d) => {
            if (period === 'Anual') return String(d.getFullYear());
            if (period === 'Semanal') {
                const s = new Date(d); s.setDate(d.getDate() - d.getDay());
                return s.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            }
            const s = d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
            return s.charAt(0).toUpperCase() + s.slice(1);
        };
        const map = {}, order = [];
        filteredProjects.forEach(p => {
            const d = resolve(p.startDate || p.createdAt) || new Date();
            const k = groupKey(d);
            if (!map[k]) { map[k] = 0; order.push(k); }
            map[k] += Number(p.totalValue) || 0;
        });
        const seen = new Set();
        return order
            .filter(k => { if (seen.has(k)) return false; seen.add(k); return true; })
            .map(k => ({ name: k, value: map[k], isCurrent: k === currentMonthStr }));
    }, [filteredProjects, getDateObject, currentMonthStr, period]);

    return (
        <div className="rounded-2xl p-6" style={GLASS_CARD}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MdAttachMoney className="text-brand-500" /> Evolução de Faturamento
                </h3>
                <div ref={dropRef} className="relative">
                    <button type="button" onClick={() => setOpen(o => !o)}
                        className="flex items-center gap-1 text-sm text-text-secondary bg-bg-surface border border-border-main rounded-lg px-3 py-1.5 hover:border-brand-500 transition-colors">
                        {period} <MdKeyboardArrowDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                        <div className="absolute right-0 top-full mt-1 bg-bg-card border border-border-main rounded-xl shadow-xl z-20 min-w-30 overflow-hidden">
                            {PERIODS.map(p => (
                                <button type="button" key={p} onClick={() => { setPeriod(p); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-surface transition-colors ${p === period ? 'text-brand-500 font-medium' : 'text-text-secondary'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueTrend} barSize={36} barGap={8} margin={{ left: -8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false}
                            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                        <YAxis tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                            axisLine={false} tickLine={false}
                            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} width={36} />
                        <Tooltip content={<CustomTooltip />}
                            cursor={{ fill: "rgba(255,255,255,0.04)", radius: [4, 4, 0, 0] }} />
                        <Bar dataKey="value" name="Faturamento" radius={[5, 5, 0, 0]}>
                            {revenueTrend.map((entry, i) => (
                                <Cell key={i} fill={entry.isCurrent ? BRAND : BRAND_MUTED} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}