import { MdOutlinePersonAddAlt } from "react-icons/md";
import { ROLE_LABELS, ROLES_STYLES } from "@/lib/roles";

export default function InviteInfo({invite}) {
    const roleStyle = ROLES_STYLES[invite.role] || {};
    const RoleIcon = roleStyle.icon;

    return (
        <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-500 to-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(26,215,111,0.35)]">
                <MdOutlinePersonAddAlt size={26} color="white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-text-primary">Você foi convidado!</h1>
                <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                    <strong className="text-text-primary">{invite.invitedByName}</strong> te chamou para a equipe de{" "}
                    <strong className="text-text-primary">{invite.companyName}</strong>
                </p>
            </div>
            {RoleIcon && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.color} border ${roleStyle.border}`}>
                    <RoleIcon size={14} />
                    {ROLE_LABELS[invite.role] || invite.role}
                </span>
            )}
        </div>
    )
}
