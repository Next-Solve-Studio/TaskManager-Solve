"use client";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
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

const ProjectsContext = createContext(); // contexto criado

export const useProjects = () => useContext(ProjectsContext);
//hook personalizado, para usar useProjects, ao inves de escrever sempre o useContext(ProjectsContext)

export const ProjectsProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Pega o usuário logado atual

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // consulta que busca a collection projects, e ordena pela data de criação, do mais novo para o mais antigo
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    // abre uma conexão em tempo real com o firestore,Toda vez que a coleção projects mudar, a função do primeiro callback será executada.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProjects(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingProjects(false);
      },
      (error) => {
        console.error("Erro ao ouvir projetos", error);
        toast.error("Erro ao carregar projetos");
        setLoadingProjects(false);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    getDocs(collection(db, "users")) // busca todos os documentos da coleção users apenas uma vez
      .then((snapshot) => {
        //converte cada documento em um objeto com id e os dados e guarda no estado users
        setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch((error) => {
        console.error("Erro ao carregar usuários:", error);
        toast.error("Erro ao carregar usuários");
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const createProject = useCallback(
    // memoriza a função para que ela não mude entre renderizações (a menos que currentUser mude)
    async (data) => {
      const payload = {
        title: data.title,
        description: data.description || "",
        client: data.client || "",
        status: data.status || "em_andamento",
        priority: data.priority || "media",
        developers: data.developers || [],
        startDate: data.startDate ? new Date(data.startDate) : null,
        expectedDeliveryDate: data.expectedDeliveryDate
          ? new Date(data.expectedDeliveryDate)
          : null,
        deliveryDate: null,
        techStack: data.techStack || [],
        repositoryUrl: data.repositoryUrl || "",
        hosting: data.hosting || "",
        createdBy: currentUser.uid,
        createdByName: currentUser.name || currentUser.displayName || "",
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        lastModifiedBy: currentUser.uid,
        lastModifiedByName: currentUser.name || currentUser.displayName || "",
      };
      const ref = await addDoc(collection(db, "projects"), payload); // adiciona o payload como um novo documento na coleção projects
      return { id: ref.id, ...payload }; // A função retorna o projeto recém-criado com seu ID.
    },
    [currentUser],
  );

  const updateProject = useCallback(
    async (projectId, data, currentProject) => {
      const wasConcluded = currentProject.status === "concluido";
      const isNowConcluded = data.status === "concluido";

      let deliveryDate = currentProject.deliveryDate || null;

      // virou concluído agora
      if (!wasConcluded && isNowConcluded) {
        deliveryDate = serverTimestamp();
      }

      // Saiu de concluído
      if (wasConcluded && !isNowConcluded) {
        deliveryDate = null;
      }

      const payload = {
        title: data.title,
        description: data.description || "",
        client: data.client || "",
        status: data.status,
        priority: data.priority,
        developers: data.developers || [],
        startDate: data.startDate ? new Date(data.startDate) : null,
        expectedDeliveryDate: data.expectedDeliveryDate
          ? new Date(data.expectedDeliveryDate)
          : null,
        deliveryDate,
        techStack: data.techStack || [],
        repositoryUrl: data.repositoryUrl || "",
        hosting: data.hosting || "",
        lastModified: serverTimestamp(),
        lastModifiedBy: currentUser.uid,
        lastModifiedByName: currentUser.name || currentUser.displayName || "",
      };
      await updateDoc(doc(db, "projects", projectId), payload); // localiza o documento pelo caminho projects/projectId e aplica as alterações
      return { id: projectId, ...payload };
    },
    [currentUser],
  );

  const deleteProject = useCallback(async (projectId) => {
    await deleteDoc(doc(db, "projects", projectId)); // remove o documento com o ID fornecido
  }, []);

  //isso permite usar usersMap[uid] para obter os dados rapidamente de um usuário sem precisar usar find
  const usersMap = Object.fromEntries(users.map((u) => [u.id, u]));

  //Estados e funções disponíveis para os componentes filhos
  const value = {
    projects,
    users,
    usersMap,
    loadingProjects,
    loadingUsers,
    createProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
