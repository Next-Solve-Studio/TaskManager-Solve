'use client'
import { useState } from "react";
import { MdDownload } from "react-icons/md";
import { exportProjectsToExcel, exportProjectsToPDF } from "@/utils/ExportUtils";

export function StatCard({ 
    icon: Icon,
    label,
    value,
    color,
    bg,
    border,
    status,
    projects = [],
    clientMap = {}
}) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        try {
            setIsExporting(true);
            const filteredProjects = status 
                ? projects.filter(p => p.status === status)
                : projects;
            await exportProjectsToPDF(filteredProjects, `${label} - Relatório`, clientMap);
        } catch (error) {
            console.error("Erro ao exportar PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setIsExporting(true);
            const filteredProjects = status 
                ? projects.filter(p => p.status === status)
                : projects;
            await exportProjectsToExcel(filteredProjects, `${label} - Relatório`, clientMap);
        } catch (error) {
            console.error("Erro ao exportar Excel:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const exportButtons = () => {
        if (projects.length > 0) {
            return (
                <div className="flex gap-2 mt-2">
                    <button
                        type="button"
                        onClick={handleExportPDF}
                        disabled={isExporting || value === 0}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{
                            background: `${color}15`,
                            color: color,
                            border: `1px solid ${color}30`,
                            opacity: isExporting || value === 0 ? 0.5 : 1,
                            cursor: isExporting || value === 0 ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isExporting && value !== 0) {
                                e.currentTarget.style.background = `${color}25`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${color}15`;
                        }}
                        title={value === 0 ? "Nenhum item para exportar" : "Exportar como PDF"}
                    >
                        <MdDownload size={14} />
                        <span>PDF</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleExportExcel}
                        disabled={isExporting || value === 0}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{
                            background: `${color}15`,
                            color: color,
                            border: `1px solid ${color}30`,
                            opacity: isExporting || value === 0 ? 0.5 : 1,
                            cursor: isExporting || value === 0 ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isExporting && value !== 0) {
                                e.currentTarget.style.background = `${color}25`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${color}15`;
                        }}
                        title={value === 0 ? "Nenhum item para exportar" : "Exportar como Excel"}
                    >
                        <MdDownload size={14} />
                        <span>Excel</span>
                    </button>
                </div>
            )
        }
    }
    

    return (
        <div
            className="shadow-md select-none relative flex flex-col gap-3 p-5 rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            style={{
                background: `linear-gradient(to bottom right, ${bg}, var(--bg-card))`,
                border: `1px solid ${border}`,
                boxShadow: `0 4px 20px ${color}18, 0 1px 4px ${color}10`
            }}
        >
            {/* ÍCONE FIXO NO CANTO SUPERIOR DIREITO */}
            <div className="absolute top-4 right-4">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ background: `${color}20` }}
                >
                    <Icon style={{ color, fontSize: 20 }} />
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="pr-14">
                <p className="text-3xl font-bold text-text-primary tabular-nums indent">
                    {value}
                </p>
                <p className="text-sm text-text-secondary mt-0.5">{label}</p>
            </div>


            {/* BOTÕES DE EXPORTAÇÃO */}
            {exportButtons()}
        </div>
    );
}
