import { FaCheck } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const PLANS = [
    {
        id: "FREE",
        name: "Trial Grátis",
        price: "R$ 0",
        period: "30 dias",
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
        price: "R$ 29,90",
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
        price: "R$ 49,90",
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
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1 mb-2">
                <h2 className="text-2xl font-black tracking-tight text-text-primary">
                    Escolha seu plano
                </h2>
                <p className="text-sm text-text-secondary">
                    Você pode mudar ou cancelar a qualquer momento
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {PLANS.map((plan) => (
                    <button
                        key={plan.id}
                        type="button"
                        onClick={() => onSelect(plan.id)}
                        className={`relative w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer
              ${
                  selected === plan.id
                      ? plan.highlight
                          ? "border-brand-500 bg-brand-500/10 shadow-[0_0_20px_rgba(26,215,111,0.15)]"
                          : "border-brand-500/60 bg-brand-500/5"
                      : "border-white/8 bg-white/2 hover:border-white/15"
              }`}
                    >
                        {plan.badge && (
                            <span
                                className="absolute -top-1.5 -right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                               bg-linear-to-r from-brand-600 to-brand-500 text-white shadow-[0_2px_10px_rgba(26,215,111,0.4)]"
                            >
                                <HiSparkles
                                    className="inline mr-0.5 mb-0.5"
                                    size={10}
                                />
                                {plan.badge}
                            </span>
                        )}

                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-text-primary text-sm">
                                    {plan.name}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    {plan.description}
                                </span>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                                <span
                                    className={`font-black text-base ${plan.highlight ? "text-brand-400" : "text-text-primary"}`}
                                >
                                    {plan.price}
                                </span>
                                <span className="text-[11px] text-text-secondary">
                                    {plan.period}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                            {plan.features.map((f) => (
                                <span
                                    key={f}
                                    className="flex items-center gap-1 text-[11px] text-text-secondary"
                                >
                                    <FaCheck
                                        size={8}
                                        className="text-brand-500 shrink-0"
                                    />
                                    {f}
                                </span>
                            ))}
                        </div>


                    </button>
                ))}
            </div>
        </div>
    );
}
