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
const auth = admin.auth(); 

export async function POST(request) {
    try {
        const { name, email, password, companyId, role } = await request.json();
        
        if (!email || !companyId || !password) {
            return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
        }

        //Cria o usuário no Firebase Auth — gera o UID real
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name?.trim(),
        });

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

         await db.collection("users").doc(userRecord.uid).set(userData);

        return NextResponse.json(
            { message: "Usuário registrado com sucesso", uid: userRecord.uid },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Erro na API de registro:", error);

        if (error.code?.startsWith("auth/")) {
            const messages = {
                "auth/email-already-exists": "Este e-mail já está em uso.",
                "auth/invalid-password": "A senha deve ter pelo menos 6 caracteres.",
            };
            return NextResponse.json(
                { message: messages[error.code] ?? error.message },
                { status: 400 }
            );
        }
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}