export async function generateImage(prompt) {
    if (!prompt || !prompt.trim()) throw new Error('Prompt is empty')

    const response = await fetch('http://localhost:8000/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
    })

    let payload
    try {
        payload = await response.json()
    } catch (e) {
        const txt = await response.text().catch(() => '')
        throw new Error(`Invalid JSON response: ${txt || e.message}`)
    }

    if (!response.ok) {
        const msg = payload?.detail || payload?.error || payload?.message || `HTTP ${response.status}`
        throw new Error(msg)
    }

    return payload
}