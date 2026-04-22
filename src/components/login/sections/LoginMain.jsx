"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";
import RegisterForm from "../RegisterForm";
import LoginForm from "./LoginForm";

export default function LoginMain() {
    const [haveAccount, setHaveAccount] = useState(true);
    const { systemSettings } = useSettings();

    const allowRegistration = systemSettings?.allowRegistration ?? true;

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
        <main className="flex flex-col md:flex-row min-h-screen items-center justify-between w-full ">
            <div className="z-10  flex flex-col gap-6 items-center justify-center overflow-hidden flex-1 h-screen max-w-180 min-w-90 lg:min-w-110">
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
            <div className="absolute inset-0 md:relative md:inset-auto bg-geometric bg-cover bg-no-repeat h-screen w-full md:w-[80%] md:min-w-50 bg-linear-to-br from-neutral-500 to-neutral-900"></div>
        </main>
    );
}
