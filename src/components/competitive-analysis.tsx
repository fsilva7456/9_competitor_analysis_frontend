'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2 } from 'lucide-react'

// Define API endpoints
const API_ENDPOINTS = {
  finder: '/analyze-competitors',
  summarizer: '/update-all',  // Updated endpoint
  rewards: '/analyze-rewards',
  positioning: '/analyze-positioning',
  feedback: '/analyze-feedback',
  swot: '/analyze-swot',
  compSummary: '/analyze-competitive-summary',
  opportunities: '/analyze-opportunities'
}

// Define request body formats
const getRequestBody = (loadingKey: LoadingKey, brandName: string) => {
  switch (loadingKey) {
    case 'finder':
      return { brand_name: brandName }
    case 'summarizer':
      return {}  // Empty body for program summarizer
    default:
      return { brand_name: brandName }
  }
}

[...remaining component code stays the same until the runAnalysis function...]

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

      // Get the appropriate request body
      const requestBody = getRequestBody(loadingKey, brandName)
      console.log('Request body:', requestBody)

      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
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

      // Refresh competitor data after any analysis
      if (competitors.length > 0) {
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

[...rest of the component code stays the same...]
