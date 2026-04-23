

export default function NewClient({onCreate}) {
    return (
        <>
            {onCreate && (
                <button
                    onClick={onCreate}
                    type="button"
                    className="
                        relative inline-flex items-center gap-1.5
                        px-4.5 h-9.5 rounded-[7px]
                        text-[13px] font-bold tracking-tight text-black
                        bg-linear-to-br from-brand-500 to-brand-600
                        overflow-hidden cursor-pointer
                        transition-all duration-150
                        hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(25, 202, 104, 0.42)]
                        active:scale-[0.97]
                        shadow-[0_2px_10px_rgba(25,202,104,0.25)]
                        max-w-50
                    "
                >
                    <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-linear-to-b from-white/18 to-transparent" />
                    <span className="relative z-10">Novo Cliente</span>
                </button>
            )}
        </>
        
    )
}
