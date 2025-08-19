"use client"

import { useState } from "react"
import { WorkflowBuilder } from "@/components/workflow-builder"
import { StatusIndicator } from "@/components/status-indicator"
import { WelcomePage } from "@/components/welcome-page"

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)

  const handleCreateAgent = () => {
    setShowWelcome(false)
  }

  const handleBackToWelcome = () => {
    setShowWelcome(true)
  }

  if (showWelcome) {
    return <WelcomePage onCreateAgent={handleCreateAgent} />
  }

  return (
    <div className="h-screen w-full relative">
      <WorkflowBuilder onBackToWelcome={handleBackToWelcome} />
      <StatusIndicator />
    </div>
  )
}
