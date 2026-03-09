"use client"
import { toast } from "sonner"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "@/lib/firebaseConfig"
import { setDoc, doc } from "firebase/firestore"
import { TextField, Button, CircularProgress} from "@mui/material"

export default function RegisterForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] =  useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleRegister(e) {
        e.preventDefault()

        if (!name || !email || !password) {
            toast.warning("Preencha todos os campos !")
            return
        }

        setLoading(true)

        try{
            const create = await createUserWithEmailAndPassword(auth, email, password)

            await setDoc(doc(db, "users", create.user.uid),{
                name: name.trim(),
                email,
                createdAt: new Date()
            })
            toast.success("Conta criada com sucesso!", {
                description: "Bem-vindo! Você já está logado.",
            })
        } catch (error) {
            const messages = {
                "auth/email-already-in-use": "Este e-mail já está cadastrado.",
                "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
                "auth/invalid-email": "E-mail inválido.",
            }

            toast.error("Erro ao criar conta", {
                description: messages[error.code] ?? "Tente novamente mais tarde.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <TextField
                label="Nome"
                variant="outlined"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                InputLabelProps={{
                    style: { color: '#888' }
                }}
                InputProps={{
                    style: {
                        color: 'white',
                        backgroundColor: '#1C1C1C'
                    },
                }}
            />
            <TextField
                label="E-mail"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                InputLabelProps={{
                    style: { color: '#888' }
                }}
                InputProps={{
                    style: {
                        color: 'white',
                        backgroundColor: '#1C1C1C'
                    },
                }}
            />
            <TextField
                label="Senha"
                variant="outlined"
                type="password"
                onChange={(e)=> setPassword(e.target.value)}
                InputLabelProps={{
                    style: { color: '#888' }
                }}
                InputProps={{
                    style: {
                        color: 'white',
                        backgroundColor: '#1C1C1C'
                    },
                }}
            />
            <Button
                type="submit"
                variant="contained"
                disable={loading}
                sx={{ 
                    bgcolor: 'var(--color-primary)',
                    '&:hover': {
                        bgcolor: 'var(--color-brand-600)'
                    }
                }}
            >
                {loading ?<CircularProgress size={24} color="inherit" /> : "Criar conta"}
            </Button>
        </form>
    )
}
