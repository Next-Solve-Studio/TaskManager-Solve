"use client";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

export default function TermsGateModal({ open, onClose, onAccept }) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (open) setChecked(false);
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="w-full max-w-md rounded-2xl p-6 bg-bg-card border border-border-main shadow-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="text-lg font-bold text-text-primary">Termos de Uso e Privacidade</h2>
                    <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <MdClose size={18} />
                    </button>
                </div>

                <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-5">
                    <p>
                        Antes de criar sua conta, você precisa ler e concordar com os Termos de Uso e a Política de
                        Privacidade do Task Manager Solve. Eles explicam como tratamos os dados da sua empresa e como
                        funciona a integração opcional com o Google Calendar.
                    </p>
                    <div className="flex flex-col gap-1">
                        <a href="/TermsOfService" target="_blank" rel="noopener noreferrer" className="text-brand-500 font-semibold hover:underline">
                            Ler os Termos de Uso completos →
                        </a>
                        <a href="/PrivacyPolicy" target="_blank" rel="noopener noreferrer" className="text-brand-500 font-semibold hover:underline">
                            Ler a Política de Privacidade completa →
                        </a>
                    </div>
                </div>

                <label className="flex items-start gap-3 mb-5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-brand-500 cursor-pointer"
                    />
                    <span className="text-sm text-text-secondary">
                        Li e aceito os <strong className="text-text-primary">Termos de Uso</strong> e a{" "}
                        <strong className="text-text-primary">Política de Privacidade</strong>.
                    </span>
                </label>

                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-bg-surface border border-border-main text-text-secondary hover:bg-bg-side">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={!checked}
                        onClick={onAccept}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-brand-500 text-black hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Aceitar e continuar
                    </button>
                </div>
            </div>
        </div>
    );
}