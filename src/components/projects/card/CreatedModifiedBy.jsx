

export default function CreatedModifiedBy({usersMap, project}) {

    const createdBy = usersMap[project.createdBy]; // pega o objeto do usuário que criou o projeto (usando o createdBy que veio do Firebase)
    const lastModifiedBy = usersMap[project.lastModifiedBy]; // agora pega quem editou pela última vez

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 4,
            }}
        >
            {createdBy && (
                <span style={{ fontSize: 10, color: "#4b4b4b" }}>
                    Criado por{" "}
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>
                        {createdBy.name}
                    </span>
                </span>
            )}
            {lastModifiedBy && project.lastModified && (
                <span style={{ fontSize: 10, color: "#4b4b4b" }}>
                    Últ. Edição por{" "}
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>
                        {lastModifiedBy.name}
                    </span>
                </span>
            )}
        </div>
    )
}
