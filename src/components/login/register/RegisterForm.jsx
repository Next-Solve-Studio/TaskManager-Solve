"use client";
import { CircularProgress } from "@mui/material";
import { FaArrowLeft, FaBuilding } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { MdCreditCard } from "react-icons/md";
import CreditCardForm from "@/components/billing/CreditCardForm";
import TermsGateModal from "@/components/login/modals/TermsGateModal";
import PlanSelector from "../sections/PlanSelector";
import CardConfirmation from "./sections/CardConfirmation";
import Form from "./sections/Form";
import PixSuccess from "./sections/PixSucess";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export default function RegisterForm({ setHaveAccount, onStepChange }) {
    const {
        loading,
        seePassword,
        setSeePassword,
        step,
        selectedPlan,
        setSelectedPlan,
        billingCycle,
        setBillingCycle,
        paymentChoice,
        setPaymentChoice,
        confirmingCard,
        pixData,
        pixAppKey,
        termsOpen,
        setTermsOpen,
        isFreePlan,
        documentValue,
        savedFormData,
        register,
        errors,
        setValue,
        handleSubmit,
        changeStep,
        doRegister,
        handlePixRenew,
        onCompanyDataSubmit,
        handleAcceptTerms,
    } = useRegisterForm({ onStepChange });
    

    if (pixData) return <PixSuccess pixData={pixData} appKey={pixAppKey} onRenew={handlePixRenew} />;

    if (confirmingCard) return <CardConfirmation appKey={pixAppKey} />;

    if (step === 1) {
        return (
            <div className="flex flex-col gap-6 w-full">
                <div className="w-full">
                    <PlanSelector selected={selectedPlan} onSelect={setSelectedPlan} billing={billingCycle} onBillingChange={setBillingCycle} />
                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={() => changeStep(2)}
                            className="h-12 w-full max-w-85 mx-auto rounded-xl font-bold text-base tracking-wide text-white bg-linear-to-r bg-brand-600 hover:bg-brand-700 shadow-[0_4px_24px_rgba(26,215,111,0.25)] cursor-pointer transition-all duration-150 text-shadow-lg"
                        >
                            Continuar com {selectedPlan === "FREE" ? "Trial Grátis" : `Plano ${selectedPlan}`}
                        </button>
                        <button
                            type="button"
                            className="text-sm text-text-muted w-full max-w-45 mx-auto hover:text-brand-500 transition-colors duration-150 text-center cursor-pointer"
                            onClick={() => setHaveAccount(true)}
                        >
                            Já tem uma conta?{" "}
                            <span className="text-brand-500 font-semibold underline underline-offset-2">Entrar</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        if (paymentChoice === "CARD") {
            return (
                <div className="flex flex-col gap-5 w-full">
                    <button
                        type="button"
                        onClick={() => setPaymentChoice(null)}
                        className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                    >
                        <FaArrowLeft size={10} /> Voltar
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-text-primary">Pagamento com Cartão</h2>
                        <p className="text-sm text-text-muted">
                            Plano {selectedPlan} · R$ {selectedPlan === "BASIC" ? "29,90" : "49,90"}/mês
                        </p>
                    </div>
                    <CreditCardForm
                        loading={loading}
                        onBack={() => setPaymentChoice(null)}
                        onSubmit={(cardForm) => doRegister(savedFormData, "CREDIT_CARD", cardForm)}
                    />
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-5 w-full">
                <button
                    type="button"
                    onClick={() => changeStep(2)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                >
                    <FaArrowLeft size={10} /> Voltar — Dados da Empresa
                </button>

                <div>
                    <h2 className="text-xl font-black text-text-primary">Forma de Pagamento</h2>
                    <p className="text-sm text-text-muted">
                        Plano {selectedPlan} · R$ {selectedPlan === "BASIC" ? "29,90" : "49,90"}/mês
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => doRegister(savedFormData, "PIX")}
                        className="flex-1 h-24 rounded-xl border border-brand-500/20 bg-brand-500/5 flex flex-col items-center justify-center gap-2 text-text-primary font-bold hover:border-brand-500/40 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <CircularProgress size={20} /> : <FaPix size={22} className="text-brand-500" />}
                        PIX
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setPaymentChoice("CARD")}
                        className="flex-1 h-24 rounded-xl border border-border-main bg-bg-surface flex flex-col items-center justify-center gap-2 text-text-primary font-bold hover:border-brand-500/40 disabled:opacity-50 cursor-pointer"
                    >
                        <MdCreditCard size={22} className="text-brand-500" />
                        Cartão
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => changeStep(1)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-brand-500 transition-colors w-fit cursor-pointer"
                >
                    <FaArrowLeft size={10} /> Voltar — Plano {selectedPlan}
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                        <FaBuilding size={18} color="white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Nova Empresa</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-text-primary">Dados da Empresa</h2>
            </div>

            <Form
                onSubmit={handleSubmit(onCompanyDataSubmit)}
                register={register}
                errors={errors}
                documentValue={documentValue}
                setValue={setValue}
                loading={loading}
                seePassword={seePassword}
                setSeePassword={setSeePassword}
                isFreePlan={isFreePlan}
            />
            <TermsGateModal open={termsOpen} onClose={() => setTermsOpen(false)} onAccept={handleAcceptTerms} />
        </div>
    );
}