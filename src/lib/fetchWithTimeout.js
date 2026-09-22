export async function fetchWithTimeout(url, options = {}, timeoutMs = 10_000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return res;
    } catch (err) {
        clearTimeout(id);
        if (err.name === "AbortError") throw new Error("Serviço indisponível (timeout).");
        throw err;
    }
}
