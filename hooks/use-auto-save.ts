"use client"

import { useEffect, useRef } from "react"
import { useApp } from "@/lib/workflow-store"

export function useAutoSave() {
  const { state, actions } = useApp()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (state.settings.autoSave && state.currentWorkflow.hasUnsavedChanges) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout for auto-save
      timeoutRef.current = setTimeout(() => {
        actions.saveWorkflow()
      }, 2000) // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [state.currentWorkflow.hasUnsavedChanges, state.settings.autoSave, actions])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}
