import { useLicense } from "@/context/licenseApi";

export default function LicenseGuard({ children }) {
    const { license, loading } = useLicense();

    if (loading) return null;

    if (!license) return children;

    if (license.status === "EXPIRED" || license.status === "INACTIVE") {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] max-w-md space-y-6 shadow-2xl shadow-red-500/5">
                    <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
                        <span className="text-4xl">🔒</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-red-400 text-2xl font-black uppercase tracking-tight">
                            {license.status === "INACTIVE"
                                ? "Conta Inativa"
                                : "Licença Expirada"}
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            {license.status === "INACTIVE"
                                ? "Sua conta está inativa. Entre em contato com o suporte."
                                : "Sua licença expirou. Renove para continuar usando o TaskManager."}
                        </p>
                    </div>
                    <a
                        href="https://wa.me/seu_numero"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-6 py-3 rounded-xl font-bold text-white
                       bg-linear-to-r from-brand-600 to-brand-500
                       shadow-[0_4px_24px_rgba(26,215,111,0.35)]"
                    >
                        Renovar Agora
                    </a>
                </div>
            </div>
        );
    }

    return (
        <>
            {license.status === "GRACE_PERIOD" && (
                <div className="w-full bg-orange-500/15 border-b border-orange-500/20 px-4 py-2 text-center">
                    <p className="text-orange-300 text-xs font-semibold">
                        ⚠️ {license.warning}
                    </p>
                </div>
            )}
            {children}
        </>
    );
}
