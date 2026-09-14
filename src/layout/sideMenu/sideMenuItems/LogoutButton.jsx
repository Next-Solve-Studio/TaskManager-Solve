import { CiLogout } from "react-icons/ci";


export default function LogoutButton({effectiveOpen, logout}) {
    return (
        <div className="mt-auto flex flex-col items-center gap-2 w-full sm:px-4">
            <button
                type="button"
                onClick={logout}
                className="h-12 flex items-center text-error sm:hover:bg-error/10 rounded-lg transition-colors duration-200 group cursor-pointer"
            >
                <div className="w-12 flex justify-center shrink-0">
                    <CiLogout className="text-[27px] transition-transform duration-200 sm:group-hover:scale-110" />
                </div>

                <div
                    className={`sm:ml-1 flex justify-start transition-all duration-300 ease-in-out overflow-hidden ${effectiveOpen ? "opacity-100 w-40" : "opacity-0 w-0"}`}
                >
                    <span className="text-sm font-medium whitespace-nowrap tracking-wide">
                        Sair
                    </span>
                </div>
            </button>
        </div>
    )
}
