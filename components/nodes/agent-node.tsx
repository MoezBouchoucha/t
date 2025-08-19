"use client"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card, CardContent } from "@/components/ui/card"
import { Bot } from "lucide-react"

export function AgentNode({ data, selected }: NodeProps) {
  return (
    <Card
      className={`min-w-[200px] transition-all ${selected ? "ring-2" : ""}`}
      style={{
        borderColor: selected ? "var(--talan-purple)" : "var(--talan-light-gray-border)",
        backgroundColor: "var(--talan-white)",
        ringColor: "var(--talan-purple)",
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md" style={{ backgroundColor: "var(--talan-light-purple)" }}>
            <Bot className="h-5 w-5" style={{ color: "var(--talan-purple)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate" style={{ color: "var(--talan-dark-gray-blue)" }}>
              {data.name || data.label || "Agent"}
            </h3>
            {data.description && (
              <p className="text-xs mt-1 truncate" style={{ color: "var(--talan-medium-gray)" }}>
                {data.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <Handle
        type="target"
        position={Position.Left}
        style={{
          backgroundColor: "var(--talan-purple)",
          border: "2px solid var(--talan-white)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          backgroundColor: "var(--talan-purple)",
          border: "2px solid var(--talan-white)",
        }}
      />
    </Card>
  )
}
