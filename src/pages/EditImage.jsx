import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function EditImage() {
    const [params] = useSearchParams();
    const id = params.get("id");

    const [item, setItem] = useState(null);
    const [prompt, setPrompt] = useState("Replace selected area with:");
    const [resultUrl, setResultUrl] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    // Canvas refs
    const imageCanvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    const drawing = useRef(false);

    /* ---------------- LOAD IMAGE ---------------- */
    useEffect(() => {
        if (!id) return;

        async function load() {
            const res = await fetch(`${BASE_URL}/history/${id}`);
            const data = await res.json();
            setItem(data);
        }
        load();
    }, [id]);

    /* ---------------- INIT CANVASES ---------------- */
    useEffect(() => {
        if (!item) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = item.image_url;

        img.onload = () => {
            const imageCanvas = imageCanvasRef.current;
            const maskCanvas = maskCanvasRef.current;

            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;

            const imgCtx = imageCanvas.getContext("2d");
            imgCtx.drawImage(img, 0, 0);

            // Initialize mask canvas BLACK
            const maskCtx = maskCanvas.getContext("2d");
            maskCtx.fillStyle = "black";
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        };
    }, [item]);

    /* ---------------- DRAWING ---------------- */
    const startDraw = () => (drawing.current = true);
    const endDraw = () => (drawing.current = false);

    const draw = (e) => {
        if (!drawing.current) return;

        const canvas = maskCanvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.fillStyle = "white"; // WHITE = area to edit
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
    };

    /* ---------------- MASK EXPORT ---------------- */
    const getMaskBase64 = () => {
        const dataUrl = maskCanvasRef.current.toDataURL("image/png");
        return dataUrl.replace("data:image/png;base64,", "");
    };

    /* ---------------- APPLY EDIT ---------------- */
    const applyEdit = async () => {
        setLoading(true);
        setStatus("Sending edit request...");
        setResultUrl("");

        const maskBase64 = getMaskBase64();

        console.log("➡️ Image URL:", item.image_url);
        console.log("➡️ Prompt:", prompt);
        console.log("➡️ Mask length:", maskBase64.length);

        try {
            const res = await fetch(`${BASE_URL}/edit-image`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image_url: item.image_url,
                    mask_base64: maskBase64,
                    prompt: prompt
                })
            });

            const data = await res.json();
            console.log("✅ EDIT RESPONSE:", data);

            if (data.result_url) {
                setResultUrl(data.result_url);
                setStatus("Edit successful ✅");
            } else {
                setStatus("Edit failed ❌");
            }
        } catch (err) {
            console.error(err);
            setStatus("Server error ❌");
        }

        setLoading(false);
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-3">Edit Image (In-Painting)</h2>

            {!item ? (
                <p>Loading...</p>
            ) : (
                <>
                    <p className="text-gray-600 mb-2">{item.prompt}</p>

                    {/* Canvas Stack */}
                    <div className="relative inline-block border mb-4">
                        <canvas ref={imageCanvasRef} />
                        <canvas
                            ref={maskCanvasRef}
                            className="absolute top-0 left-0 cursor-crosshair"
                            onMouseDown={startDraw}
                            onMouseUp={endDraw}
                            onMouseMove={draw}
                        />
                    </div>

                    <textarea
                        className="w-full p-2 border rounded mb-3"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    <button
                        onClick={applyEdit}
                        disabled={loading}
                        className={`px-4 py-2 rounded text-white transition ${
                            loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    >
                        {loading ? "Applying Edit..." : "Apply Edit"}
                    </button>

                    {status && (
                        <p className="mt-3 text-sm text-gray-700">{status}</p>
                    )}

                    {resultUrl && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Result</h3>
                            <img
                                src={resultUrl}
                                className="w-64 rounded shadow"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
