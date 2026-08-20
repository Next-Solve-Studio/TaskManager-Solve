import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function ShowPassword({setSeePassword, seePassword}) {
    return (
        <button
            type="button"
            className="absolute right-3 text-text-muted hover:text-brand-500 cursor-pointer"
            onClick={() => setSeePassword(!seePassword)}
        >
            {seePassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
    )
}
