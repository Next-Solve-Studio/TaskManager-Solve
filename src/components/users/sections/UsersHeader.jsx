import { MdPeople } from "react-icons/md";

export default function UsersHeader({users}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
            }}
            className="mb-5"
        >
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                    }}
                >
                    <MdPeople
                        style={{
                            color: "var(--color-brand-500)",
                            fontSize: 18,
                        }}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                        Gestão de Usuários
                    </span>
                </div>
                <h1 className="text-[26px] font-extrabold text-text-primary mt-2">
                    Usuários
                </h1>
                <p className="text-[13px] text-text-muted mt-1">
                    {users.length} usuário{users.length === 1 ? "" : "s"}{" "}
                    cadastrado
                    {users.length === 1 ? "" : "s"}
                </p>
            </div>
        </div>
    )
}
