import { PRIORITY_MAP, STATUS_MAP } from "@/components/ui/badges/StatusBadge";

export const MAX_IMPORT_ROWS = 200;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const COLUMNS = [
    { key: "title", header: "Título *", width: 32 },
    { key: "project", header: "Projeto *", width: 28 },
    { key: "description", header: "Descrição", width: 40 },
    { key: "assignees", header: "Responsáveis", width: 32 },
    { key: "startDate", header: "Início", width: 14 },
    { key: "endDate", header: "Fim", width: 14 },
    { key: "priority", header: "Prioridade", width: 14 },
    { key: "status", header: "Status", width: 20 },
    { key: "solution", header: "Solução", width: 36 },
    { key: "checklist", header: "Checklist", width: 40 },
];
const REQUIRED_KEYS = ["title", "project"];

const normalize = (value) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\*/g, "")
        .trim()
        .toLowerCase();

const splitList = (text, separator) =>
    text.split(separator).map((item) => item.trim()).filter(Boolean);

function cellText(value) {
    if (value == null) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object") {
        if (Array.isArray(value.richText)) return value.richText.map((r) => r.text).join("");
        if ("result" in value) return cellText(value.result);
        if ("text" in value) return cellText(value.text);
        return "";
    }
    return String(value);
}

// "" = vazio, null = inválido, "yyyy-MM-dd" = ok
function toIsoDate(value) {
    if (value == null || value === "") return "";
    const raw =
        typeof value === "object" && !(value instanceof Date) && "result" in value
            ? value.result
            : value;

    // exceljs devolve datas das células em UTC
    if (raw instanceof Date) {
        return Number.isNaN(raw.getTime()) ? null : raw.toISOString().slice(0, 10);
    }

    const text = cellText(raw).trim();
    if (!text) return "";

    const br = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const [y, m, d] = br ? [br[3], br[2], br[1]] : iso ? [iso[1], iso[2], iso[3]] : [];
    if (!y) return null;

    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    const valid =
        date.getUTCFullYear() === Number(y) &&
        date.getUTCMonth() === Number(m) - 1 &&
        date.getUTCDate() === Number(d);
    return valid ? date.toISOString().slice(0, 10) : null;
}

// Map<nomeNormalizado, Set<id>> — o Set evita contar o mesmo item duas vezes (ex.: nome igual ao e-mail)
function indexBy(items, getKeys) {
    const map = new Map();
    for (const item of items) {
        for (const key of getKeys(item).map(normalize).filter(Boolean)) {
            const ids = map.get(key) ?? new Set();
            ids.add(item.id);
            map.set(key, ids);
        }
    }
    return map;
}

const enumLookup = (map) =>
    Object.fromEntries(
        Object.entries(map).flatMap(([key, { label }]) => [
            [normalize(label), key],
            [normalize(key), key],
        ]),
    );

function saveBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export async function downloadTasksTemplate({ projects }) {
    const { default: ExcelJS } = await import("exceljs");
    const wb = new ExcelJS.Workbook();

    const ws = wb.addWorksheet("Tarefas");
    ws.columns = COLUMNS.map(({ key, header, width }) => ({ key, header, width }));
    ws.views = [{ state: "frozen", ySplit: 1 }];
    const headerRow = ws.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF19CA68" } };
    ws.getColumn("startDate").numFmt = "dd/mm/yyyy";
    ws.getColumn("endDate").numFmt = "dd/mm/yyyy";

    const help = wb.addWorksheet("Instruções");
    help.columns = [{ width: 18 }, { width: 95 }];
    const helpRows = [
        ["Como usar", ""],
        ["Geral", 'Preencha uma tarefa por linha na aba "Tarefas". Não apague nem renomeie o cabeçalho (linha 1).'],
        ["Título *", "Obrigatório."],
        ["Projeto *", "Obrigatório. Escolha na lista (nome exato do projeto)."],
        ["Responsáveis", "Nomes (ou e-mails) dos usuários, separados por vírgula. Ex.: Maria Silva, joao@empresa.com"],
        ["Início / Fim", "Formato dd/mm/aaaa. O Fim não pode ser antes do Início."],
        ["Prioridade", "Escolha na lista. Vazio = Média."],
        ["Status", "Escolha na lista. Vazio = Em Andamento."],
        ["Checklist", "Itens separados por ponto e vírgula (;) ou por quebra de linha (Alt+Enter)."],
        ["Exemplo", "Título: Corrigir login | Projeto: (da lista) | Responsáveis: Maria Silva | Início: 10/11/2026 | Fim: 15/11/2026 | Prioridade: Alta | Checklist: Reproduzir bug; Corrigir; Testar"],
        ["Limite", `Até ${MAX_IMPORT_ROWS} tarefas por importação.`],
    ];
    for (const row of helpRows) help.addRow(row);
    help.getRow(1).font = { bold: true };

    const lists = wb.addWorksheet("Listas", { state: "hidden" });
    const projectNames = projects.map((p) => p.title).filter(Boolean);
    const priorityLabels = Object.values(PRIORITY_MAP).map((p) => p.label);
    const statusLabels = Object.values(STATUS_MAP).map((s) => s.label);
    [projectNames, priorityLabels, statusLabels].forEach((values, col) => {
        values.forEach((value, i) => {
            lists.getCell(i + 1, col + 1).value = value;
        });
    });

    const addListValidation = (columnKey, listColumn, count) => {
        if (!count) return;
        const letter = ws.getColumn(columnKey).letter;
        for (let row = 2; row <= MAX_IMPORT_ROWS + 1; row++) {
            ws.getCell(`${letter}${row}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`Listas!$${listColumn}$1:$${listColumn}$${count}`],
                showErrorMessage: true,
                errorTitle: "Valor inválido",
                error: "Escolha uma opção da lista.",
            };
        }
    };
    addListValidation("project", "A", projectNames.length);
    addListValidation("priority", "B", priorityLabels.length);
    addListValidation("status", "C", statusLabels.length);

    const buffer = await wb.xlsx.writeBuffer();
    saveBlob(new Blob([buffer], { type: XLSX_MIME }), "Modelo de Tarefas.xlsx");
}

export async function parseTasksSpreadsheet(file, { projects, users }) {
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
        throw new Error("Envie um arquivo .xlsx (baixe o modelo pelo botão ao lado).");
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error("Arquivo maior que 2MB.");
    }

    const { default: ExcelJS } = await import("exceljs");
    const wb = new ExcelJS.Workbook();
    try {
        await wb.xlsx.load(await file.arrayBuffer());
    } catch {
        throw new Error("Não foi possível ler o arquivo. Use o modelo .xlsx baixado pelo sistema.");
    }

    const ws = wb.getWorksheet("Tarefas") ?? wb.worksheets[0];
    if (!ws) throw new Error("A planilha está vazia.");

    const colByKey = {};
    ws.getRow(1).eachCell((cell, colNumber) => {
        const found = COLUMNS.find((c) => normalize(c.header) === normalize(cellText(cell.value)));
        if (found) colByKey[found.key] = colNumber;
    });
    if (REQUIRED_KEYS.some((key) => !colByKey[key])) {
        throw new Error("A planilha não segue o modelo (faltam as colunas Título e Projeto).");
    }

    const projectsIndex = indexBy(projects, (p) => [p.title]);
    const usersIndex = indexBy(users, (u) => [u.name, u.email]);
    const priorityLookup = enumLookup(PRIORITY_MAP);
    const statusLookup = enumLookup(STATUS_MAP);

    const tasks = [];
    const errors = [];

    ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const raw = Object.fromEntries(
            COLUMNS.map(({ key }) => [key, colByKey[key] ? row.getCell(colByKey[key]).value : null]),
        );
        if (COLUMNS.every(({ key }) => !cellText(raw[key]).trim())) return;

        const messages = [];

        const title = cellText(raw.title).trim();
        if (!title) messages.push("Título obrigatório");

        let projectId = "";
        const projectName = cellText(raw.project).trim();
        if (!projectName) {
            messages.push("Projeto obrigatório");
        } else {
            const ids = projectsIndex.get(normalize(projectName));
            if (!ids) messages.push(`Projeto "${projectName}" não encontrado`);
            else if (ids.size > 1) messages.push(`Existe mais de um projeto chamado "${projectName}"`);
            else projectId = [...ids][0];
        }

        const assignedTo = [];
        for (const name of splitList(cellText(raw.assignees), /[,;\n]/)) {
            const ids = usersIndex.get(normalize(name));
            if (!ids) messages.push(`Responsável "${name}" não encontrado`);
            else if (ids.size > 1) messages.push(`Mais de um usuário chamado "${name}" (use o e-mail)`);
            else assignedTo.push([...ids][0]);
        }

        const startDate = toIsoDate(raw.startDate);
        const endDate = toIsoDate(raw.endDate);
        if (startDate === null) messages.push("Data de início inválida (use dd/mm/aaaa)");
        if (endDate === null) messages.push("Data de fim inválida (use dd/mm/aaaa)");
        if (startDate && endDate && endDate < startDate) messages.push("Fim deve ser após o início");

        const priorityText = cellText(raw.priority).trim();
        const priority = priorityText ? priorityLookup[normalize(priorityText)] : "media";
        if (!priority) messages.push(`Prioridade "${priorityText}" inválida`);

        const statusText = cellText(raw.status).trim();
        const status = statusText ? statusLookup[normalize(statusText)] : "em_andamento";
        if (!status) messages.push(`Status "${statusText}" inválido`);

        if (messages.length > 0) {
            errors.push({ row: rowNumber, title, messages });
            return;
        }

        tasks.push({
            row: rowNumber,
            data: {
                title,
                description: cellText(raw.description).trim(),
                projectId,
                assignedTo,
                startDate: startDate || "",
                endDate: endDate || "",
                priority,
                status,
                solution: cellText(raw.solution).trim(),
                checklist: splitList(cellText(raw.checklist), /[;\n]/).map((text, i) => ({
                    id: `${Date.now()}-${i}`,
                    text,
                    done: false,
                })),
                customData: {},
            },
        });
    });

    if (tasks.length + errors.length > MAX_IMPORT_ROWS) {
        throw new Error(`A planilha tem mais de ${MAX_IMPORT_ROWS} tarefas. Divida em mais de um arquivo.`);
    }

    return { fileName: file.name, tasks, errors };
}
