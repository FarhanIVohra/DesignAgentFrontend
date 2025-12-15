import { BACKEND_URL } from './apiBase'

export async function generateVariants(prompt, count = 3) {
    try {
        const response = await fetch(`${BACKEND_URL}/generate-variants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, num_variants: count })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (err) {
        console.error("[generateVariants] Error:", err);
        throw err;
    }
}
