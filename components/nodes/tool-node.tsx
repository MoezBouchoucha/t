"use client"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Globe, Mail, Search, FileText } from "lucide-react"

const toolIcons = {
  rag: Database,
  "web-search": Globe,
  "send-mail": Mail,
  "deep-search": Search,
  scraping: FileText,
}

export function ToolNode({ data, selected }: NodeProps) {
  const IconComponent = toolIcons[data.id as keyof typeof toolIcons] || Database

  return (
    <Card
      className={`min-w-[180px] transition-all ${selected ? "ring-2" : ""}`}
      style={{
        borderColor: selected ? "var(--talan-light-blue)" : "var(--talan-light-gray-border)",
        backgroundColor: "var(--talan-white)",
        ringColor: "var(--talan-light-blue)",
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md" style={{ backgroundColor: "var(--talan-light-blue-hover)" }}>
            <IconComponent className="h-4 w-4" style={{ color: "var(--talan-light-blue)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate" style={{ color: "var(--talan-dark-gray-blue)" }}>
              {data.name}
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
          backgroundColor: "var(--talan-light-blue)",
          border: "2px solid var(--talan-white)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          backgroundColor: "var(--talan-light-blue)",
          border: "2px solid var(--talan-white)",
        }}
      />
    </Card>
  )
}
