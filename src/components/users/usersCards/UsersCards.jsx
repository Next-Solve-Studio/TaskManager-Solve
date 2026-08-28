"use client";
import { CircularProgress } from "@mui/material";
import { useUsers } from "@/context/UsersContext";
import { UserCard } from "./UserCard";

export default function UsersCards({ users, onOpenMenu }) {
    const { loading } = useUsers();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "60px 0",
                    gap: 12,
                }}
            >
                <CircularProgress size={24} style={{ color: "#19CA68" }} />
                <span style={{ color: "#6b7280", fontSize: 14 }}>
                    Carregando usuários...
                </span>
            </div>
        );
    }

    if (!users || users.length === 0) return null;

    return (
        <>
            {!loading && (
                <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onOpenMenu={onOpenMenu}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
