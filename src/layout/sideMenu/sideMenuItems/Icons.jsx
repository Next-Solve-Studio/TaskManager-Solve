'use client'

import { FiGrid, FiUsers, FiFolder, FiLayers, FiCheckSquare, FiSettings  } from "react-icons/fi";


export const menuItems = [
  
    {
        icon:FiUsers,
        label:'Usuários',
        href: "/"

    },
    {
        icon:FiGrid,
        label:'Visão Geral',
        href: "/"
    },
    {
        icon:FiLayers ,
        label:'Lista de Projetos',
        href: "/"
    },
    {
        icon: FiFolder,
        label:'Meus Projetos',
        href: "/"
    },
    {
        icon:FiCheckSquare,
        label:'Tasks',
        href: "/"
    },
    {
        icon:FiSettings,
        label:"Configurações",
        href: "/"
    }
]