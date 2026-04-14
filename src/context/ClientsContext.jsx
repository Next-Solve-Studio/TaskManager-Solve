"use client";
import { Box } from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebaseConfig";

const ClientsContext = createContext();

export const useClients = () => useContext(ClientsContext);

export const ClientsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setClients(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao ouvir clientes", error);
        toast.error("Erro ao carregar clientes");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const createClient = useCallback(
    async (data) => {
      try {
        const payload = {
          name: data.name,
          email: data.email || "",
          contato: data.contato || "",
          documento: data.documento || "", // Novo campo opcional
          status: data.status || "active",
          createdBy: currentUser?.uid || "system",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const ref = await addDoc(collection(db, "clients"), payload);
        toast.success("Cliente criado com sucesso");
        return { id: ref.id, ...payload };
      } catch (error) {
        console.error("Erro ao criar cliente:", error);
        toast.error("Erro ao criar cliente");
        throw error;
      }
    },
    [currentUser],
  );

  const updateClient = useCallback(async (clientId, data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email || "",
        contato: data.contato || "",
        documento: data.documento || "",
        status: data.status,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(doc(db, "clients", clientId), payload);
      toast.success("Cliente atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente");
      throw error;
    }
  }, []);

  const deleteClient = useCallback(async (clientId) => {
    try {
      await deleteDoc(doc(db, "clients", clientId));
      toast.success("Cliente excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente");
      throw error;
    }
  }, []);

  const value = {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
  };

  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
};
