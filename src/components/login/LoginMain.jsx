"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";
import LoginForm from "./sections/LoginForm";
import RegisterForm from "./sections/RegisterForm";

export default function LoginMain() {
    const [haveAccount, setHaveAccount] = useState(true);
    const { systemSettings } = useSettings();

    const allowRegistration = systemSettings?.allowRegistration ?? true;

    // caso esteja ativado a regra de proibir novos users, mostra a mensagem abaixo
    const toggleForm = (value) => {
        if (!value && !allowRegistration) {
            toast.error(
                "O cadastro de novos usuários está temporariamente desativado.",
            );
            return;
        }
        setHaveAccount(value);
    };

    return (
        <>
            <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -40px) scale(1.08); }
                    66% { transform: translate(-20px, 20px) scale(0.95); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    40% { transform: translate(-35px, 30px) scale(1.1); }
                    70% { transform: translate(25px, -25px) scale(0.92); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    30% { transform: translate(20px, 35px) scale(1.05); }
                    65% { transform: translate(-30px, -15px) scale(0.97); }
                }
                @keyframes gridMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 40px; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .brand-shimmer {
                    background: linear-gradient(
                        90deg,
                        #1ad76f 0%,
                        #22d3ee 30%,
                        #ffffff 50%,
                        #22d3ee 70%,
                        #1ad76f 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s linear infinite;
                }
                .form-panel-animate {
                    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .visual-animate {
                    animation: fadeIn 0.8s ease both;
                }
                .orb-1 { animation: float1 9s ease-in-out infinite; }
                .orb-2 { animation: float2 12s ease-in-out infinite; }
                .orb-3 { animation: float3 7s ease-in-out infinite; }
                .grid-bg {
                    background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: gridMove 8s linear infinite;
                }
            `}</style>

            <main className="flex flex-row min-h-screen w-full overflow-hidden">

                <div className="relative z-10 flex flex-col items-center justify-center
                                w-full md:w-[45%] lg:w-[38%] min-h-screen
                                bg-bg-main px-6 py-12 shrink-0">

                    <div className="absolute top-0 left-0 right-0 h-0.5
                                    bg-linear-to-r from-transparent via-brand-500 to-transparent opacity-60" />

                    <div className="form-panel-animate w-full max-w-105">
                        {haveAccount ? (
                            <LoginForm
                                setHaveAccount={toggleForm}
                                haveAccount={haveAccount}
                                allowRegistration={allowRegistration}
                            />
                        ) : (
                            <RegisterForm
                                setHaveAccount={toggleForm}
                                haveAccount={haveAccount}
                            />
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px
                                    bg-linear-to-r from-transparent via-border-main2 to-transparent" />
                </div>

                <div className="visual-animate hidden md:flex flex-col items-center justify-center
                                relative flex-1 overflow-hidden
                                bg-[#030d06]">


                    <div className="grid-bg absolute inset-0 opacity-100" />

                    <div className="orb-1 absolute top-[10%] left-[15%] w-105 h-105 rounded-full
                                    bg-brand-500/20 blur-[100px] pointer-events-none" />
                    <div className="orb-2 absolute bottom-[10%] right-[10%] w-125 h-125 rounded-full
                                    bg-cyan-400/15 blur-[120px] pointer-events-none" />
                    <div className="orb-3 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2
                                    w-75 h-75 rounded-full
                                    bg-brand-600/10 blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center max-w-xl">
                        <div className="relative w-52 h-52 mb-2">
                            <div className="absolute inset-0 rounded-full border border-brand-500/20" />
                            <div className="absolute inset-4 rounded-full border border-cyan-400/15" />
                            <div className="absolute inset-8 rounded-full border border-brand-500/25
                                            shadow-[0_0_40px_#1ad76f25,inset_0_0_40px_#1ad76f10]" />
                            <div className="absolute inset-12 rounded-full
                                            bg-linear-to-br from-brand-500/30 to-cyan-400/20
                                            shadow-[0_0_60px_#1ad76f40]
                                            flex items-center justify-center">
                                <div className="w-10 h-10 rounded-xl rotate-45
                                                bg-linear-to-br from-brand-500 to-cyan-400
                                                shadow-[0_0_24px_#1ad76f80]" />
                            </div>
                            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                <div
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <>
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full"
                                    style={{
                                        background: i % 2 === 0 ? "#1ad76f" : "#22d3ee",
                                        boxShadow: `0 0 8px ${i % 2 === 0 ? "#1ad76f" : "#22d3ee"}`,
                                        top: "50%",
                                        left: "50%",
                                        transform: `rotate(${deg}deg) translateX(96px) translateY(-50%)`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none">
                                <span className="brand-shimmer">TaskManager</span>
                            </h1>
                            <p className="text-white/55 text-base lg:text-lg font-light leading-relaxed max-w-sm mx-auto">
                                Gerencie projetos, organize equipes e acompanhe
                                entregas — tudo em um só lugar.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {["Seguro", "Rápido", "Confiável"].map((tag) => (
                                <span key={tag}
                                    className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase
                                               border border-brand-500/25 text-brand-400/80
                                               bg-brand-500/5 backdrop-blur-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-6 right-6 w-24 h-24 border border-white/5 rounded-2xl rotate-12" />
                    <div className="absolute bottom-10 left-8 w-16 h-16 border border-brand-500/15 rounded-xl -rotate-6" />
                    <div className="absolute top-1/3 right-8 w-1 h-24 bg-linear-to-b from-transparent via-brand-500/30 to-transparent rounded-full" />
                </div>
            </main>
        </>
    );
}
