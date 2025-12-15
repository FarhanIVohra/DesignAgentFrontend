import { useEffect, useState } from "react";
import { getHistory } from "../api/historyApi";
import { BACKEND_URL } from "../api/apiBase";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this image permanently?");
    if (!confirm) return;

    try {
      setActionLoadingId(id);
      setActionType("delete");

      const res = await fetch(`${BACKEND_URL}/history/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove from UI immediately
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete image");
      console.error(err);
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getHistory();
        if (data && data.items) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("History load error:", err);
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openVariants = (id) => {
    setActionLoadingId(id);
    setActionType("variants");
    navigate(`/variants?id=${id}`);
  };

  if (loading) return <p className="text-center">Loading history...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Image History</h2>

      {items.length === 0 && (
        <p className="text-gray-500 text-center">No images generated yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition overflow-hidden"
          >
            <div className="relative group rounded overflow-hidden mb-3">
              <img
                src={item.image_url || ""}
                alt="Generated"
                className="w-full h-48 object-cover bg-gray-50"
              />

              {/* Hover overlay with actions: Edit, Variants, Download */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition pointer-events-auto flex gap-3">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setActionLoadingId(item.id);
                      setActionType('edit');
                      navigate(`/edit?id=${item.id}`);
                    }}
                    className="bg-white/90 hover:bg-white px-3 py-2 rounded-md flex items-center gap-2 text-sm"
                    aria-label={`Edit ${item.id}`}
                  >
                    <span className="text-slate-700">✏️</span>
                    <span className="text-slate-800">Edit</span>
                  </button>

                  {/* Variants */}
                  <button
                    onClick={() => openVariants(item.id)}
                    className="bg-white/90 hover:bg-white px-3 py-2 rounded-md flex items-center gap-2 text-sm"
                    aria-label={`Variants ${item.id}`}
                  >
                    <span className="text-slate-700">🧬</span>
                    <span className="text-slate-800">Variants</span>
                  </button>

                  {/* Download */}
                  <a
                    href={item.image_url || '#'}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/90 hover:bg-white px-3 py-2 rounded-md flex items-center gap-2 text-sm"
                    aria-label={`Download ${item.id}`}
                  >
                    <span className="text-slate-700">⬇️</span>
                    <span className="text-slate-800">Download</span>
                  </a>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-700">
              <strong>Prompt:</strong> {item.prompt ? item.prompt.slice(0, 80) : ""}…
            </p>

            <p className="text-sm text-gray-500 mt-1">
              <strong>Seed:</strong> {item.seed ?? "-"}
            </p>

            {/* Action row: primary + secondary + delete icon */}
            <div className="mt-3 flex items-center justify-between space-x-2">
              {/* Primary action: Generate Variants */}
              <button
                onClick={() => openVariants(item.id)}
                disabled={
                  loading || (actionLoadingId === item.id && actionType === "variants")
                }
                className={`min-w-0 flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                  loading || (actionLoadingId === item.id && actionType === "variants")
                    ? "bg-teal-400 text-white cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white shadow"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h-2M6 12H4m12.364 6.364l-1.414-1.414M7.05 6.636L5.636 5.222m12.728 0l-1.414 1.414M7.05 17.364l-1.414 1.414" />
                </svg>
                <span>
                  {actionLoadingId === item.id && actionType === "variants" ? "Loading..." : "Generate Variants"}
                </span>
              </button>

              {/* Secondary actions group */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Edit */}
                <button
                  onClick={() => {
                    setActionLoadingId(item.id);
                    setActionType("edit");
                    navigate(`/edit?id=${item.id}`);
                  }}
                  disabled={loading || (actionLoadingId === item.id && actionType === "edit")}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                    loading || (actionLoadingId === item.id && actionType === "edit")
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span className="whitespace-nowrap">{actionLoadingId === item.id && actionType === "edit" ? "Loading..." : "Edit"}</span>
                </button>

                {/* Download moved to image overlay */}

                {/* Delete: icon-only danger action */}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loading || (actionLoadingId === item.id && actionType === "delete")}
                  aria-label="Delete image"
                  className={`p-2 rounded-md ml-1 transition ${
                    loading || (actionLoadingId === item.id && actionType === "delete")
                      ? "bg-red-100 text-red-300 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                  style={{ lineHeight: 0 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
