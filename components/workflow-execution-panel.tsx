"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info, AlertCircle, CheckCircle, Trash2 } from "lucide-react"

interface ExecutionLog {
  id: string
  timestamp: Date
  level: "info" | "error" | "success"
  message: string
}

interface WorkflowExecutionPanelProps {
  logs: ExecutionLog[]
  onClose: () => void
}

export function WorkflowExecutionPanel({ logs, onClose }: WorkflowExecutionPanelProps) {
  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4" style={{ color: "var(--talan-red)" }} />
      case "success":
        return <CheckCircle className="h-4 w-4" style={{ color: "var(--talan-green)" }} />
      default:
        return <Info className="h-4 w-4" style={{ color: "var(--talan-light-blue)" }} />
    }
  }

  const getLogBadgeStyle = (level: string) => {
    switch (level) {
      case "error":
        return { backgroundColor: "var(--talan-red)", color: "var(--talan-white)" }
      case "success":
        return { backgroundColor: "var(--talan-green)", color: "var(--talan-white)" }
      default:
        return { backgroundColor: "var(--talan-light-blue)", color: "var(--talan-white)" }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--talan-light-gray-border)" }}
      >
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold" style={{ color: "var(--talan-dark-gray-blue)" }}>
            Execution Logs
          </h3>
          <Badge
            variant="secondary"
            style={{
              backgroundColor: "var(--talan-light-gray)",
              color: "var(--talan-medium-gray)",
            }}
          >
            {logs.length} entries
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost">
            <Trash2 className="h-4 w-4" style={{ color: "var(--talan-medium-gray)" }} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" style={{ color: "var(--talan-medium-gray)" }} />
          </Button>
        </div>
      </div>

      {/* Logs */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--talan-medium-gray)" }} />
              <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                No execution logs yet. Run the workflow to see logs here.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-3 p-3 rounded-md"
                style={{ backgroundColor: "var(--talan-light-gray)" }}
              >
                {getLogIcon(log.level)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className="text-xs" style={getLogBadgeStyle(log.level)}>
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className="text-xs" style={{ color: "var(--talan-medium-gray)" }}>
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--talan-dark-gray-blue)" }}>
                    {log.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
