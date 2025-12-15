import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { generateVariants } from "../api/generateVariants";
import { BACKEND_URL } from "../api/apiBase";

export default function Variants() {
    const [params] = useSearchParams();
    const id = params.get("id"); // MUST match History.jsx
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [seed, setSeed] = useState(null);

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("Variants → history id:", id);

    // --------------------------------------------------
    // Load original image + prompt
    // --------------------------------------------------
    useEffect(() => {
        if (!id) return;

        async function loadOriginal() {
            try {
                const res = await fetch(`${BACKEND_URL}/history/${id}`);

                if (!res.ok) {
                    console.error("Failed to load history item:", id);
                    return;
                }

                const data = await res.json();
                console.log("Loaded history item:", data);

                setItem(data);
                setPrompt(data.prompt || "");
                setSeed(data.seed || null);

            } catch (err) {
                console.error("History fetch error:", err);
            }
        }

        loadOriginal();
    }, [id]);

    // --------------------------------------------------
    // Generate variants
    // --------------------------------------------------
    const handleGenerate = async () => {
        try {
            setLoading(true);

            const response = await generateVariants(prompt, 4);
            console.log("Variants response:", response);

            if (!response?.success || !Array.isArray(response.items)) {
                console.error("Invalid variants response");
                setVariants([]);
                return;
            }

            setVariants(response.items);

        } catch (err) {
            console.error("Variant generation failed:", err);
            setVariants([]);
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // UI
    // --------------------------------------------------
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Generate Variants</h2>

            {/* ORIGINAL IMAGE */}
            {item?.image_url && (
                <div className="mb-6">
                    <div className="relative inline-block group">
                        <img
                            src={item.image_url}
                            alt="Original"
                            className="w-72 rounded shadow"
                        />

                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                                <button
                                    onClick={() => navigate(`/edit?id=${id}`)}
                                    className="bg-white px-3 py-2 rounded text-sm"
                                >
                                    ✏️ Edit
                                </button>

                                <a
                                    href={item.image_url}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white px-3 py-2 rounded text-sm"
                                >
                                    ⬇️ Download
                                </a>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                        <strong>Seed:</strong> {seed}
                    </p>
                </div>
            )}

            {/* PROMPT */}
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

            {/* VARIANTS GRID */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {variants.map((v, idx) => (
                    <div key={idx} className="bg-white rounded shadow p-2">
                        <div className="relative group">
                            <img
                                src={v.image_url}
                                alt={`variant-${idx}`}
                                className="w-full h-40 object-cover rounded"
                            />

                            {/* Hover actions */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                                    <a
                                        href={v.image_url}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white px-2 py-1 rounded text-sm"
                                    >
                                        ⬇️
                                    </a>
                                    <button
                                        onClick={() => navigate(`/edit?id=${id}`)}
                                        className="bg-white px-2 py-1 rounded text-sm"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                            Seed: {v.seed}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
