// AuthContext.jsx
'use client'

import { createContext, useCallback, useContext, useEffect, useState}  from 'react'
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../lib/firebaseConfig'; 
import { useAppRouter } from "@/utils/useAppRouter"
import { setDoc, doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { serialize } from 'cookie';

const AuthContext = createContext();  // Criação do contexto

export const useAuth = () => useContext(AuthContext)
/**
 * Cria um "hook" personalizado, que ao invés de precisar escrever useContext(AuthContext) em todos os componentes,
 * basta simplesmente chamar useAuth()
*/

export const AuthProvider = ({ children})  => { 
    // Componente Provedor, vai "abraçar" toda a aplicação
    const [currentUser, setCurrentUser] = useState(null); // estado de usuário atual
    const [loading, setLoading] = useState(true) 
    const router = useAppRouter() // Inicia o hook de roteamento para que possamos usá-lo para redirecionar o usuário

    const setSessionCookie = useCallback((token) => {
        const cookieOptions =  {
            maxAge: 30*24*60*60, //30 dias de duração do cookie
            path:'/', // o cookie é válido para todo o dommínio
            secure:process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        }
        // biome-ignore lint/suspicious/noDocumentCookie: <>
        document.cookie = serialize('__session', token || '', token ?  cookieOptions : {...
            cookieOptions, maxAge: -1})
    }, [])

    useEffect(()=>{// Esse bloco será executado apenas uma vez, quando o AuthProvider for renderizado pela 1° vez
        const unsubscribe = onAuthStateChanged(auth, async (user) => { // o OnAuth... fica observando o estado de autenticação, retorna uma função unsubscribe
            if (user) {
                const token = await user.getIdToken()
                setSessionCookie(token)

                // Busca dados do usuários
                const userDoc = await getDoc(doc(db,"users", user.uid))
                const userData = userDoc.exists() ? userDoc.data() : {}

                setCurrentUser({...user, ...userData}) // atualiza o estado com a informação recebida do firebase
            } else{
                setSessionCookie(null)
                setCurrentUser(null)
            }
            
            setLoading(false)
        })
        return unsubscribe //função de "limpeza", quando o componente for desmontado, chama unsubscribe() para remover o ouvinte
    }, [setSessionCookie])

    const login = async (email, password) => { // Função de login, recebe email e password, chama a função do firebase, e se for bem-sucedido, redireciona para o home
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const token = await userCredential.user.getIdToken()
        setSessionCookie(token)
        router.goHome()
    }

    const register = async (name, email, password) => {
        // Função de registro, cria um novo usuário no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const token = await userCredential.user.getIdToken()
0
        const usersSnapshot = await getDocs(collection(db, "users"))
        const isFirstUser = usersSnapshot.empty

        // Cria o documento do usuário na coleção users do firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            name: name.trim(),
            email,
            role: isFirstUser ? "administrador" : "desenvolvedor",
            createdAt: new Date(),
            authMethod: "email"
        })
        setSessionCookie(token)
        router.goHome()
    }

    const logout = async () => {
        try{
            await signOut(auth)
            setSessionCookie(null)
            router.goLogin()
        } catch (error) {
            console.error("Erro ao fazer logout: ", error)

        }
    }

    
    const value = {
        currentUser,
        login,
        register,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
    
}