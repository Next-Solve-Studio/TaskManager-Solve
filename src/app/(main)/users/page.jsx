import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import UsersMain from "@/components/users/UsersMain";

export default function usersPage() {
  return (
    <ProtectedRoutes permission="canViewUsers">
      <UsersMain />
    </ProtectedRoutes>
  );
}
