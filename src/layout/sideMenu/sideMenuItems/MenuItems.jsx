'use client'

import { FiGrid, FiUsers, FiFolder, FiLayers, FiCheckSquare, FiSettings  } from "react-icons/fi";
import {ROLES} from '@/lib/roles'
const { ADMIN, PROJECT_LEAD, DEVELOPER } = ROLES

export const menuItems = [
  
    {
        icon:FiUsers,
        label:'Usuários',
        href: "/",
        roles: [ADMIN]

    },
    {
        icon:FiGrid,
        label:'Visão Geral',
        href: "/",
        roles: [ADMIN, PROJECT_LEAD]
    },
    {
        icon:FiLayers ,
        label:'Lista de Projetos',
        href: "/projects",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER]
    },
    {
        icon: FiFolder,
        label:'Meus Projetos',
        href: "/",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER]
    },
    {
        icon:FiCheckSquare,
        label:'Tasks',
        href: "/",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER]
    },
    {
        icon:FiSettings,
        label:"Configurações",
        href: "/",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER]
    }
]