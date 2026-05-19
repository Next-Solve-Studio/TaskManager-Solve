'use client'
import { StatCard } from '@/components/home/sections/StatCard'
import { useMemo } from 'react';
import {
    MdAttachMoney,
    MdCheckCircle,
    MdErrorOutline,
} from "react-icons/md";

export default function FinancialKPIs({filteredProjects}) {

    // ── PROCESSAMENTO DE DADOS FINANCEIROS ──
        const financialStats = useMemo(() => {
            const total = filteredProjects.reduce((acc, p) => acc + (Number(p.totalValue) || 0), 0);
            const paid = filteredProjects.reduce((acc, p) => acc + (Number(p.paidValue) || 0), 0);
            const pending = total - paid;
            
            return {
                total,
                paid,
                pending,
                paidPercentage: total > 0 ? Math.round((paid / total) * 100) : 0
            };
        }, [filteredProjects]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={MdAttachMoney} label="Faturamento Previsto" value={financialStats.total} color="#19CA68" bg="#19CA680F" border="#19CA6826" />
            <StatCard icon={MdCheckCircle} label="Receita Realizada" value={financialStats.paid} color="#22d3ee" bg="#22D3EE0F" border="rgba(34,211,238,0.15)" />
            <StatCard icon={MdErrorOutline} label="Contas a Receber" value={financialStats.pending} color="#f59e0b" bg="rgba(245,158,11,0.06)" border="rgba(245,158,11,0.15)" />
        </div>
    )
}
