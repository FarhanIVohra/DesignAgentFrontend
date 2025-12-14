import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { generateImage } from "../api/generateImage";
import { refinePrompt } from "../api/refinePrompt";

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState("");
    const [enhancedPrompt, setEnhancedPrompt] = useState(null);

    const [chosenPrompt, setChosenPrompt] = useState(null);

    const [loading, setLoading] = useState(false);
    const [refining, setRefining] = useState(false);

    const [imageUrl, setImageUrl] = useState(null);
    const [structuredPrompt, setStructuredPrompt] = useState(null);
    const [error, setError] = useState(null);

    // -------------------------------
    // STEP 1: REFINE PROMPT (LLM)
    // -------------------------------
    const handleRefine = async () => {
        if (!prompt.trim()) return;

        setRefining(true);
        setError(null);

        try {
            const data = await refinePrompt(prompt);
            setEnhancedPrompt(data.refined_prompt);
            setChosenPrompt(null);   // reset previous decision
        } catch (err) {
            console.error("Refine Error:", err);
            setError("Failed to refine prompt.");
        } finally {
            setRefining(false);
        }
    };

    // ---------------------------------------
    // STEP 2: GENERATE USING SELECTED PROMPT
    // ---------------------------------------
    const handleGenerateWithChosen = async () => {
        if (!chosenPrompt) {
            setError("Choose refined or original prompt first!");
            return;
        }

        setLoading(true);
        setError(null);
        setImageUrl(null);
        setStructuredPrompt(null);

        try {
            const data = await generateImage(chosenPrompt);

            const finalUrl =
                data.supabase_image_url ||
                data.bria_image_url ||
                data.image_url ||
                null;

            if (!finalUrl) throw new Error("No image URL from backend");

            setImageUrl(finalUrl);
            setStructuredPrompt(data.structured_prompt || null);

        } catch (err) {
            console.error("Generation Error:", err);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-3">Generate Image</h2>

            {/* ---------------- TEXT ENTRY ---------------- */}
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="w-full h-32 p-3 border rounded-md resize-none mb-4"
            />

            {/* REFINE BUTTON */}
            <button
                onClick={handleRefine}
                disabled={refining || !prompt.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md mr-3"
            >
                {refining ? "Refining..." : "Refine Prompt"}
            </button>

            {/* ---------------- SHOW REFINED PROMPT ---------------- */}
            {enhancedPrompt && (
                <div className="mt-4 p-3 bg-gray-50 border rounded-md">
                    <strong>Refined Prompt:</strong>
                    <p className="text-sm mt-1">{enhancedPrompt}</p>

                    <div className="flex gap-3 mt-3">

                        {/* USE REFINED */}
                        <button
                            onClick={() => setChosenPrompt(enhancedPrompt)}
                            className={`px-4 py-2 rounded-md ${
                                chosenPrompt === enhancedPrompt
                                    ? "bg-teal-700 text-white"
                                    : "bg-teal-600 text-white"
                            }`}
                        >
                            Use Refined Prompt
                        </button>

                        {/* USE ORIGINAL */}
                        <button
                            onClick={() => setChosenPrompt(prompt)}
                            className={`px-4 py-2 rounded-md ${
                                chosenPrompt === prompt
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-600 text-white"
                            }`}
                        >
                            Use Original Prompt
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------- GENERATE BUTTON ---------------- */}
            {chosenPrompt && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">
                        Selected prompt: <span className="font-medium">{chosenPrompt.slice(0, 80)}...</span>
                    </p>

                    <button
                        onClick={handleGenerateWithChosen}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                        {loading ? "Generating..." : "Generate Image"}
                    </button>
                </div>
            )}

            {/* ERRORS */}
            {error && <p className="text-red-600 mt-3">{error}</p>}

            {/* IMAGE OUTPUT */}
            {imageUrl && (
                <div className="mt-6">
                    <img src={imageUrl} className="max-w-md rounded shadow" />

                    {structuredPrompt && (
                        <pre className="bg-gray-100 p-2 rounded mt-3 text-xs">
                            {JSON.stringify(structuredPrompt, null, 2)}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}
