import { MdFilterList, MdTrendingUp } from "react-icons/md";


export default function AnalyticsHeader({timeFilter, setTimeFilter}) {
    
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MdTrendingUp className="text-brand-500" /> Dashboard Estratégico
                </h1>
                <p className="text-text-secondary text-sm">Visão analítica de finanças, projetos e capacidade da equipe.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <MdFilterList className="text-text-muted text-xl" />
                <select 
                    value={timeFilter} 
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="bg-bg-surface border border-border-main text-text-primary rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                >
                    <option value="all">Todo o Período</option>
                    <option value="year">Este Ano</option>
                    <option value="month">Este Mês</option>
                    <option value="week">Esta Semana</option>
                </select>
            </div>
        </div>
    )
}
