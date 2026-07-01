import { useLicense } from "@/context/LicenseApiContext";
import { FcLock } from "react-icons/fc";
import { IoMdWarning } from "react-icons/io";

const SUPPORT_EMAIL = "equipe.nextsolvesolution@gmail.com";

export default function LicenseGuard({ children }) {
    const { license, loading } = useLicense();

    if (loading) return null;

    if (!license) {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-[40px] max-w-md space-y-4">
                    <span className="text-4xl">⚠️</span>
                    <h2 className="text-yellow-400 text-xl font-black uppercase tracking-tight">
                        Serviço Indisponível
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Não foi possível verificar sua licença. Tente recarregar a página.
                        Se o problema persistir, entre em contato com o suporte.
                    </p>
                    <button
                        type="button"
                        onClick={() => globalThis.location.reload()}
                        className="px-6 py-2 rounded-xl font-bold text-white bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
                    >
                        Recarregar
                    </button>
                </div>
            </div>
        );
    }

   if (license.status === "EXPIRED" || license.status === "INACTIVE") {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] max-w-md space-y-6 shadow-2xl shadow-red-500/5">
                    <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
                        <span className="text-4xl"><FcLock /></span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-red-400 text-2xl font-black uppercase tracking-tight">
                            {license.status === "INACTIVE" ? "Conta Inativa" : "Licença Expirada"}
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            {license.status === "INACTIVE"
                                ? "Sua conta está inativa. Entre em contato com o suporte."
                                : "Sua licença expirou. Renove para continuar usando o TaskManager."}
                        </p>
                    </div>
                    <a
                        href={`mailto:${SUPPORT_EMAIL}?subject=Renovação de Licença`}
                        className="inline-block px-6 py-3 rounded-xl font-bold text-white
                                   bg-linear-to-r from-brand-600 to-brand-500
                                   shadow-[0_4px_24px_rgba(26,215,111,0.35)]"
                    >
                        Entrar em Contato
                    </a>
                    <p className="text-xs text-text-muted">{SUPPORT_EMAIL}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {license.status === "GRACE_PERIOD" && (
                <div className="w-full bg-orange-500/15 border-b border-orange-500/20 px-4 py-2 text-center">
                    <p className="text-orange-300 text-xs font-semibold">
                        <IoMdWarning className="text-warning" /> {license.warning}
                    </p>
                </div>
            )}
            {children}
        </>
    );
}