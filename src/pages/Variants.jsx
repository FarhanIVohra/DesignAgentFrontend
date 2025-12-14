import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { generateVariants } from "../api/generateVariants";

export default function Variants() {
    const [params] = useSearchParams();
    const id = params.get("id");

    const [item, setItem] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [seed, setSeed] = useState(null);

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("Variants Page → historyId:", id);

    // -----------------------------------------------------
    //  LOAD ORIGINAL IMAGE + PROMPT
    // -----------------------------------------------------
    useEffect(() => {
        if (!id) return;

        async function loadOriginal() {
            try {
                const res = await fetch(`http://localhost:8000/history/${id}`);

                if (!res.ok) {
                    console.error("Unable to load history item:", id);
                    return;
                }

                const data = await res.json();
                console.log("Loaded original image data:", data);

                setItem(data);
                setPrompt(data.prompt || "");
                setSeed(data.seed || null);

            } catch (err) {
                console.error("History load failed:", err);
            }
        }

        loadOriginal();
    }, [id]);

    // -----------------------------------------------------
    //  GENERATE VARIANTS
    // -----------------------------------------------------
    const handleGenerate = async () => {
        try {
            setLoading(true);

            const response = await generateVariants(prompt, seed, 4);

            console.log("Variants API result:", response);

            if (!response.success) {
                console.error("Variant generation failed:", response);
                setVariants([]);
                return;
            }

            // Backend format: { success: true, items: [ { image_url, seed }, ... ] }
            const urls = response.items?.map(v => v.image_url) || [];

            console.log("Extracted variant URLs:", urls);

            setVariants(urls);

        } catch (err) {
            console.error("Error generating variants:", err);
            setVariants([]);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------
    //  UI RENDER
    // -----------------------------------------------------
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Generate Variants</h2>

            {/* Original Image */}
            {item?.image_url && (
                <div className="mb-4">
                    <img
                        src={item.image_url}
                        alt="Original"
                        className="w-64 rounded shadow mb-3"
                    />
                    <p className="text-gray-600 text-sm">
                        <strong>Seed:</strong> {item.seed}
                    </p>
                </div>
            )}

            {/* Prompt Editing */}
            <textarea
                className="w-full p-2 border rounded mb-3"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Edit prompt before generating variants..."
            />

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded"
            >
                {loading ? "Generating…" : "Generate Variants"}
            </button>

            {/* Variants Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {variants.map((url, idx) => (
                    <div key={idx} className="p-2 bg-white rounded shadow">
                        <img src={url} alt={`variant-${idx}`} className="rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
