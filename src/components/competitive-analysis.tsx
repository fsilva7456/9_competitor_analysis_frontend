'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2 } from 'lucide-react'

// API URLs for each service
const API_URLS = {
  finder: process.env.NEXT_PUBLIC_COMPETITOR_FINDER_URL,
  summarizer: process.env.NEXT_PUBLIC_PROGRAM_SUMMARIZER_URL,
  rewards: process.env.NEXT_PUBLIC_REWARDS_ANALYZER_URL,
  positioning: process.env.NEXT_PUBLIC_COMPETITOR_POSITIONING_URL,
  feedback: process.env.NEXT_PUBLIC_FEEDBACK_ANALYZER_URL,
  swot: process.env.NEXT_PUBLIC_SWOT_ANALYZER_URL,
  compSummary: process.env.NEXT_PUBLIC_COMPETITIVE_SUMMARY_URL,
  opportunities: process.env.NEXT_PUBLIC_DETAILED_OPPORTUNITIES_URL
}

// Rest of the component code remains the same...