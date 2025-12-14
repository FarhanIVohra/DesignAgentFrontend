export async function refinePrompt(prompt) {
    try {
        const res = await fetch("http://localhost:8000/refine-prompt", {
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