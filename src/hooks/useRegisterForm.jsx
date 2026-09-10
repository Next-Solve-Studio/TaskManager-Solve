"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebaseConfig";

const schema = yup
    .object({
        companyName: yup.string().min(3, "Mínimo 3 caracteres").required("Obrigatório"),
        cnpj: yup.string().min(1, "CPF/CNPJ é obrigatório").required("Obrigatório"),
        name: yup.string().min(3, "Mínimo 3 caracteres").required("Obrigatório"),
        email: yup.string().email("E-mail inválido").required("Obrigatório"),
        password: yup.string().min(6, "Mínimo 6 caracteres").required("Obrigatório"),
        endereco: yup.string().optional(),
    })
    .required();

export function useRegisterForm({ onStepChange }) {
    const { registerCompany } = useAuth();
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState("FREE");
    const [savedFormData, setSavedFormData] = useState(null);
    const [pixData, setPixData] = useState(null);
    const [pixAppKey, setPixAppKey] = useState(null);
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [paymentChoice, setPaymentChoice] = useState(null);
    const [confirmingCard, setConfirmingCard] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [pendingRegister, setPendingRegister] = useState(null);

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const isFreePlan = selectedPlan === "FREE";
    const documentValue = watch("cnpj");

    const changeStep = (n) => {
        setStep(n);
        onStepChange?.(n);
    };

    async function doRegister(data, billingType = "PIX", cardForm) {
        setLoading(true);
        try {
            const appKey = await registerCompany(
                data.companyName,
                data.name,
                data.email,
                data.password,
                selectedPlan,
                data.cnpj,
                data.endereco || "",
            );

            if (!isFreePlan && appKey) {
                const token = await auth.currentUser?.getIdToken();
                if (!token) throw new Error("Erro de autenticação após registro.");

                const cpfCnpjRaw = data.cnpj.replace(/\D/g, "");

                const setupRes = await fetch("/api/billing/setup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ appKey, name: data.name, email: data.email, cpfCnpj: cpfCnpjRaw }),
                });
                if (!setupRes.ok) {
                    const e = await setupRes.json();
                    throw new Error(e.error || "Erro ao configurar pagamento.");
                }

                const subscribeBody = { appKey, plan: selectedPlan, billingType, billingCycle: billingCycle.toUpperCase() };
                if (billingType === "CREDIT_CARD" && cardForm) {
                    subscribeBody.creditCard = {
                        holderName: cardForm.holderName,
                        number: cardForm.number.replace(/\s/g, ""),
                        expiryMonth: cardForm.expiryMonth,
                        expiryYear: cardForm.expiryYear,
                        ccv: cardForm.ccv,
                    };
                    subscribeBody.creditCardHolderInfo = {
                        name: data.name,
                        email: data.email,
                        cpfCnpj: cpfCnpjRaw,
                        postalCode: cardForm.postalCode.replace(/\D/g, ""),
                        addressNumber: cardForm.addressNumber,
                    };
                }

                const subRes = await fetch("/api/billing/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(subscribeBody),
                });
                const subData = await subRes.json();
                if (!subRes.ok) throw new Error(subData.error || "Erro ao criar assinatura.");

                if (billingType === "PIX") {
                    if (!subData.pixInfo) throw new Error("QR Code não disponível. Tente novamente.");
                    setPixAppKey(appKey);
                    setPixData(subData.pixInfo);
                    return;
                }

                setPixAppKey(appKey);
                setConfirmingCard(true);
                return;
            }

            toast.success("Empresa cadastrada com sucesso!", { description: "Bem-vindo ao TaskManager!" });
        } catch (error) {
            toast.error(error.message || "Erro ao cadastrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function handlePixRenew() {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Sessão expirada. Recarregue a página.");

        await fetch("/api/billing/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ appKey: pixAppKey }),
        });

        const subRes = await fetch("/api/billing/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ appKey: pixAppKey, plan: selectedPlan, billingType: "PIX", billingCycle: billingCycle.toUpperCase() }),
        });
        const subData = await subRes.json();
        if (!subRes.ok) throw new Error(subData.error || "Erro ao criar nova assinatura.");
        if (!subData.pixInfo) throw new Error("QR Code não disponível. Tente novamente.");

        setPixData(subData.pixInfo);
    }

    async function onCompanyDataSubmit(data) {
        if (isFreePlan) {
            setPendingRegister({ data, mode: "free" });
            setTermsOpen(true);
            return;
        }

        setLoading(true);
        try {
            const cpfCnpjRaw = data.cnpj.replace(/\D/g, "");
            const res = await fetch(`/api/check-cpf-availability?cpfCnpj=${encodeURIComponent(cpfCnpjRaw)}&plan=${selectedPlan}`);
            const result = await res.json();

            if (!res.ok || !result.available) {
                toast.error(result.message || result.error || "Não foi possível continuar com esse CPF/CNPJ.");
                return;
            }

            setPendingRegister({ data, mode: "paid" });
            setTermsOpen(true);
        } catch (error) {
            console.log(error);
            toast.error("Erro ao verificar CPF/CNPJ. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAcceptTerms() {
        setTermsOpen(false);
        if (!pendingRegister) return;
        const { data, mode } = pendingRegister;
        setPendingRegister(null);

        if (mode === "free") {
            await doRegister(data);
        } else {
            setSavedFormData(data);
            changeStep(3);
        }
    }

    return {
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
    };
}