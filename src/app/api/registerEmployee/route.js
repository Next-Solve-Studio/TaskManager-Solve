import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Nota: Em um ambiente real de produção SaaS, você usaria o firebase-admin 
// para criar o usuário no Auth sem deslogar o administrador atual.
// Aqui estamos simulando a criação do documento no Firestore.

export async function POST(request) {
    try {
        const { name, email, companyId, role, uid } = await request.json();
        if (!email || !companyId || !uid) {
            return NextResponse.json({ message: "Dados incompletos" }, { status:400 });
        }

        const userData = {
            name: name.trim(),
            email,
            role: role || "desenvolvedor",
            companyId,
            createdAt: new Date(),
            lastLoginAt: null,
            lastSeenAt: null,
            authMethod: "email",
        };

        // Salva no Firestore
        await setDoc(doc(db, "users", uid), userData);

        return NextResponse.json({ message: "Usuário registrado com sucesso", user: userData }, { status: 201 });
    } catch (error) {
        console.error("Erro na API de registro:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
