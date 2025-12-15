import { BACKEND_URL } from "./apiBase";

export async function getHistory() {
    try {
        const res = await fetch(`${BACKEND_URL}/history/`);
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (err) {
        console.error("[historyApi|getHistory] Error:", err);
        throw err;
    }
}

export async function getHistoryItem(id) {
    try {
        const res = await fetch(`${BACKEND_URL}/history/${id}`);
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (err) {
        console.error("[historyApi|getHistoryItem] Error:", err);
        throw err;
    }
}
