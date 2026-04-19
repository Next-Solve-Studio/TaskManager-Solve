'use client'

import { useMemo } from "react"
import { Avatar } from "@/utils/AvatarBadge"
import { MdGroup } from "react-icons/md"
import { Tooltip } from "@mui/material"
export default function CardDevs({project, usersMap}) {

    // busca o objeto do usuário correspondendo pelo usersMap
    const developers = useMemo(() =>
        (project.developers || [])
            .map((uid) => usersMap[uid])
            .filter(Boolean), //remove os itens que são undefined ou falsos, fica só os users que existem no banco
            [project.developers, usersMap] 
            // evita renderizamentos desnecessários com useMemo, agora so renderiza se as dependencias mudarem
    )
    return (
        <>
            {developers.length > 0 && (
                <div className="flex items-center gap-1.5">
                    <MdGroup
                        size={13}
                        style={{ color: "#6b7280", flexShrink: 0 }}
                    />
                    <div className="flex items-center">
                        {developers.slice(0, 4).map((dev, i) => (
                            <Tooltip key={dev.id} title={dev.name} arrow>
                                <div
                                    style={{
                                        marginLeft: i === 0 ? 0 : -8,
                                        zIndex: developers.length - i,
                                    }}
                                >
                                    <Avatar
                                        name={dev.name}
                                        uid={dev.id}
                                        size={26}
                                    />
                                </div>
                            </Tooltip>
                        ))}
                        {developers.length > 4 && (
                            <span className="-ml-2 w-6.5 h-6.5  rounded-[50%] flex items-center justify-center text-[9px] font-bold
                                    text-font-gray border-2 border-bg-card bg-[#FFFFFF14]">
                                +{developers.length - 4}
                            </span>
                        )}
                    </div>
                    <span className="text-[11px] text-font-gray2 ml-1">
                        {developers.length} dev
                        {developers.length !== 1 ? "s" : ""}
                    </span>
                </div>
            )}
        </>
        
    )
}
