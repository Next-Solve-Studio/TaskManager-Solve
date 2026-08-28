"use client";
import { useCustomFields } from "@/context/CustomFieldsContext";
import { MdLabel } from "react-icons/md";

/**
 * Renderiza os campos personalizados salvos em `entity.customData`.
 * @param {{ entity: "client" | "project" | "task", data: object, settings?: object }} props
 *  - `entity`:   tipo da entidade (para buscar os campos corretos do contexto)
 *  - `data`:     o objeto da entidade (project, client ou task) que contém `customData`
 *  - `settings`: objeto de configuração de visualização do card (ex: { showCustomField_abc123: false })
 */
export default function CustomFieldsDisplay({ entity, data, settings }) {
    const { clientFields, projectFields, taskFields, userFields } = useCustomFields();

    const fieldsMap = {
        client: clientFields,
        project: projectFields,
        task: taskFields,
        user: userFields,
    };

    const fields = fieldsMap[entity] || [];
    const customData = data?.customData;

    if (!customData || fields.length === 0) return null;

    // Filtra apenas os campos que possuem valor preenchido E estão visíveis nas settings
    const filledFields = fields.filter((f) => {
        const val = customData[f.id];
        if (val === undefined || val === null || val === "") return false;

        // Se houver settings, verifica se o campo está marcado como visível
        // Por padrão, campos personalizados são visíveis (true) quando não há configuração
        const settingKey = `showCustomField_${f.id}`;
        if (settings && settings[settingKey] === false) return false;

        return true;
    });

    if (filledFields.length === 0) return null;

    return (
        <>
            <div className="h-px bg-border-main" />
            <div className="flex flex-col gap-1.5">
                {filledFields.map((field) => {
                    const value = customData[field.id];
                    return (
                        <div key={field.id} className="flex items-start gap-1.5">
                            <MdLabel size={12} className="text-text-muted shrink-0 mt-[2px]" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider leading-none mb-0.5">
                                    {field.name}
                                </span>
                                <span className="text-[12px] text-text-secondary leading-snug break-words">
                                    {value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
