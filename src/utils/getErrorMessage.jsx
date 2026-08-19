export const getErrorMessage = (error, fallbackMessage = "Ocorreu um error inesperado.") => {
    switch (error?.code) {
        case "permission-denied":
            return 'Voçe não tem permissão para realizar essa ação.'
        case "unauthenticated":
            return "Sua sessáo expirou. Faça login novamente."
        case "unavailable":
            return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
        case "not-found":
            return "O item que você tentou acessar não existe mais.";
        case "resource-exhausted":
            return "Limite de uso atingido. Tente novamente mais tarde.";
        case "already-exists":
            return "Esse registro já existe.";
        default:
            return fallbackMessage;
    }
};