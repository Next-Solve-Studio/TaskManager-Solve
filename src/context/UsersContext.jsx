"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
    collection,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query
} from 'firebase/firestore'
import { db } from "@/lib/firebaseConfig"
import { toast } from "sonner"


const UsersContext = createContext() // Contexto criado

export const useUsers = ()  => useContext(UsersContext)
// hook personalizado, para usar useUsers, ao invés se sempre escrever useContext(UsersContext)

export const UsersProvider = ({children}) => {
    const [users, setUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))

        const unSubscribe = onSnapshot( //onSnapshot pois escuta mudanças na coleção users e atualiza automaticamente 
            q,
            (snapshot) => {
                //converte cada documento em um objeto com id e os dados e guarda no estado users
                setUsers(snapshot.docs.map((d) => ({id: d.id, ...d.data() })))
                setLoadingUsers(false)
            },
            (error) => {
                toast.error('Erro ao carregar usuário: ',error)
                setLoadingUsers(false)
            }
        )

        return unSubscribe
    },[])


    const updateUser = useCallback(
        async (userId, newRole) => {
            await updateDoc(doc(db, 'users', userId), { role: newRole }) // localiza o documento e aplica o novo cargo
        },[]
    )

    const deleteUser = useCallback(async (userId) => {
        await deleteDoc(doc(db,'users',userId)) // remove o doc com o ID fornecido
    }, [])


    const value = {
        loadingUsers,
        users,
        updateUser,
        deleteUser
    }

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    )
}