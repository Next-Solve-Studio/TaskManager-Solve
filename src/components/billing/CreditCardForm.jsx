"use client";
import { useState } from "react";
import { TextField } from "@mui/material";
import { muiDark } from "@/styles/StyleInputs";

function CreditCardVisual({ holderName, number, expiryMonth, expiryYear, ccv, isFlipped }) {
    const formattedNumber = (number || "")
        .padEnd(16, "•")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    const displayName = (holderName || "SEU NOME").toUpperCase();
    const mm = (expiryMonth || "MM").toString().padStart(2, "0").slice(0, 2);
    const yy = (expiryYear || "AA").toString().slice(-2);

    return (
        <div className="w-full max-w-[340px] mx-auto mb-4" style={{ perspective: "1000px" }}>
            <div
                className="relative w-full transition-transform duration-500"
                style={{
                    aspectRatio: "1.586",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                <div
                    className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between text-white shadow-xl"
                    style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    }}
                >
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90" />
                        <span className="text-xs font-bold tracking-widest opacity-70">CARTÃO</span>
                    </div>
                    <div className="font-mono text-lg tracking-widest break-all">
                        {formattedNumber}
                    </div>
                    <div className="flex justify-between items-end text-xs gap-2">
                        <div className="min-w-0">
                            <p className="opacity-50 text-[9px]">TITULAR</p>
                            <p className="font-semibold tracking-wide truncate">{displayName}</p>
                        </div>
                        <div className="shrink-0">
                            <p className="opacity-50 text-[9px]">VALIDADE</p>
                            <p className="font-semibold">{mm}/{yy}</p>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute inset-0 rounded-2xl text-white shadow-xl overflow-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    }}
                >
                    <div className="h-10 bg-black/60 mt-5" />
                    <div className="flex justify-end px-5 mt-4">
                        <div className="bg-white/90 text-black text-sm font-mono px-3 py-1.5 rounded w-16 text-right">
                            {ccv || "•••"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreditCardForm({ onSubmit, onBack, loading }) {
    const [form, setForm] = useState({
        holderName: "", number: "", expiryMonth: "", expiryYear: "", ccv: "",
        postalCode: "", addressNumber: "",
    });
    const [focusedField, setFocusedField] = useState(null);

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="w-full">
            <CreditCardVisual
                holderName={form.holderName}
                number={form.number.replace(/\s/g, "")}
                expiryMonth={form.expiryMonth}
                expiryYear={form.expiryYear}
                ccv={form.ccv}
                isFlipped={focusedField === "ccv"}
            />

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-3 w-full text-left">
                <TextField
                    label="Nome no Cartão" value={form.holderName} onChange={update("holderName")}
                    onFocus={() => setFocusedField("holderName")} onBlur={() => setFocusedField(null)}
                    required size="small" sx={muiDark}
                />
                <TextField
                    label="Número do Cartão" value={form.number} onChange={update("number")}
                    onFocus={() => setFocusedField("number")} onBlur={() => setFocusedField(null)}
                    inputProps={{ maxLength: 19 }} required size="small" sx={muiDark}
                />
                <div className="flex gap-2">
                    <TextField
                        label="Mês (MM)" value={form.expiryMonth} onChange={update("expiryMonth")}
                        onFocus={() => setFocusedField("expiry")} onBlur={() => setFocusedField(null)}
                        inputProps={{ maxLength: 2 }} required size="small" sx={muiDark}
                    />
                    <TextField
                        label="Ano (AAAA)" value={form.expiryYear} onChange={update("expiryYear")}
                        onFocus={() => setFocusedField("expiry")} onBlur={() => setFocusedField(null)}
                        inputProps={{ maxLength: 4 }} required size="small" sx={muiDark}
                    />
                    <TextField
                        label="CVV" value={form.ccv} onChange={update("ccv")}
                        onFocus={() => setFocusedField("ccv")} onBlur={() => setFocusedField(null)}
                        inputProps={{ maxLength: 4 }} required size="small" sx={muiDark}
                    />
                </div>
                <div className="flex gap-2">
                    <TextField label="CEP" value={form.postalCode} onChange={update("postalCode")} required size="small" sx={muiDark} />
                    <TextField label="Número" value={form.addressNumber} onChange={update("addressNumber")} required size="small" sx={muiDark} />
                </div>
                <div className="flex gap-2 mt-2">
                    <button type="button" onClick={onBack} className="flex-1 h-10 rounded-xl font-bold text-sm text-white/70 border border-white/10 hover:bg-white/5 cursor-pointer">
                        Voltar
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 h-10 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                        {loading ? "Processando..." : "Pagar com Cartão"}
                    </button>
                </div>
            </form>
        </div>
    );
}