"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  collection,
  addDoc,
  updateDoc, 
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

const ProjectsContext = createContext() // contexto criado

export const useProjects = () => useContext(ProjectsContext)
//hook personalizado, para usar useProjects, ao inves de escrever sempre o useContext(ProjectsContext)

export const ProjectsProvider = ({children}) => {
    const {currentUser} = useAuth() // Pega o usuário logado atual
    
    const [projects, setProjects] = useState([])
    const [users, setUsers] = useState([])
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [loadingUsers, setLoadingUsers] = useState(true)

    useEffect(()=>{
        // consulta que busca a collection projects, e ordena pela data de criação, do mais novo para o mais antigo
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))

        // abre uma conexão em tempo real com o firestore,Toda vez que a coleção projects mudar, a função do primeiro callback será executada.
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setProjects(snapshot.docs.map((d)=> ({id:d.id, ...d.data()})))
                setLoadingProjects(false)
            },
            (error) => {
                console.error('Erro ao ouvir projetos', error)
                toast.error('Erro ao carregar projetos')
                setLoadingProjects(false)
            }
        )
        return unsubscribe
    }, [])

    useEffect(() => {
        getDocs(collection(db, 'users')) // busca todos os documentos da coleção users apenas uma vez
        .then((snapshot) => {
            //converte cada documento em um objeto com id e os dados e guarda no estado users
            setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        })
        .catch((error) => {
            console.error('Erro ao carregar usuários:', error)
            toast.error('Erro ao carregar usuários')
        })
        .finally(() => setLoadingUsers(false))
    }, [])

    const createProject = useCallback( // memoriza a função para que ela não mude entre renderizações (a menos que currentUser mude)
        async (data) => {
            const payload = {
                title: data.title,
                description: data.description || '',
                client: data.client || '',
                status: data.status || 'em_andamento',
                priority: data.priority || 'media',
                developers: data.developers || [],           
                startDate: data.startDate || '',
                deliveryDate: data.deliveryDate || '',
                techStack: data.techStack || [],            
                repositoryUrl: data.repositoryUrl || '',
                hosting: data.hosting || '',
                createdBy: currentUser.uid,
                createdByName: currentUser.name || currentUser.displayName || '',
                createdAt: serverTimestamp(),
                lastModified: serverTimestamp(),
                lastModifiedBy: currentUser.uid,
                lastModifiedByName: currentUser.name || currentUser.displayName || '',
            }
            const ref = await addDoc(collection(db, 'projects'), payload) // adiciona o payload como um novo documento na coleção projects
            return { id: ref.id, ...payload } // A função retorna o projeto recém-criado com seu ID.
        },
        [currentUser]
    )
}
