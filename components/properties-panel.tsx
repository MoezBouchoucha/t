"use client"
import type { Node } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Info, Brain, GitBranch, ArrowLeft } from "lucide-react"
import { useNodeUpdate } from "@/hooks/use-node-update"

interface PropertiesPanelProps {
  selectedNode: Node | null
  setNodes?: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void
  onClose?: () => void
}

interface NodeData {
  label?: string
  name?: string
  description?: string
  systemPrompt?: string
  capabilities?: string[]
  parameters?: Record<string, any>
  parameterValues?: Record<string, any>
  model?: string
  strategy?: string
  vectorDb?: string
  embeddingModel?: string
  chunkSize?: number
  topK?: number
  condition?: string
  conditionType?: string
  [key: string]: any
}

export function PropertiesPanel({ selectedNode, setNodes, onClose }: Readonly<PropertiesPanelProps>) {
  const { updateNode } = useNodeUpdate()

  const updateNodeData = (key: string, value: any) => {
    if (!selectedNode || !setNodes) return

    updateNode(selectedNode.id, { [key]: value }, setNodes)
  }

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--talan-light-gray-border)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--talan-dark-gray-blue)" }}>
            Properties
          </h2>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              style={{ color: "var(--talan-medium-gray)" }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Info className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--talan-medium-gray)" }} />
            <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
              Select a node to view its properties
            </p>
          </div>
        </div>
      </div>
    )
  }

  const nodeData = selectedNode.data as NodeData

  const renderToolConfiguration = (node: Node) => {
    const toolData = selectedNode.data as NodeData
    if (!toolData.parameters) return null

    // Ensure we have a parameterValues object to store actual values
    const parameterValues = toolData.parameterValues || {}

    return (
      <Card style={{ borderColor: "var(--talan-light-gray-border)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm" style={{ color: "var(--talan-dark-gray-blue)" }}>
            Tool Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(toolData.parameters).map(([key, param]: [string, any]) => (
            <div key={key}>
              <Label style={{ color: "var(--talan-medium-gray)" }}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
              </Label>
              {param.type === "text" && (
                <Input
                  value={parameterValues[key] || ""}
                  placeholder={param.placeholder}
                  className="mt-1"
                  style={{ borderColor: "var(--talan-light-gray-border)" }}
                  onChange={(e) => {
                    const newValues = { ...parameterValues, [key]: e.target.value }
                    updateNodeData("parameterValues", newValues, true)
                  }}
                />
              )}
              {param.type === "select" && (
                <Select
                  value={parameterValues[key] || ""}
                  onValueChange={(value) => {
                    const newValues = { ...parameterValues, [key]: value }
                    updateNodeData("parameterValues", newValues, true)
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={param.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {param.options?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {param.type === "boolean" && (
                <div className="flex items-center space-x-2 mt-1">
                  <Switch
                    checked={parameterValues[key] || false}
                    onCheckedChange={(checked) => {
                      const newValues = { ...parameterValues, [key]: checked }
                      updateNodeData("parameterValues", newValues)
                    }}
                  />
                  <Label>{param.label}</Label>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const renderAgentConfiguration = (node: Node) => {
    const agentData = selectedNode.data as NodeData
    return (
      <Card style={{ borderColor: "var(--talan-light-gray-border)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm" style={{ color: "var(--talan-dark-gray-blue)" }}>
            Agent Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {agentData.capabilities && Array.isArray(agentData.capabilities) && (
            <div>
              <Label style={{ color: "var(--talan-medium-gray)" }}>Capabilities</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {agentData.capabilities.map((capability: string, index: number) => (
                  <Badge
                    key={`capability-${capability}-${index}`}
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: "var(--talan-light-purple)",
                      color: "var(--talan-purple)",
                    }}
                  >
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>System Prompt</Label>
            <Textarea
              value={agentData.systemPrompt || ""}
              placeholder="Define the agent's behavior and instructions..."
              className="mt-1"
              rows={4}
              style={{ borderColor: "var(--talan-light-gray-border)" }}
              onChange={(e) => updateNodeData("systemPrompt", e.target.value)}
            />
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>LLM Model</Label>
            <Select
              value={agentData.model || "gpt-4"}
              onValueChange={(value) => updateNodeData("model", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderThinkerConfiguration = (node: Node) => {
    const thinkerData = selectedNode.data as NodeData
    return (
      <Card style={{ borderColor: "var(--talan-light-gray-border)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center" style={{ color: "var(--talan-dark-gray-blue)" }}>
            <Brain className="mr-2 h-4 w-4" />
            Thinker Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>LLM Model</Label>
            <Select
              value={thinkerData.model || "gpt-4"}
              onValueChange={(value) => updateNodeData("model", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Thinking Strategy</Label>
            <Select
              value={thinkerData.strategy || "analytical"}
              onValueChange={(value) => updateNodeData("strategy", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analytical">Analytical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="logical">Logical</SelectItem>
                <SelectItem value="intuitive">Intuitive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>System Prompt</Label>
            <Textarea
              value={thinkerData.systemPrompt || ""}
              placeholder="Define the thinker's reasoning approach and guidelines..."
              className="mt-1"
              rows={4}
              style={{ borderColor: "var(--talan-light-gray-border)" }}
              onChange={(e) => updateNodeData("systemPrompt", e.target.value)}
            />
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Available Tools Connection</Label>
            <div className="mt-2 p-3 border rounded-md" style={{ borderColor: "var(--talan-light-gray-border)", backgroundColor: "var(--talan-light-purple)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--talan-dark-gray-blue)" }}>
                  Connect to React Agent Tools
                </span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--talan-pink-magenta)" }}></div>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--talan-medium-gray)" }}>
                This connection allows the thinker to access and orchestrate tools available to the React agent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderRAGConfiguration = (node: Node) => {
    const ragData = selectedNode.data as NodeData
    return (
      <Card style={{ borderColor: "var(--talan-light-gray-border)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center" style={{ color: "var(--talan-dark-gray-blue)" }}>
            <Brain className="mr-2 h-4 w-4" />
            RAG Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>LLM Model</Label>
            <Select
              value={ragData.model || "gpt-4"}
              onValueChange={(value) => updateNodeData("model", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Vector Database</Label>
            <Select
              value={ragData.vectorDb || "pinecone"}
              onValueChange={(value) => updateNodeData("vectorDb", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pinecone">Pinecone</SelectItem>
                <SelectItem value="chroma">Chroma</SelectItem>
                <SelectItem value="weaviate">Weaviate</SelectItem>
                <SelectItem value="qdrant">Qdrant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Embedding Model</Label>
            <Select
              value={ragData.embeddingModel || "text-embedding-ada-002"}
              onValueChange={(value) => updateNodeData("embeddingModel", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-embedding-ada-002">OpenAI Ada v2</SelectItem>
                <SelectItem value="text-embedding-3-small">OpenAI v3 Small</SelectItem>
                <SelectItem value="text-embedding-3-large">OpenAI v3 Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Chunk Size</Label>
            <Input
              type="number"
              value={ragData.chunkSize || 1000}
              placeholder="1000"
              className="mt-1"
              style={{ borderColor: "var(--talan-light-gray-border)" }}
              onChange={(e) => updateNodeData("chunkSize", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Top K Results</Label>
            <Input
              type="number"
              value={ragData.topK || 5}
              placeholder="5"
              className="mt-1"
              style={{ borderColor: "var(--talan-light-gray-border)" }}
              onChange={(e) => updateNodeData("topK", parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderConditionalConfiguration = (node: Node) => {
    const conditionalData = selectedNode.data as NodeData
    return (
      <Card style={{ borderColor: "var(--talan-light-gray-border)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center" style={{ color: "var(--talan-dark-gray-blue)" }}>
            <GitBranch className="mr-2 h-4 w-4" />
            Conditional Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Condition</Label>
            <Textarea
              value={conditionalData.condition || ""}
              placeholder="Enter condition logic..."
              className="mt-1"
              rows={3}
              style={{ borderColor: "var(--talan-light-gray-border)" }}
              onChange={(e) => updateNodeData("condition", e.target.value)}
            />
          </div>
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Condition Type</Label>
            <Select
              value={conditionalData.conditionType || "javascript"}
              onValueChange={(value) => updateNodeData("conditionType", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="simple">Simple Expression</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "var(--talan-light-gray-border)" }}>
        <h2 className="text-lg font-semibold" style={{ color: "var(--talan-dark-gray-blue)" }}>
          Properties
        </h2>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            style={{ color: "var(--talan-medium-gray)" }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 w-full">
        <div className="p-4 space-y-6 w-full">
          {/* Node Info */}
          <Card style={{ borderColor: "var(--talan-light-gray-border)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center" style={{ color: "var(--talan-dark-gray-blue)" }}>
                <Settings className="mr-2 h-4 w-4" />
                Node Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="node-id" style={{ color: "var(--talan-medium-gray)" }}>
                  ID
                </Label>
                <Input
                  id="node-id"
                  value={selectedNode.id}
                  readOnly
                  className="mt-1"
                  style={{
                    backgroundColor: "var(--talan-input-meta-background)",
                    borderColor: "var(--talan-light-gray-border)",
                  }}
                />
              </div>
              <div>
                <Label htmlFor="node-type" style={{ color: "var(--talan-medium-gray)" }}>
                  Type
                </Label>
                <Input
                  id="node-type"
                  value={selectedNode.type || "default"}
                  readOnly
                  className="mt-1"
                  style={{
                    backgroundColor: "var(--talan-input-meta-background)",
                    borderColor: "var(--talan-light-gray-border)",
                  }}
                />
              </div>
              <div>
                <Label htmlFor="node-label" style={{ color: "var(--talan-medium-gray)" }}>
                  Node Name
                </Label>
                <Input
                  id="node-label"
                  value={nodeData?.name || nodeData?.label || ""}
                  placeholder="Enter node name..."
                  className="mt-1"
                  style={{ borderColor: "var(--talan-light-gray-border)" }}
                  onChange={(e) => {
                    updateNodeData("name", e.target.value)
                    updateNodeData("label", e.target.value)
                  }}
                />
              </div>
              {nodeData?.description !== undefined && (
                <div>
                  <Label htmlFor="node-description" style={{ color: "var(--talan-medium-gray)" }}>
                    Description
                  </Label>
                  <Textarea
                    id="node-description"
                    value={String(nodeData.description)}
                    className="mt-1"
                    rows={3}
                    style={{ borderColor: "var(--talan-light-gray-border)" }}
                    onChange={(e) => updateNodeData("description", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration based on node type */}
          {selectedNode.type === "tool" && renderToolConfiguration(selectedNode)}
          {selectedNode.type === "agent" && renderAgentConfiguration(selectedNode)}
          {selectedNode.type === "thinker" && renderThinkerConfiguration(selectedNode)}
          {selectedNode.type === "rag" && renderRAGConfiguration(selectedNode)}
          {selectedNode.type === "conditional" && renderConditionalConfiguration(selectedNode)}
        </div>
      </ScrollArea>
    </div>
  )
}
