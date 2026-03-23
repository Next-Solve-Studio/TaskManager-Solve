// Botão para logar com Google Account
"use client"

import { googleProvider, auth, db } from "@/lib/firebaseConfig"
import { signInWithPopup } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { useState } from "react"
import { useAppRouter } from "../utils/useAppRouter"
import {FcGoogle} from "react-icons/fc"
import { toast } from "sonner"

export default function GoogleLoginBtn(){
    const [loading, setLoading] = useState(false)
    const router = useAppRouter()

    async function handleGoogleLogin(){
        setLoading(true)

        ty{
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            //verificar se o user já existe
            const userRef = doc(db, "users", user.uid)
            const userSnap = await getDoc(userRef)
        }
    }

    return (

    )
}