"use client";
import { useRef } from "react";
import { MdExtension, MdFileDownload, MdFileUpload, MdOutlineTaskAlt, MdVisibility } from "react-icons/md";
import CanDo from "@/components/auth/CanDo";
import { AddButton } from "@/components/ui/Buttons/Buttons";

const iconButtonClass =
    "h-10 px-3 bg-bg-surface border border-border-main2 rounded-xl text-text-muted hover:text-brand-500 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-center gap-2 text-[13px] font-semibold";

export default function TasksHeader({
    handleOpenCreate,
    handleOpenSettings,
    handleOpenCustomFields,
    handleDownloadTemplate,
    handleImportFile,
    tasks,
}) {
    const fileInputRef = useRef(null);

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) handleImportFile(file);
    };

    return (
        <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <MdOutlineTaskAlt className="text-brand-500 text-lg" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                        Gestão de Tarefas
                    </span>
                </div>
                <h1 className="text-[26px] font-extrabold text-text-primary m-0">
                    Tarefas
                </h1>
                <p className="text-[13px] text-text-muted mt-1">
                    {tasks.length} tarefa{tasks.length === 1 ? "" : "s"} no
                    sistema
                </p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
                <CanDo permission="canManageProjectCardView">
                    <button
                        type="button"
                        onClick={handleOpenSettings}
                        className={iconButtonClass}
                        title="Configurar visualização global"
                    >
                        <MdVisibility size={20} />
                    </button>
                </CanDo>
                <CanDo permission="canManageCustomFields">
                    <button
                        type="button"
                        onClick={handleOpenCustomFields}
                        className={iconButtonClass}
                        title="Gerenciar campos personalizados"
                    >
                        <MdExtension size={20} />
                    </button>
                </CanDo>
                <CanDo permission="canCreateTasks">
                    <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className={iconButtonClass}
                        title="Baixar modelo de planilha"
                    >
                        <MdFileDownload size={20} />
                        <span className="hidden sm:inline">Modelo</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={iconButtonClass}
                        title="Importar planilha preenchida"
                    >
                        <MdFileUpload size={20} />
                        <span className="hidden sm:inline">Importar</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx"
                        hidden
                        onChange={onFileChange}
                    />
                    <AddButton label="Nova Task" action={handleOpenCreate} />
                </CanDo>
            </div>
        </div>
    );
}
