import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getJob } from '../api'
import JobAddForm from './JobAddForm'

export default function JobEditPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="list-message">Loading job…</p>
  if (error) return <p className="list-message list-message--error">Error: {error}</p>
  return <JobAddForm initialData={job} jobId={Number(id)} />
}
