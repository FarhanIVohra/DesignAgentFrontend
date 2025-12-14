// src/api/getHistory.js

export async function getHistory() {
    try {
        const response = await fetch("http://localhost:8000/history/history", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to fetch history");
        }

        return data; // { success, items }
    } catch (err) {
        console.error("[getHistory] Error:", err);
        return { success: false, items: [] };
    }
}
