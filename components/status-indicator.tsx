"use client"

import { Badge } from "@/components/ui/badge"
import { useApp } from "@/lib/workflow-store"
import { Wifi, Save, AlertCircle } from "lucide-react"

export function StatusIndicator() {
  const { state } = useApp()

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 z-50">
      {/* Connection Status */}
      {/* <Badge
        variant="outline"
        className="flex items-center space-x-1"
        style={{
          backgroundColor: "var(--talan-white)",
          borderColor: "var(--talan-green)",
          color: "var(--talan-green)",
        }}
      >
        <Wifi className="h-3 w-3" />
        <span>Connected</span>
      </Badge> */}

      {/* Save Status */}
      {state.currentWorkflow.hasUnsavedChanges && (
        <Badge
          variant="outline"
          className="flex items-center space-x-1"
          style={{
            backgroundColor: "var(--talan-white)",
            borderColor: "var(--talan-light-blue)",
            color: "var(--talan-light-blue)",
          }}
        >
          <Save className="h-3 w-3" />
          <span>Unsaved changes</span>
        </Badge>
      )}

      {/* Auto-saving indicator */}
      {state.currentWorkflow.isAutoSaving && (
        <Badge
          variant="outline"
          className="flex items-center space-x-1"
          style={{
            backgroundColor: "var(--talan-white)",
            borderColor: "var(--talan-purple)",
            color: "var(--talan-purple)",
          }}
        >
          <Save className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </Badge>
      )}

      {/* Error indicator */}
      {state.error && (
        <Badge
          variant="outline"
          className="flex items-center space-x-1"
          style={{
            backgroundColor: "var(--talan-white)",
            borderColor: "var(--talan-red)",
            color: "var(--talan-red)",
          }}
        >
          <AlertCircle className="h-3 w-3" />
          <span>Error</span>
        </Badge>
      )}
    </div>
  )
}
