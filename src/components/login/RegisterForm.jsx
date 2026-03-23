"use client"
import { toast } from "sonner"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { TextField, CircularProgress, InputAdornment} from "@mui/material"
import { IoMdLock } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md"
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm({setHaveAccount}) {
    const { register } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] =  useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [seePassword, setSeePassword] = useState(false)

    async function handleRegister(e) {
        e.preventDefault()

        if (!name || !email || !password) {
            toast.warning("Preencha todos os campos !")
            return
        }

        setLoading(true)

        try{
            await register (name, email, password)

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

    const fieldSx = {
        "& .MuiOutlinedInput-root": {

            borderRadius: "10px",
            color: "white",
            "& fieldset": { borderColor: "var(--color-bg-hover)" },
            "&:hover fieldset": { borderColor: "var(--color-bg-hover2)" },
            "&.Mui-focused fieldset": { borderColor: "var(--color-primary)", borderWidth: "1.5px" },
        },
        "& .MuiInputLabel-root": { color: "#666" },
        "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },

        "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
            transition: "background-color 50000s ease-in-out 0s",
            WebkitTextFillColor: "white !important",
            caretColor: "white",
        },
    }

    function handlePassword(){
        setSeePassword(!seePassword)
    }

    return (
        <form onSubmit={handleRegister} className="relative flex flex-col gap-10 overflow-hidden rounded-2xl mx-auto w-full max-w-120 p-8 pb-32">
            <div className="flex flex-col gap-5">
                <TextField
                    label="Nome"
                    variant="outlined"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    sx={fieldSx}
                    autoComplete="off"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AiOutlineUser color="var(--color-primary)" size={20} />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    label="E-mail"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    sx={fieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdOutlineEmail color="var(--color-primary)" size={20} />
                            </InputAdornment>
                        )
                    }}
                />
                <div className="flex w-full relative items-center">
                    <TextField
                        label="Senha"
                        variant="outlined"
                        type={seePassword ? "text" : "password"}
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        sx={fieldSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IoMdLock color="var(--color-primary)" size={20} />
                                </InputAdornment>
                            )
                        }}
                        className="w-full"
                    
                    />
                    <button type="button" className="absolute right-2" onClick={handlePassword}>{seePassword ? <FaEyeSlash size={20} className="cursor-pointer text-bg-hover hover:text-bg-hover2"/> : <FaEye size={20} className="cursor-pointer text-bg-hover hover:text-bg-hover2"/>}</button>
                </div>
                <button type="button" className="text-bg-hover2 cursor-pointer hover:text-brand-700" onClick={()=> setHaveAccount(true)}>Já tem conta criada? clique aqui</button>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="
                    mt-1 h-12 w-full rounded-lg
                    font-semibold text-xl tracking-wide
                    bg-brand-600 hover:bg-brand-700
                    text-white
                    shadow-[0_0_20px_var(--color-surface-green-md)]
                    cursor-pointer
                    hover:shadow-[0_0_28px_var(--color-surface-green-alt)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-95 active:brightness-90 transition-all duration-150
                "
            >
                {loading ?<CircularProgress size={24} color="inherit" /> : "Criar conta"}
            </button>
            
        </form>
    )
}
