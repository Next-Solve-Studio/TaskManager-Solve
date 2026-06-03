"use client";

import {
    FiBarChart2,
    FiBriefcase,
    FiCalendar,
    FiGrid,
    FiLayers,
    FiSettings,
    FiUsers,
} from "react-icons/fi";
import { MdOutlineTaskAlt } from "react-icons/md";
import { ROLES } from "@/lib/roles";

const { ADMIN, PROJECT_LEAD, DEVELOPER, MASTER } = ROLES;

export const menuItems = [
    {
        icon: FiGrid,
        label: "Visão Geral",
        href: "/",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER, MASTER],
    },
    {
        icon: FiUsers,
        label: "Usuários",
        href: "/users",
        roles: [ADMIN, MASTER],
    },
    {
        icon: FiBarChart2,
        label: "Análise Geral",
        href: "/analytics",
        roles: [ADMIN, MASTER],
    },
    {
        icon: FiLayers,
        label: "Lista de Projetos",
        href: "/projects",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER, MASTER],
    },
    {
        icon: MdOutlineTaskAlt,
        label: "Tarefas",
        href: "/tasks",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER, MASTER],
    },
    {
        icon: FiCalendar,
        label: "Minha Agenda",
        href: "/schedule",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER, MASTER],
    },
    {
        icon: FiBriefcase,
        label: "Clientes",
        href: "/clients",
        roles: [ADMIN, PROJECT_LEAD, MASTER],
    },
    {
        icon: FiSettings,
        label: "Configurações",
        href: "/settings",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER, MASTER],
    },
];
