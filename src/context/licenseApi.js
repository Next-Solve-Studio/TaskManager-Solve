"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { validateLicense } from "@/lib/licenseApi";
import { useAuth } from "./AuthContext";

const LicenseContext = createContext();
export const useLicense = () => useContext(LicenseContext);

export function LicenseProvider({ children }) {
    const { currentUser } = useAuth();
    const [license, setLicense] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.companyId) {
            setLoading(false);
            return;
        }

        async function check() {
            try {
                const companySnap = await getDoc(
                    doc(db, "companies", currentUser.companyId),
                );
                const appKey = companySnap.data()?.appKey;

                if (!appKey) {
                    setLicense({ valid: false, status: "NO_KEY" });
                    return;
                }

                const result = await validateLicense(appKey);
                setLicense(result);
            } catch {
                setLicense(null); // fail open — não bloqueia se a API cair
            } finally {
                setLoading(false);
            }
        }

        check();
    }, [currentUser?.companyId]);

    return (
        <LicenseContext.Provider value={{ license, loading }}>
            {children}
        </LicenseContext.Provider>
    );
}
