"use client"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card, CardContent } from "@/components/ui/card"
import { GitBranch } from "lucide-react"

export function ConditionalEdgeNode({ data, selected }: NodeProps) {
  return (
    <Card
      className={`min-w-[200px] transition-all ${selected ? "ring-2" : ""}`}
      style={{
        borderColor: selected ? "var(--talan-green)" : "var(--talan-light-gray-border)",
        backgroundColor: "var(--talan-white)",
        ringColor: "var(--talan-green)",
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md" style={{ backgroundColor: "rgba(39, 174, 96, 0.1)" }}>
            <GitBranch className="h-5 w-5" style={{ color: "var(--talan-green)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate" style={{ color: "var(--talan-dark-gray-blue)" }}>
              {data.name || "Conditional Edge"}
            </h3>
            <p className="text-xs mt-1 truncate" style={{ color: "var(--talan-medium-gray)" }}>
              Conditional logic
            </p>
          </div>
        </div>
      </CardContent>

      <Handle
        type="target"
        position={Position.Left}
        style={{
          backgroundColor: "var(--talan-green)",
          border: "2px solid var(--talan-white)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{
          backgroundColor: "var(--talan-green)",
          border: "2px solid var(--talan-white)",
          top: "30%",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{
          backgroundColor: "var(--talan-red)",
          border: "2px solid var(--talan-white)",
          top: "70%",
        }}
      />
    </Card>
  )
}
