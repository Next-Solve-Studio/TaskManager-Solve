"use client";

import { doc, getDoc, onSnapshot } from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { db } from "@/lib/firebaseConfig";
import { validateLicense } from "@/lib/licenseApi";
import { useAuth } from "./AuthContext";

const LicenseContext = createContext();
export const useLicense = () => useContext(LicenseContext);

const REVALIDATE_INTERVAL_MS = 30 * 60 * 1000;

export function LicenseProvider({ children }) {
    const { currentUser } = useAuth();
    const [license, setLicense] = useState(null);
    const [companyStatus, setCompanyStatus] = useState(null);
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
        } catch {
            setLicense((prev) => prev ?? { valid: false, status: "ERROR" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!currentUser?.companyId) {
            setCompanyStatus(null);
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, "companies", currentUser.companyId),
            (snap) =>
                setCompanyStatus(snap.exists() ? snap.data().status : null),
            () => setCompanyStatus(null),
        );

        return unsubscribe;
    }, [currentUser?.companyId]);

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

    const effectiveLicense = useMemo(() => {
        if (companyStatus && companyStatus !== "active") {
            return { valid: false, status: "INACTIVE" };
        }
        return license;
    }, [license, companyStatus]);

    const value = useMemo(
        () => ({ license: effectiveLicense, loading }),
        [effectiveLicense, loading],
    );

    return (
        <LicenseContext.Provider value={value}>
            {children}
        </LicenseContext.Provider>
    );
}
