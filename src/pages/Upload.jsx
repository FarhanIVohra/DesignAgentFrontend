import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import designAgentService from '../api/designAgentService'
import { useAppContext } from '../context/AppContext'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [concept, setConcept] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setJobId } = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !concept) return
    const fd = new FormData()
    fd.append('image', file)
    fd.append('concept', concept)

    try {
      setLoading(true)
      const res = await designAgentService.generateInitial(fd)
      const job_id = res?.data?.job_id || res?.data?.jobId || res?.data?.id
      if (!job_id) throw new Error('No job id returned')
      setJobId(job_id)
      navigate('/processing')
    } catch (err) {
      console.error('generateInitial failed', err)
      alert('Failed to start generation. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Upload</h1>
      <p className="text-sm text-gray-600">Upload an image and describe your design concept.</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <label className="block">
          <span className="text-sm font-medium">Image</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="mt-2" />
          {file && <div className="text-xs text-gray-500 mt-1">Selected: {file.name} ({file.size} bytes)</div>}
        </label>

        <label className="block">
          <span className="text-sm font-medium">Design brief</span>
          <textarea value={concept} onChange={(e) => setConcept(e.target.value)} rows={5} className="mt-2 w-full border rounded p-2" placeholder="Describe the design goals, style, and constraints" />
        </label>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Starting...' : 'Generate Designs'}
          </button>
        </div>
      </form>
    </section>
  )
}
