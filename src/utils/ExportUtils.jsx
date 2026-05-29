import { toast } from "sonner";
import { formatCurrency } from "./FormatCurrency";

/**
 * Converte timestamp do Firebase ou string para Date
 */
const toDate = (value) => {
    if (!value) return null;
    if (value?.toDate && typeof value.toDate === 'function') return value.toDate();
    if (value instanceof Date) return value;
    return new Date(value);
};

/**
 * Formata a data para exibição no relatório
 */
const formatReportDate = (dateValue) => {
    const date = toDate(dateValue);
    if (!date || Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("pt-BR");
};

/**
 * Obtém o nome do cliente a partir do ID
 */
const getClientName = (clientId, clientMap) => {
    if (!clientId) return "—";
    
    return clientMap?.[clientId]?.name || clientMap?.[clientId]?.displayName || clientId;
};
/**
 * Exporta projetos para PDF
 * @param {Array} projects - Array de projetos a exportar
 * @param {String} fileName - Nome do arquivo a ser gerado
 */

export const exportProjectsToPDF = async (projects, fileName = "Relatório de Projetos", clientMap = {}) => {
    try {
        if (!projects || projects.length === 0) {
            toast.error("Nenhum projeto para exportar");
            return;
        }

        // Importação dinâmica do jsPDF
        const { jsPDF } = await import("jspdf");
        const autoTable = (await import("jspdf-autotable")).default;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;

        // Título
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.text(fileName, margin, margin + 5);

        // Data de geração
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, margin, margin + 12);

        // Preparar dados da tabela
        const tableData = projects.map((project) => [
            project.title || "—",
            getClientName(project.client, clientMap),
            project.status ? formatStatus(project.status) : "—",
            project.priority ? formatPriority(project.priority) : "—",
            formatReportDate(project.startDate),
            formatReportDate(project.expectedDeliveryDate),
            formatCurrency(project.totalValue || 0),
            formatCurrency(project.paidValue || 0),
        ]);

        // Criar tabela
        autoTable(doc, {
            head: [["Projeto", "Cliente", "Status", "Prioridade", "Início", "Entrega", "Valor Total", "Valor Pago"]],
            body: tableData,
            startY: margin + 18,
            margin: margin,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: "linebreak",
                halign: "left",
            },
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center",
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
            columnStyles: {
                2: { halign: "center" },
                3: { halign: "center" },
                4: { halign: "center" },
                5: { halign: "center" },
                6: { halign: "right" },
                7: { halign: "right" },
            },
        });

        // Rodapé com número de página
        const pageCount = doc.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${pageCount}`,
                pageWidth / 2,
                pageHeight - 5,
                { align: "center" }
            );
        }

        // Download
        doc.save(`${fileName}.pdf`);
        toast.success(`Relatório PDF gerado com sucesso!`);
    } catch (error) {
        console.error("Erro ao exportar PDF:", error);
        toast.error("Erro ao gerar PDF. Verifique o console para mais detalhes.");
    }
};

/**
 * Exporta projetos para Excel
 * @param {Array} projects - Array de projetos a exportar
 * @param {String} fileName - Nome do arquivo a ser gerado
 * @param {Object} clientMap - Mapa de clientes para converter ID em Nome
 */
export const exportProjectsToExcel = async (projects, fileName = "Relatório de Projetos", clientMap = {}) => {
    try {
        if (!projects || projects.length === 0) {
            toast.error("Nenhum projeto para exportar");
            return;
        }

        // Importação dinâmica do xlsx
        const XLSX = await import("xlsx");

        // Preparar dados
        const data = projects.map((project) => ({
            "Projeto": project.title || "—",
            "Cliente": getClientName(project.client, clientMap),
            "Status": project.status ? formatStatus(project.status) : "—",
            "Prioridade": project.priority ? formatPriority(project.priority) : "—",
            "Data Início": formatReportDate(project.startDate),
            "Data Entrega": formatReportDate(project.expectedDeliveryDate),
            "Valor Total": project.totalValue || 0,
            "Valor Pago": project.paidValue || 0,
            "Descrição": project.description || "—",
        }));

        // Criar workbook
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Projetos");

        // Ajustar largura das colunas
        const colWidths = [
            { wch: 25 },
            { wch: 25 },
            { wch: 15 },
            { wch: 12 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 40 },
        ];
        ws["!cols"] = colWidths;

        // Download
        XLSX.writeFile(wb, `${fileName}.xlsx`);
        toast.success(`Relatório Excel gerado com sucesso!`);
    } catch (error) {
        console.error("Erro ao exportar Excel:", error);
        toast.error("Erro ao gerar Excel. Verifique o console para mais detalhes.");
    }
};

/**
 * Formata o status do projeto para exibição
 */
const formatStatus = (status) => {
    const statusMap = {
        "concluido": "Concluído",
        "em_andamento": "Em Andamento",
        "suporte": "Em Suporte",
        "arquivado": "Arquivado",
    };
    return statusMap[status] || status;
};

/**
 * Formata a prioridade do projeto para exibição
 */
const formatPriority = (priority) => {
    const priorityMap = {
        "alta": "Alta",
        "media": "Média",
        "baixa": "Baixa",
    };
    return priorityMap[priority] || priority;
};
