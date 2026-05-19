import { formatCurrency } from '@/utils/FormatCurrency';
import React from 'react'
import { MdTrendingUp } from 'react-icons/md';

export default function FinancialDetails({filteredProjects}) {
    return (
        <div className="bg-bg-card border border-border-main rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-main flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MdTrendingUp className="text-brand-500" /> Saúde Financeira dos Projetos
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-bg-surface">
                            <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Projeto</th>
                            <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Faturamento</th>
                            <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Recebido</th>
                            <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Progresso de Pagamento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main">
                        {filteredProjects.filter(p => p.totalValue > 0).map((project) => {
                            const progress = Math.round((project.paidValue / project.totalValue) * 100) || 0;
                            return (
                                <tr key={project.id} className="hover:bg-bg-surface/50 transition-colors">
                                    <td className="p-4 font-medium">{project.title}</td>
                                    <td className="p-4">
                                        <span className="text-xs px-2 py-1 rounded-full bg-bg-surface border border-border-main capitalize">
                                            {project.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-text-primary">{formatCurrency(project.totalValue)}</td>
                                    <td className="p-4 text-brand-500 font-bold">{formatCurrency(project.paidValue)}</td>
                                    <td className="p-4 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-bg-surface rounded-full overflow-hidden border border-border-main">
                                                <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-text-muted w-8">{progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
