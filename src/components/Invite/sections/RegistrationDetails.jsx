import { MdOutlineMailOutline } from "react-icons/md";


export default function RegistrationDetails({invite}) {
    return (
        <div className="grid grid-cols-2 gap-2.5 mb-5">
            <div className="rounded-xl bg-bg-surface border border-border-main2 px-3.5 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-text-muted mb-0.5">Nome</p>
                <p className="text-sm font-medium text-text-primary truncate">{invite.name}</p>
            </div>
            <div className="rounded-xl bg-bg-surface border border-border-main2 px-3.5 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-text-muted mb-0.5 flex items-center gap-1">
                    <MdOutlineMailOutline size={11} /> E-mail
                </p>
                <p className="text-sm font-medium text-text-primary truncate">{invite.email}</p>
            </div>
        </div>
    )
}
