"use client";

import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import AnalyticsMain from "@/components/analytics/AnalyticsMain";

export default function AnalyticsPage() {
    return (
        <ProtectedRoutes permission="canViewFinancials">
            <AnalyticsMain />
        </ProtectedRoutes>
    );
}
