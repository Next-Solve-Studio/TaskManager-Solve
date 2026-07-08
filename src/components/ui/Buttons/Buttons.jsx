
export const AddButton = ({action, label}) => {
    return (
        <button
            onClick={action}
            type="button"
            className="
                relative inline-flex items-center gap-1.5
                px-4.5 h-9.5 rounded-[7px]
                text-[13px] font-bold tracking-tight text-white text-shadow-sm
                bg-linear-to-br from-brand-500 to-brand-600
                overflow-hidden cursor-pointer
                transition-all duration-150
                hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(25, 202, 104, 0.42)]
                active:scale-[0.97]
                shadow-[0_2px_10px_rgba(25,202,104,0.25)]
                max-w-50
            "
        >
            {label}
        </button>
    )
}
