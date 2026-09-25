import { useState, useEffect } from 'react'
import api from '../services/api'

export function useApi(endpoint, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(endpoint)
        if (!cancelled) setData(response.data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || "Something went wrong")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, dependencies)

  return { data, loading, error }
}