'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

// Use environment variable for API URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const CompetitiveAnalysis = () => {
  const [brandName, setBrandName] = useState('')
  const [competitors, setCompetitors] = useState([])
  const [loading, setLoading] = useState({})
  const [error, setError] = useState('')
  const [analysisComplete, setAnalysisComplete] = useState({})

  const runAnalysis = async (endpoint, loadingKey) => {
    setLoading(prev => ({ ...prev, [loadingKey]: true }))
    setError('')
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${brandName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_name: brandName })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.detail || 'Analysis failed')
      }
      
      const data = await response.json()
      setAnalysisComplete(prev => ({ ...prev, [loadingKey]: true }))
      
      // Update competitors list if this is the competitor finder
      if (loadingKey === 'finder') {
        setCompetitors(data.competitors || [])
      }
      
      return data
    } catch (err) {
      setError(`Error in ${loadingKey}: ${err.message}`)
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }))
    }
  }

  // Rest of the component remains the same...
