// AuthContext.jsx
'use client'

import { createContext, useContext, useEffect, useState}  from 'react'
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebaseConfig'; 
import { useRouter } from 'next/navigation'

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
    const router = useRouter() // Inicia o hook de roteamento para que possamos usá-lo para redirecionar o usuário

    useEffect(()=>{// Esse bloco será executado apenas uma vez, quando o AuthProvider for renderizado pela 1° vez
        const unsubscribe = onAuthStateChanged(auth, (user) => { // o OnAuth... fica observando o estado de autenticação, retorna uma função unsubscribe
            setCurrentUser(user) // atualiza o estado com a informação recebida do firebase
            setLoading(false)
        })
        return unsubscribe() //função de "limpeza", quando o componente for desmontado, chama unsubscribe() para remover o ouvinte
    }, [])

    const login = async (email, password) => { // Função de login, recebe email e password, chama a função do firebase, e se for bem-sucedido, redireciona para o home
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push('/')
        } catch (error) {
            console.error("Erro ao fazer login: ", error)
        }
    }

    const logout = async () => {
        try{
            await signOut(auth)
            router.push('/login')
        } catch (error) {
            console.error("Erro ao fazer logout: ", error)

        }
    }

    
    const value = {
        currentUser,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
    
}