import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Função para formatar a chave privada corretamente
const getPrivateKey = () => {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    if (!key) return undefined;
    
    // Substitui os \n literais por quebras de linha reais
    // O replace duplo cobre cenários diferentes do ambiente Node
    return key.replace(/\\n/g, '\n').replace(/"/g, ''); 
};

// Inicializa o Admin SDK com a chave mestra
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: getPrivateKey(),
            }),
        });
    } catch (error) {
        console.error("Erro na inicialização do Firebase Admin:", error);
    }
}

const db = admin.firestore();

export async function POST(request) {
    try {
        const { name, email, companyId, role, uid } = await request.json();
        
        if (!email || !companyId || !uid) {
            return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
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

        await db.collection("users").doc(uid).set(userData);

        return NextResponse.json({ message: "Usuário registrado com sucesso", user: userData }, { status: 201 });
        
    } catch (error) {
        console.error("Erro na API de registro:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}