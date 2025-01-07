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

type Competitor = {
  competitor_name: string
  program_summary?: string
  competitor_positioning?: string
  competitor_rewards_benefits?: string
  competitor_user_feedback?: string
  competitor_strength?: string
  competitor_weakness?: string
  competitor_opportunity?: string
  competitor_threats?: string
}

type LoadingState = {
  [key: string]: boolean
}

type AnalysisComplete = {
  [key: string]: boolean
}

type ApiUrls = {
  finder?: string
  summarizer?: string
  rewards?: string
  positioning?: string
  feedback?: string
  swot?: string
  compSummary?: string
  opportunities?: string
}

type LoadingKey = keyof ApiUrls

// Helper function to ensure URL has protocol
const ensureHttps = (url: string | undefined): string => {
  if (!url) return '';
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}

// API URLs for each service
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

interface CompetitorCardProps {
  competitor: Competitor
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({ competitor }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{competitor.competitor_name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {competitor.program_summary && (
          <div>
            <h4 className="font-semibold">Program Summary:</h4>
            <p>{competitor.program_summary}</p>
          </div>
        )}
        {competitor.competitor_positioning && (
          <div>
            <h4 className="font-semibold">Market Positioning:</h4>
            <p>{competitor.competitor_positioning}</p>
          </div>
        )}
        {competitor.competitor_rewards_benefits && (
          <div>
            <h4 className="font-semibold">Rewards & Benefits:</h4>
            <p>{competitor.competitor_rewards_benefits}</p>
          </div>
        )}
        {competitor.competitor_user_feedback && (
          <div>
            <h4 className="font-semibold">User Feedback:</h4>
            <p>{competitor.competitor_user_feedback}</p>
          </div>
        )}
        {competitor.competitor_strength && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-600">Strengths:</h4>
              <p>{competitor.competitor_strength}</p>
            </div>
            <div>
              <h4 className="font-semibold text-red-600">Weaknesses:</h4>
              <p>{competitor.competitor_weakness}</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600">Opportunities:</h4>
              <p>{competitor.competitor_opportunity}</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600">Threats:</h4>
              <p>{competitor.competitor_threats}</p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)

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

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Competitive Analysis Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              onClick={() => runAnalysis('', 'finder')}
              disabled={!brandName || loading.finder}
            >
              {loading.finder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Find Competitors
            </Button>
          </div>
          
          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-md my-4">
              {error}
            </div>
          )}

          {competitors.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => runAnalysis('', 'summarizer')}
                  disabled={loading.summarizer}
                  className={analysisComplete.summarizer ? 'bg-green-600' : ''}
                >
                  {loading.summarizer && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Programs
                </Button>
                <Button
                  onClick={() => runAnalysis('', 'rewards')}
                  disabled={loading.rewards}
                  className={analysisComplete.rewards ? 'bg-green-600' : ''}
                >
                  {loading.rewards && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Rewards
                </Button>
                <Button
                  onClick={() => runAnalysis('', 'positioning')}
                  disabled={loading.positioning}
                  className={analysisComplete.positioning ? 'bg-green-600' : ''}
                >
                  {loading.positioning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Positioning
                </Button>
                <Button
                  onClick={() => runAnalysis('', 'feedback')}
                  disabled={loading.feedback}
                  className={analysisComplete.feedback ? 'bg-green-600' : ''}
                >
                  {loading.feedback && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Feedback
                </Button>
                <Button
                  onClick={() => runAnalysis('', 'swot')}
                  disabled={loading.swot}
                  className={analysisComplete.swot ? 'bg-green-600' : ''}
                >
                  {loading.swot && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  SWOT Analysis
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitors.map((competitor, index) => (
                  <CompetitorCard key={index} competitor={competitor} />
                ))}
              </div>

              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        onClick={() => runAnalysis('', 'compSummary')}
                        disabled={loading.compSummary}
                        className={`mr-2 ${analysisComplete.compSummary ? 'bg-green-600' : ''}`}
                      >
                        {loading.compSummary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Market Summary
                      </Button>
                      <Button
                        onClick={() => runAnalysis('', 'opportunities')}
                        disabled={loading.opportunities}
                        className={analysisComplete.opportunities ? 'bg-green-600' : ''}
                      >
                        {loading.opportunities && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Analyze Opportunities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CompetitiveAnalysis