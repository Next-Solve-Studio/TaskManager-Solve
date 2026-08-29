import SortIcon from "@/utils/SortIcon";
import UserRow from "./UserRow";
import { useCustomFields } from "@/context/CustomFieldsContext";

export default function UserTable({filtered, sortKey, sortDir, handleSort, handleOpenMenu}) {
    const { userFields } = useCustomFields();
    
    // Default columns: 48px 1fr 160px 100px 100px ... customFields ... 72px
    const customCols = userFields?.length > 0 ? userFields.map(() => "minmax(120px, 1fr)").join(" ") : "";
    const gridCols = `48px minmax(200px, 1fr) 160px 100px 100px ${customCols ? customCols + ' ' : ''}72px`;

    return (
        <div className="max-w-full overflow-x-auto pb-2">
            <div className="inline-flex flex-col gap-1.5 min-w-full min-w-[800px]">
                {/* Cabeçalho */}
                <div 
                    className="grid gap-4 px-5 mb-2"
                    style={{ gridTemplateColumns: gridCols }}
                >
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
                        className="cursor-pointer flex items-center p-0 select-none bg-none border-none"
                    >
                        <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                            Entrada
                        </p>
                        <SortIcon columnKey="createdAt" sortKey={sortKey} sortDir={sortDir}/>
                    </button>
                    {userFields?.map(field => (
                        <div key={field.id} className="flex items-center min-w-0">
                            <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
                                {field.name}
                            </p>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <p className="text-text-muted font-bold uppercase text-[11px] tracking-widest">
                            Ações
                        </p>
                    </div>
                </div>

                {/* Lista de Usuários */}
                {filtered.map((user) => (
                    <UserRow
                        key={user.id}
                        user={user}
                        onOpenMenu={handleOpenMenu}
                        gridCols={gridCols}
                        userFields={userFields}
                    />
                ))}
            </div>
        </div>
    );
}
