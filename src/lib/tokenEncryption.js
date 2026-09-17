import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ALGO = "aes-256-gcm";

function getKey() {
    const hex = process.env.TOKEN_ENCRYPTION_KEY;
    if (!hex || hex.length !== 64) {
        throw new Error("TOKEN_ENCRYPTION_KEY ausente ou inválida (deve ter 64 caracteres hex).");
    }
    return Buffer.from(hex, "hex");
}

export function encryptToken(plaintext) {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGO, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptToken(ciphertext) {
    const [ivHex, tagHex, encHex] = ciphertext.split(":");
    const decipher = createDecipheriv(ALGO, getKey(), Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return Buffer.concat([
        decipher.update(Buffer.from(encHex, "hex")),
        decipher.final(),
    ]).toString("utf8");
}