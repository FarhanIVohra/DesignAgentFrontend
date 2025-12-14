import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ProgressStatus from '../components/ProgressStatus'
import designAgentService from '../api/designAgentService'
import { useAppContext } from '../context/AppContext'

export default function Processing() {
  const { jobId } = useAppContext()
  const navigate = useNavigate()
  const [message, setMessage] = useState('Initializing...')
  const [percent, setPercent] = useState(0)
  const pollingRef = useRef(null)

  useEffect(() => {
    if (!jobId) {
      navigate('/upload')
      return
    }

    const poll = async () => {
      try {
        const res = await designAgentService.getStatus(jobId)
        const data = res.data || {}
        const status = data.status || data.state || 'processing'
        const progress = data.progress ?? data.percent ?? (status === 'completed' ? 100 : 0)
        const msg = data.message || data.note || ''
        setMessage(msg || `Status: ${status}`)
        setPercent(progress)
        if (status === 'completed') {
          clearInterval(pollingRef.current)
          navigate('/results')
        }
      } catch (err) {
        console.error('status poll failed', err)
        setMessage('Error checking status — retrying...')
      }
    }

    // initial poll
    poll()
    pollingRef.current = setInterval(poll, 3000)

    return () => clearInterval(pollingRef.current)
  }, [jobId, navigate])

  return (
    <section className="space-y-6 max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-semibold">Processing</h1>
      <p className="text-sm text-gray-600">Your design is being generated. This may take a minute.</p>

      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded shadow">
        <LoadingSpinner />
        <div className="w-full">
          <ProgressStatus step={percent} total={100} />
          <div className="text-sm text-gray-600 mt-2">{message}</div>
        </div>
      </div>
    </section>
  )
}
