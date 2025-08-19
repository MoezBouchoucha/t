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
import { Settings, Info, Brain, GitBranch, X, ArrowLeftIcon } from "lucide-react"

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
    [key: string]: any
}

export function PropertiesPanel({ selectedNode, setNodes, onClose }: Readonly<PropertiesPanelProps>) {
    const updateNodeData = (key: string, value: any) => {
        if (!selectedNode || !setNodes) return

        setNodes((nodes) =>
            nodes.map((node) => (node.id === selectedNode.id ? { ...node, data: { ...node.data, [key]: value } } : node)),
        )
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
                            <ArrowLeftIcon className="h-4 w-4" />
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
        const toolData = node.data as NodeData
        if (!toolData.parameters) return null

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
                                    placeholder={param.placeholder}
                                    className="mt-1"
                                    style={{ borderColor: "var(--talan-light-gray-border)" }}
                                />
                            )}
                            {param.type === "select" && (
                                <Select>
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
                                    <Switch />
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
        const agentData = node.data as NodeData
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
                            defaultValue={agentData.systemPrompt || ""}
                            placeholder="Define the agent's behavior and instructions..."
                            className="mt-1"
                            rows={4}
                            style={{ borderColor: "var(--talan-light-gray-border)" }}
                            onChange={(e) => updateNodeData("systemPrompt", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label style={{ color: "var(--talan-medium-gray)" }}>Model</Label>
                        <Select defaultValue="gpt-4">
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="claude-3">Claude 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const renderThinkerConfiguration = (node: Node) => (
        <Card style={{ borderColor: "var(--talan-light-gray-border)" }}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center" style={{ color: "var(--talan-dark-gray-blue)" }}>
                    <Brain className="mr-2 h-4 w-4" />
                    Thinker Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label style={{ color: "var(--talan-medium-gray)" }}>Thinking Strategy</Label>
                    <Select defaultValue="analytical">
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
                    <Label style={{ color: "var(--talan-medium-gray)" }}>Processing Time (ms)</Label>
                    <Input
                        type="number"
                        defaultValue="1000"
                        className="mt-1"
                        style={{ borderColor: "var(--talan-light-gray-border)" }}
                    />
                </div>
            </CardContent>
        </Card>
    )

    const renderConditionalConfiguration = (node: Node) => (
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
                        placeholder="Enter condition logic..."
                        className="mt-1"
                        rows={3}
                        style={{ borderColor: "var(--talan-light-gray-border)" }}
                    />
                </div>
                <div>
                    <Label style={{ color: "var(--talan-medium-gray)" }}>Condition Type</Label>
                    <Select defaultValue="javascript">
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

    return (
        <div className="h-full flex flex-col bg-white">
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
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
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
                                    Label
                                </Label>
                                <Input
                                    id="node-label"
                                    value={nodeData?.label || nodeData?.name || ""}
                                    className="mt-1"
                                    style={{ borderColor: "var(--talan-light-gray-border)" }}
                                    onChange={(e) => updateNodeData("label", e.target.value)}
                                />
                            </div>
                            {nodeData?.description && (
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
                    {selectedNode.type === "conditional" && renderConditionalConfiguration(selectedNode)}
                </div>
            </ScrollArea>
        </div>
    )
}
