"use client"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card, CardContent } from "@/components/ui/card"
import { Brain } from "lucide-react"

export function ThinkerNode({ data, selected }: NodeProps) {
  return (
    <Card
      className={`min-w-[220px] transition-all ${selected ? "ring-2" : ""}`}
      style={{
        borderColor: selected ? "var(--talan-pink-magenta)" : "var(--talan-light-gray-border)",
        backgroundColor: "var(--talan-white)",
        ringColor: "var(--talan-pink-magenta)",
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md" style={{ backgroundColor: "rgba(233, 30, 99, 0.1)" }}>
            <Brain className="h-5 w-5" style={{ color: "var(--talan-pink-magenta)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate" style={{ color: "var(--talan-dark-gray-blue)" }}>
              {data.name || "Thinker LLM"}
            </h3>
            <p className="text-xs mt-1 truncate" style={{ color: "var(--talan-medium-gray)" }}>
              React orchestrator
            </p>
          </div>
        </div>
      </CardContent>

      <Handle
        type="target"
        position={Position.Left}
        style={{
          backgroundColor: "var(--talan-pink-magenta)",
          border: "2px solid var(--talan-white)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          backgroundColor: "var(--talan-pink-magenta)",
          border: "2px solid var(--talan-white)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="tools"
        style={{
          backgroundColor: "var(--talan-purple)",
          border: "2px solid var(--talan-white)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </Card>
  )
}
