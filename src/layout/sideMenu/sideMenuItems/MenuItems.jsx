"use client";

import {
    FiBriefcase,
    FiCalendar,
    FiGrid,
    FiLayers,
    FiSettings,
    FiUsers,
} from "react-icons/fi";
import { MdOutlineTaskAlt } from "react-icons/md";
import { ROLES } from "@/lib/roles";

const { ADMIN, PROJECT_LEAD, DEVELOPER } = ROLES;

export const menuItems = [
    {
        icon: FiGrid,
        label: "Visão Geral",
        href: "/",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER],
    },
    {
        icon: FiUsers,
        label: "Usuários",
        href: "/users",
        roles: [ADMIN],
    },
    {
        icon: FiLayers,
        label: "Lista de Projetos",
        href: "/projects",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER],
    },
    {
        icon: MdOutlineTaskAlt,
        label: "Tarefas",
        href: "/tasks",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER],
    },
    {
        icon: FiCalendar,
        label: "Minha Agenda",
        href: "/schedule",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER],
    },
    {
        icon: FiBriefcase,
        label: "Clientes",
        href: "/clients",
        roles: [ADMIN, PROJECT_LEAD],
    },
    {
        icon: FiSettings,
        label: "Configurações",
        href: "/settings",
        roles: [ADMIN, PROJECT_LEAD, DEVELOPER],
    },
];
