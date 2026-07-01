"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo  } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { validateLicense } from "@/lib/licenseApi";
import { useAuth } from "./AuthContext";

const LicenseContext = createContext();
export const useLicense = () => useContext(LicenseContext);

const REVALIDATE_INTERVAL_MS = 30 * 60 * 1000;

export function LicenseProvider({ children }) {
    const { currentUser } = useAuth();
    const [license, setLicense] = useState(null);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);

    const check = useCallback(async (companyId) => {

        try {
            const companySnap = await getDoc(doc(db, "companies", companyId));
            const appKey = companySnap.data()?.appKey;

            if (!appKey) {
                setLicense({ valid: false, status: "NO_KEY" });
                return;
            }

            const result = await validateLicense(appKey);
            setLicense(result);

            // setLicense({ valid: false, status: "EXPIRED", warning: null });
            // return;
        } catch {
            setLicense((prev) => prev ?? { valid: false, status: "ERROR" });
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        if (!currentUser?.companyId) {
            setLoading(false);
            return;
        }

        check(currentUser.companyId);

        intervalRef.current = setInterval(() => {
            check(currentUser.companyId);
        }, REVALIDATE_INTERVAL_MS);

        return () => clearInterval(intervalRef.current);
    }, [currentUser?.companyId, check]);

    const value = useMemo(() => ({ license, loading }), [license, loading]);

    return (
        <LicenseContext.Provider value={value}>
            {children}
        </LicenseContext.Provider>
    );
}
