'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export const CompetitiveAnalysis = () => {
  const [brandName, setBrandName] = useState('')
  const [competitors, setCompetitors] = useState([])
  const [loading, setLoading] = useState({})
  const [error, setError] = useState('')
  const [analysisComplete, setAnalysisComplete] = useState({})

  const API_BASE_URL = 'http://localhost:8000' // Replace with your actual API URL

  const runAnalysis = async (endpoint, loadingKey) => {
    setLoading(prev => ({ ...prev, [loadingKey]: true }))
    setError('')
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${brandName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_name: brandName })
      })
      
      if (!response.ok) throw new Error('Analysis failed')
      
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

  const CompetitorCard = ({ competitor }) => (
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
              onClick={() => runAnalysis('/finder', 'finder')}
              disabled={!brandName || loading.finder}
            >
              {loading.finder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Find Competitors
            </Button>
          </div>
          
          {competitors.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => runAnalysis('/summarizer', 'summary')}
                  disabled={loading.summary}
                >
                  {loading.summary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Programs
                </Button>
                <Button
                  onClick={() => runAnalysis('/rewards', 'rewards')}
                  disabled={loading.rewards}
                >
                  {loading.rewards && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Rewards
                </Button>
                <Button
                  onClick={() => runAnalysis('/positioning', 'positioning')}
                  disabled={loading.positioning}
                >
                  {loading.positioning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Positioning
                </Button>
                <Button
                  onClick={() => runAnalysis('/feedback', 'feedback')}
                  disabled={loading.feedback}
                >
                  {loading.feedback && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Feedback
                </Button>
                <Button
                  onClick={() => runAnalysis('/swot', 'swot')}
                  disabled={loading.swot}
                >
                  {loading.swot && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  SWOT Analysis
                </Button>
              </div>

              {error && (
                <div className="text-red-600 bg-red-50 p-4 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitors.map((competitor, index) => (
                  <CompetitorCard key={index} competitor={competitor} />
                ))}
              </div>

              {/* Summary Analysis Buttons */}
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        onClick={() => runAnalysis('/competitive-summary', 'compSummary')}
                        disabled={loading.compSummary}
                        className="mr-2"
                      >
                        {loading.compSummary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Market Summary
                      </Button>
                      <Button
                        onClick={() => runAnalysis('/opportunities', 'opportunities')}
                        disabled={loading.opportunities}
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
