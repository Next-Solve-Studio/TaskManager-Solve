import UsersMain from "@/components/users/UsersMain";
import ProtectedRoutes from "@/components/auth/ProtectedRoutes";

export default function usersPage() {
    return (
        <ProtectedRoutes permission="canViewUsers">
            <UsersMain/>
        </ProtectedRoutes>
    )
}
