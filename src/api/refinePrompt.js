import { BACKEND_URL } from './apiBase'
export async function refinePrompt(prompt) {
    try {
        const res = await fetch(`${BACKEND_URL}/refine-prompt`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ prompt })
        });
        
        const data = await res.json();
        return data;
    }catch (err) {
        console.error("[refinePrompt] error", err);
        throw err;
    }
}
