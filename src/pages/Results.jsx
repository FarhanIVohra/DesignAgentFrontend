import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageCard from '../components/ImageCard'
import designAgentService from '../api/designAgentService'
import { useAppContext } from '../context/AppContext'

export default function Results() {
  const { jobId, results, setResults, selectedImages, selectImage, clearSelection } = useAppContext()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!jobId) {
      navigate('/upload')
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        const res = await designAgentService.getResults(jobId)
        // expected res.data.results = [{ id, url, labels: [] }]
        const data = res.data || {}
        const items = data.results || data.items || data || []
        setResults(items)
      } catch (err) {
        console.error('failed to load results', err)
      } finally {
        setLoading(false)
      }
    }

    load()
    // clear selection when entering results
    clearSelection()
  }, [jobId, navigate, setResults, clearSelection])

  const handleCompare = () => {
    if (selectedImages.length !== 2) return alert('Select exactly two images to compare')
    navigate('/compare')
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Results</h1>
          <p className="text-sm text-gray-600">Results from the DesignAgent iterations appear below.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/upload')} className="text-sm px-3 py-2 border rounded">New upload</button>
          <button onClick={handleCompare} className="text-sm px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={selectedImages.length !== 2}>Compare</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading results...</div>
      ) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results && results.length ? (
            results.map((r) => (
              <div key={r.id || r.url || Math.random()}>
                <ImageCard
                  image={r}
                  title={r.title || r.label || ''}
                  description={(r.labels || []).join(', ')}
                  selectable
                  selected={!!selectedImages.find((s) => s.id === r.id)}
                  onSelect={() => selectImage(r)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {(r.labels || []).map((lbl, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{lbl}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No results yet.</div>
          )}
        </div>
      )}
    </section>
  )
}
