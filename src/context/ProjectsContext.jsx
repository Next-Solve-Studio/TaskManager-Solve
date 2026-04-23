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
    useMemo,
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
    const [clients, setClients] = useState([])
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingClients, setLoadingClients] = useState(true)

    useEffect(() => {
        // consulta que busca a collection projects, e ordena pela data de criação, do mais novo para o mais antigo
        const q = query(
            collection(db, "projects"),
            orderBy("createdAt", "desc"),
        );

        // abre uma conexão em tempo real com o firestore,Toda vez que a coleção projects mudar, a função do primeiro callback será executada.
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setProjects(
                    snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
                );
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
                toast.error("Erro ao carregar usuários:", error);
            })
            .finally(() => setLoadingUsers(false));
    }, []);

    useEffect(()=>{
        getDocs(collection(db,"clients"))
        . then ((snapshot) => {
            setClients(snapshot.docs.map((d)=> ({id: d.id, ...d.data() })))
        })
        .catch((error) => {
            console.error("Erro ao carregar clientes:", error);
            toast.error("Erro ao carregar clientes:", error);
        })
        .finally(() => setLoadingClients(false))
    })

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
                createdByName:
                    currentUser.name || currentUser.displayName || "",
                createdAt: serverTimestamp(),
                lastModified: serverTimestamp(),
                lastModifiedBy: currentUser.uid,
                lastModifiedByName:
                    currentUser.name || currentUser.displayName || "",
            };
            const ref = await addDoc(collection(db, "projects"), payload); // adiciona o payload como um novo documento na coleção projects
            return { id: ref.id, ...payload }; // A função retorna o projeto recém-criado com seu ID.
        },
        [currentUser],
    );

    const updateProject = useCallback(
        async (projectId, data, currentProject) => {
            const prevStatus= currentProject.status
            const nextStatus = data.status

            // preenchida apenas quando muda para "concluido", zera se sair
            let deliveryDate = currentProject.deliveryDate || null;

            // se antes não era concluido e virou concluido, gera a data de entraga, se vice versa, vira null
            if (prevStatus !== "concluido" && nextStatus === "concluido"){
                deliveryDate = serverTimestamp();

            } else if (prevStatus === "concluido" && nextStatus !== "concluido"){
                deliveryDate = null;
            }

            // Calcula o 'agora' + 45 dias quando o status vira suporte, zera se sair
            let supportEndDate = currentProject.supportEndDate || null;

            // se antes não era suporte e virou suporte, gera a data final do suporte, se vice versa, vira null
            if (prevStatus !== "suporte" && nextStatus === "suporte"){
                const now = new Date()
                now.setDate(now.getDate() + 45)
                supportEndDate = now

            } else if (prevStatus === "suporte" && nextStatus !== "suporte"){
                supportEndDate = null;
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
                supportEndDate,
                techStack: data.techStack || [],
                repositoryUrl: data.repositoryUrl || "",
                hosting: data.hosting || "",
                lastModified: serverTimestamp(),
                lastModifiedBy: currentUser.uid,
                lastModifiedByName:
                    currentUser.name || currentUser.displayName || "",
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
    const usersMap = useMemo(() => {
        return Object.fromEntries(users.map((u) => [u.id, u]));
    }, [users]);

    //isso permite usar clientMap[uid] para obter os dados rapidamente de um usuário sem precisar usar find
    const clientMap = useMemo(() => {
        return Object.fromEntries(clients.map((u) => [u.id, u]));
    },  [clients])

    //Estados e funções disponíveis para os componentes filhos
    const value = {
        projects,
        users,
        usersMap,
        clients,
        clientMap,
        loadingProjects,
        loadingUsers,
        loadingClients,
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
