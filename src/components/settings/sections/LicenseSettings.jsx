"use client"

import { useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { MdRefresh } from "react-icons/md";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { db } from "@/lib/firebaseConfig";
import { validateLicense } from "@/lib/licenseApi";
import { useAuth } from "@/context/AuthContext";
import StatusPlanBadge from "@/components/ui/badges/StatusPlanBadge";


export default function LicenseSettings() {
    const { currentUser } = useAuth();
    const [loading, setLoading]   = useState(false);
    const [result, setResult]     = useState(null);
    const [checked, setChecked]   = useState(false);

    async function handleCheck() {
        setLoading(true)
        try {
            const companySnap = await getDoc(doc(db,"companies", currentUser.companyId))
            const appKey = companySnap.data()?.appKey

            if (!appKey) {
                setResult({ status: "NO_KEY", valid: false})
                return ;
            }

            const data = await validateLicense(appKey)
            setResult(data)
        } catch {
            setResult(null)
        } finally {
            setLoading(false)
            setChecked(true)
        }
    }

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
                        <p className="text-sm font-semibold text-text-secondary tracking-wide">
                            Verificando licença…
                        </p>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-6">
                {/* Cabeçalho da seção */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <RiShieldKeyholeLine className="text-brand-500 text-lg" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                            Licença
                        </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-text-primary">
                        Validar Licença
                    </h2>
                    <p className="text-[13px] text-text-muted">
                        Verifique o status da licença da sua empresa em tempo real.
                    </p>
                </div>
                {checked && result && <StatusPlanBadge result={result} checked={checked}/>}
                {checked && !result && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
                        Não foi possível verificar a licença. Tente novamente.
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleCheck}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 h-11 w-fit rounded-xl font-bold text-sm text-white
                               bg-linear-to-r from-brand-700 to-brand-600
                               shadow-[0_4px_20px_rgba(26,215,111,0.3)]
                               hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(26,215,111,0.4)]
                               active:scale-[0.97] transition-all duration-150
                               disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <MdRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
                    {checked ? "Verificar Novamente" : "Verificar Licença"}
                </button>
            </div>
        </>
    )
}
