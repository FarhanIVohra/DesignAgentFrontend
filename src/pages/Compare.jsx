import { useEffect, useState } from "react";
import { getHistory } from "../api/historyApi";

export default function Compare() {
  const [history, setHistory] = useState([]);
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);

  useEffect(() => {
    async function load() {
      const h = await getHistory();
      if (h.success) setHistory(h.items);
    }
    load();
  }, []);

  const img1 = history.find(x => x.id === selected1);
  const img2 = history.find(x => x.id === selected2);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Compare Images</h2>

      {/* Dropdowns */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2"
          onChange={e => setSelected1(e.target.value)}
        >
          <option value="">Select an image</option>
          {history.map(h => (
            <option key={h.id} value={h.id}>
              {h.prompt.slice(0, 40)}...
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          onChange={e => setSelected2(e.target.value)}
        >
          <option value="">Select an image</option>
          {history.map(h => (
            <option key={h.id} value={h.id}>
              {h.prompt.slice(0, 40)}...
            </option>
          ))}
        </select>
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border rounded p-3 shadow">
          {img1 ? (
            <img src={img1.image_url} className="rounded" />
          ) : (
            <p>No image selected</p>
          )}
        </div>

        <div className="border rounded p-3 shadow">
          {img2 ? (
            <img src={img2.image_url} className="rounded" />
          ) : (
            <p>No image selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
