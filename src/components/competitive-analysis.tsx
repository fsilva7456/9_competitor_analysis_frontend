'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2 } from 'lucide-react'

// Define API endpoints
const API_ENDPOINTS = {
  finder: '/analyze-competitors',
  summarizer: '/analyze-program',
  rewards: '/analyze-rewards',
  positioning: '/analyze-positioning',
  feedback: '/analyze-feedback',
  swot: '/analyze-swot',
  compSummary: '/analyze-competitive-summary',
  opportunities: '/analyze-opportunities'
}

// ... [previous type definitions remain the same]

// Helper function to ensure URL has protocol
const ensureHttps = (url: string | undefined): string => {
  if (!url) return '';
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}

// API URLs for each service - ensure these include https://
const API_URLS: ApiUrls = {
  finder: ensureHttps(process.env.NEXT_PUBLIC_COMPETITOR_FINDER_URL),
  summarizer: ensureHttps(process.env.NEXT_PUBLIC_PROGRAM_SUMMARIZER_URL),
  rewards: ensureHttps(process.env.NEXT_PUBLIC_REWARDS_ANALYZER_URL),
  positioning: ensureHttps(process.env.NEXT_PUBLIC_COMPETITOR_POSITIONING_URL),
  feedback: ensureHttps(process.env.NEXT_PUBLIC_FEEDBACK_ANALYZER_URL),
  swot: ensureHttps(process.env.NEXT_PUBLIC_SWOT_ANALYZER_URL),
  compSummary: ensureHttps(process.env.NEXT_PUBLIC_COMPETITIVE_SUMMARY_URL),
  opportunities: ensureHttps(process.env.NEXT_PUBLIC_DETAILED_OPPORTUNITIES_URL)
}

const CompetitiveAnalysis: React.FC = () => {
  const [brandName, setBrandName] = useState('')
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState<LoadingState>({})
  const [error, setError] = useState('')
  const [analysisComplete, setAnalysisComplete] = useState<AnalysisComplete>({})

  const runAnalysis = async (endpoint: string, loadingKey: LoadingKey) => {
    setLoading(prev => ({ ...prev, [loadingKey]: true }))
    setError('')
    
    try {
      if (!API_URLS[loadingKey]) {
        throw new Error(`API URL not configured for ${loadingKey}`)
      }

      // Construct the full URL using the base URL and the correct endpoint
      const url = `${API_URLS[loadingKey]}${API_ENDPOINTS[loadingKey]}`
      console.log(`Making request to: ${url}`)
      console.log('Request body:', { brand_name: brandName })

      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ brand_name: brandName })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.detail || `${loadingKey} analysis failed (${response.status})`
        } catch {
          errorMessage = `${loadingKey} analysis failed (${response.status}: ${response.statusText})`
        }
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      setAnalysisComplete(prev => ({ ...prev, [loadingKey]: true }))
      
      // Update competitors list if this is the competitor finder
      if (loadingKey === 'finder') {
        const updatedCompetitors = data.competitors || []
        setCompetitors(updatedCompetitors)
        console.log('Found competitors:', updatedCompetitors)
      }

      // Refresh competitor data after other analyses
      if (loadingKey !== 'finder' && competitors.length > 0) {
        const finderUrl = `${API_URLS.finder}${API_ENDPOINTS.finder}`
        console.log(`Refreshing data from: ${finderUrl}`)
        const finderResponse = await fetch(finderUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ brand_name: brandName })
        })
        if (finderResponse.ok) {
          const refreshedData = await finderResponse.json()
          setCompetitors(refreshedData.competitors || [])
        }
      }
      
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error(`Error in ${loadingKey}:`, errorMessage)
      setError(`Error in ${loadingKey}: ${errorMessage}`)
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }))
    }
  }

  // ... [rest of the component remains the same]

  return (
    // ... [JSX remains the same]
  )
}

export default CompetitiveAnalysis