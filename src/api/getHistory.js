// src/api/getHistory.js
import { BACKEND_URL } from './apiBase'

export async function getHistory() {
    try {
        const response = await fetch(`${BACKEND_URL}/history/`, {
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
