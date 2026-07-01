import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Função para formatar a chave privada corretamente
const getPrivateKey = () => {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    if (!key) return undefined;
    
    // Substitui os \n literais por quebras de linha reais
    // O replace duplo cobre cenários diferentes do ambiente Node
    return key.replaceAll('\n', '\n').replaceAll('"', ''); 
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
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];

        if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        let caller;
        try {
            caller = await auth.verifyIdToken(token);
        } catch {
            return NextResponse.json({ message: "Token inválido." }, { status: 401 });
        }

        const { name, email, password, companyId, role } = await request.json();
        
        if (!email || !companyId || !password) {
            return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
        }

        // Busca o perfil do usuário que chamou a API
        const callerDoc = await db.collection("users").doc(caller.uid).get();
        const callerData = callerDoc.data();

        // Garante que só pode criar funcionários na própria empresa
        if (!callerData || callerData.companyId !== companyId) {
            return NextResponse.json({ message: "Sem permissão para esta empresa." }, { status: 403 });
        }

        // Só master pode criar usuários
        if (callerData.role !== "master") {
            return NextResponse.json({ message: "Apenas o master pode criar usuários." }, { status: 403 });
        }

        // Impede que o role seja "master" via API (protege escalada de privilégio)
        const allowedRoles = ["administrador", "desenvolvedor", "lider_de_projetos"];
        const safeRole = allowedRoles.includes(role) ? role : "desenvolvedor";

        //Cria o usuário no Firebase Auth — gera o UID real
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name?.trim(),
        });

        await db.collection("users").doc(userRecord.uid).set({
            name: name.trim(),
            email,
            role: safeRole,
            companyId,
            createdAt: new Date(),
            lastLoginAt: null,
            lastSeenAt: null,
            authMethod: "email",
        });

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