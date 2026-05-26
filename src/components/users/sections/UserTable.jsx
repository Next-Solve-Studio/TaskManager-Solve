import SortIcon from "@/utils/SortIcon";
import UserRow from "./UserRow";


export default function UserTable({filtered, sortKey, sortDir, handleSort, handleOpenMenu}) {
    return (
        <div
            className="flex flex-col gap-1.5 "
        >
            {/* Cabeçalho */}
            <div className="grid grid-cols-[48px_1fr_160px_100px_100px_72px] gap-4 px-5 mb-2">
                <div></div>
                <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="cursor-pointer select-none flex items-center bg-none border-none p-0"
                >
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Usuário
                    </p>
                    <SortIcon columnKey="name" sortKey={sortKey} sortDir={sortDir}/>
                </button>
                <button
                    type="button"
                    onClick={() => handleSort("role")}
                    className="cursor-pointer flex items-center p-0 select-none"
                >
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Cargo
                    </p>
                    <SortIcon columnKey="role" sortKey={sortKey} sortDir={sortDir}/>
                </button>
                <button
                    type="button"
                    onClick={() => handleSort("lastLoginAt")}
                    className="cursor-pointer select-none flex items-center bg-none border-none p-0"
                >
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Últ. Acesso
                    </p>
                    <SortIcon columnKey="lastLoginAt" sortKey={sortKey} sortDir={sortDir}/>
                </button>
                <button
                    type="button"
                    onClick={() => handleSort("createdAt")}
                    className="cursor-pointer flex items-center p-0 select-none"
                >
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Entrada
                    </p>
                    <SortIcon columnKey="createdAt" sortKey={sortKey} sortDir={sortDir}/>
                </button>
                <div className="text-center">
                    <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                        Ações
                    </p>
                </div>
            </div>

            {/* Lista de Usuários */}
            <div
                className=" flex flex-col gap-1.5"
            >
                {filtered.map((user) => (
                    <UserRow
                        key={user.id}
                        user={user}
                        onOpenMenu ={handleOpenMenu}
                    />
                ))}
            </div>
        </div>
    )
}
