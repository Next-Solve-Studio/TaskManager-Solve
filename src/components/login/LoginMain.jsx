'use client'
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";


export default function LoginMain() {
    const [haveAccount, setHaveAccount] = useState(true)
    return (
        <main className="flex min-h-screen items-center justify-between w-full ">
            {haveAccount ?
                <div className="min-h-screen flex flex-col gap-6 items-center justify-center overflow-hidden flex-1 max-w-180">
                    <h2 className="flex items-center justify-center w-full max-w-100 text-4xl font-bold text-center">Acesse sua Conta</h2>
                    <LoginForm setHaveAccount={setHaveAccount} haveAccount={haveAccount}/>
                </div>
                :
                <div className="min-h-screen flex flex-col gap-6 items-center justify-center overflow-hidden flex-1 max-w-180">
                    <h2 className="flex items-center justify-center w-full max-w-100 text-4xl font-bold text-center">Crie sua Conta</h2>
                    <RegisterForm setHaveAccount={setHaveAccount} haveAccount={haveAccount}/>
                </div>
            }
            <div className="bg-geometric bg-cover bg-no-repeat h-screen w-[65%] bg-linear-to-br from-neutral-500 to-neutral-900">
            </div>
        </main>
    )
}
