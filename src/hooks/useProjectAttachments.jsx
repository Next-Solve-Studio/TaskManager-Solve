"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import {
    collection, addDoc, deleteDoc, doc,
    query, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebaseConfig";

const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "application/rtf",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
];
const MAX_SIZE = 10 * 1024 * 1024;

export function useProjectAttachments(projectId, companyId) {
    const { currentUser } = useAuth();
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!projectId) return;
        const q = query(
            collection(db, "projects", projectId, "attachments"),
            orderBy("createdAt", "desc")
        );
        return onSnapshot(q, snap =>
            setAttachments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
    }, [projectId]);

    const upload = useCallback(async (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Tipo não permitido. Envie PDF, DOC, XLS, PPT, TXT ou CSV.");
            return false;
        }
        if (file.size > MAX_SIZE) {
            setError("Arquivo maior que 10MB.");
            return false;
        }
        setError(null);
        setUploading(true);
        try {
            const token = await auth.currentUser.getIdToken();
            const formData = new FormData();
            formData.append("file", file);
            formData.append("companyId", companyId);

            const res = await fetch(`/api/attachments/${projectId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Erro ao enviar."); return false; }

            await addDoc(collection(db, "projects", projectId, "attachments"), {
                name: data.name,
                size: data.size,
                type: data.type,
                storagePath: data.storagePath,
                uploadedBy: data.uploadedBy,
                uploadedByName: data.uploadedByName,
                createdAt: serverTimestamp(),
            });
            return true;
        } catch(err) {
            console.error("upload error:", err);
            setError(err?.message || "Erro ao enviar. Tente novamente.");
            return false;
        } finally {
            setUploading(false);
        }
    }, [projectId, companyId]);

    const download = useCallback(async (attachment) => {
        try {
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(
                `/api/attachments/${projectId}/${attachment.id}?path=${encodeURIComponent(attachment.storagePath)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (!res.ok) { setError("Erro ao gerar link."); return; }
            window.open(data.signedUrl, "_blank");
        } catch {
            setError("Erro ao baixar arquivo.");
        }
    }, [projectId]);

    const remove = useCallback(async (attachment) => {
        try {
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(
                `/api/attachments/${projectId}/${attachment.id}?path=${encodeURIComponent(attachment.storagePath)}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) { setError("Erro ao remover."); return; }
            await deleteDoc(doc(db, "projects", projectId, "attachments", attachment.id));
        } catch {
            setError("Erro ao remover arquivo.");
        }
    }, [projectId]);

    return { attachments, uploading, error, upload, download, remove, setError };
}