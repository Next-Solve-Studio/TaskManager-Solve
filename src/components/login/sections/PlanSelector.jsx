import { FaCheck } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useState } from "react";

const PLANS = [
    {
        id: "FREE",
        name: "Trial Grátis",
        price: { monthly: "R$ 0", annual: "R$ 0" },
        period: "/30 dias",
        description: "Experimente sem compromisso",
        features: [
            "Até 25 usuários",
            "Até 5 projetos ativos",
            "Até 5 clientes",
            "Suporte por e-mail",
        ],
        highlight: false,
        badge: null,
    },
    {
        id: "BASIC",
        name: "Basic",
        price: { monthly: "R$ 29,90", annual: "R$ 24,90" },
        period: "/mês",
        description: "Para pequenas equipes",
        features: [
            "Até 100 usuários",
            "Até 100 projetos ativos",
            "Até 100 clientes",
            "Relatórios básicos",
            "Suporte prioritário",
        ],
        highlight: false,
        badge: null,
    },
    {
        id: "PRO",
        name: "Pro",
        price: { monthly: "R$ 49,90", annual: "R$ 39,90" },
        period: "/mês",
        description: "Para equipes que escalam",
        features: [
            "Usuários ilimitados",
            "Projetos ilimitados",
            "Clientes ilimitados",
            "Analytics avançado",
            "Suporte 24/7",
        ],
        highlight: true,
        badge: "Mais Popular",
    },
];

export default function PlanSelector({ selected, onSelect }) {
    const [billing, setBilling] = useState("monthly");

    return (
        <div className="flex flex-col gap-6 w-full">

            {/* Cabeçalho */}
            <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-2xl font-black tracking-tight text-text-primary">
                    Escolha seu plano
                </h2>
                <p className="text-sm text-text-secondary">
                    Você pode mudar ou cancelar a qualquer momento
                </p>
            </div>

            {/* Toggle Mensal / Anual */}
            <div className="flex items-center justify-center gap-1 bg-bg-card border border-border-main2 rounded-full p-1 w-fit mx-auto">
                <button
                    type="button"
                    onClick={() => setBilling("monthly")}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        billing === "monthly"
                            ? "bg-bg-surface text-text-primary shadow"
                            : "text-text-muted hover:text-text-secondary"
                    }`}
                >
                    Mensal
                </button>
                <button
                    type="button"
                    onClick={() => setBilling("annual")}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        billing === "annual"
                            ? "bg-bg-surface text-text-primary shadow"
                            : "text-text-muted hover:text-text-secondary"
                    }`}
                >
                    Anual
                    <span className="text-[10px] font-bold text-brand-500 bg-brand-500/10 px-1.5 py-0.5 rounded-full">
                        -20%
                    </span>
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-3 mb-10 gap-4 w-full max-w-3xl mx-auto">
                {PLANS.map((plan) => {
                    const isSelected = selected === plan.id;
                    const isPro = plan.highlight;

                    return (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => onSelect(plan.id)}
                            className={`relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden text-left cursor-pointer w-full min-h-110
                                ${isPro && isSelected
                                    ? "border-purple-500 shadow-[0_0_32px_rgba(168,85,247,0.25)]"
                                    : isPro
                                    ? "border-purple-500/40 hover:border-purple-500/70 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                                    : isSelected
                                    ? "border-brand-500 shadow-[0_0_24px_rgba(26,215,111,0.2)]"
                                    : "border-border-main2 hover:border-white/20"
                                }`}
                        >
                            {/* Badge topo */}
                            {isPro ? (
                                <div className="bg-linear-to-r from-purple-700 to-purple-500 px-4 py-2 flex items-center justify-center gap-1.5">
                                    <HiSparkles size={13} className="text-white/90" />
                                    <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                                        {plan.badge}
                                    </span>
                                </div>
                            ) : (
                                <div className="h-[34px]" />
                            )}

                            {/* Badge de selecionado — sobreposição no canto */}
                            {isSelected && (
                                <div className={`absolute top-[42px] right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                                    ${isPro
                                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                        : "bg-brand-500/15 text-brand-400 border border-brand-500/25"
                                    }`}
                                >
                                    <FaCheck size={7} />
                                    Selecionado
                                </div>
                            )}

                            {/* Corpo */}
                            <div className="flex flex-col flex-1 gap-4 p-5 bg-bg-card">

                                {/* Nome e descrição */}
                                <div className="flex flex-col gap-1 mt-1">
                                    <h3 className={`text-xl font-black tracking-tight ${
                                        isPro ? "text-purple-400" : "text-text-primary"
                                    }`}>
                                        {plan.name}
                                    </h3>
                                    <p className="text-xs text-text-muted leading-snug">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Preço */}
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-3xl font-black tracking-tight ${
                                        isPro ? "text-purple-400" : "text-text-primary"
                                    }`}>
                                        {plan.price[billing]}
                                    </span>
                                    <span className="text-xs text-text-muted font-medium">
                                        {plan.period}
                                    </span>
                                </div>

                                <hr className="border-border-main2" />

                                {/* Features */}
                                <ul className="flex flex-col gap-2.5">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-xs text-text-secondary">
                                            <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full shrink-0 ${
                                                isPro ? "bg-purple-500/20" : "bg-brand-500/15"
                                            }`}>
                                                <FaCheck
                                                    size={7}
                                                    className={isPro ? "text-purple-400" : "text-brand-500"}
                                                />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Overlay sutil quando selecionado */}
                            {isSelected && (
                                <div className={`absolute inset-0 pointer-events-none rounded-2xl ${
                                    isPro
                                        ? "bg-linear-to-b from-purple-500/5 to-transparent"
                                        : "bg-linear-to-b from-brand-500/5 to-transparent"
                                }`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}