"use client"

import React from "react"
import { useCallback, useRef, useEffect } from "react"
import {
  ReactFlow,
  type Node,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { ToolPalette } from "./tool-palette"
import { PropertiesPanel } from "./properties-panel"
import { TopToolbar } from "./top-toolbar"
import { WorkflowExecutionPanel } from "./workflow-execution-panel"
import { TemplateBrowser } from "./template-browser"
import { AgentCreationFab } from "./agent-creation-fab"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AgentNode } from "./nodes/agent-node"
import { ToolNode } from "./nodes/tool-node"
import { ThinkerNode } from "./nodes/thinker-node"
import { ConditionalEdgeNode } from "./nodes/conditional-edge-node"
import { useApp } from "@/lib/workflow-store"
import { useAutoSave } from "@/hooks/use-auto-save"
import { useWorkflowExecution } from "@/hooks/use-workflow-execution"

const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  thinker: ThinkerNode,
  conditional: ConditionalEdgeNode,
}

interface WorkflowBuilderProps {
  onBackToWelcome?: () => void
}

export function WorkflowBuilder({ onBackToWelcome }: Readonly<WorkflowBuilderProps>) {
  const { state, actions } = useApp()
  const { executeWorkflow, stopExecution } = useWorkflowExecution()

  const [nodes, setNodes, onNodesChange] = useNodesState(state.currentWorkflow.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.currentWorkflow.edges)
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null)
  const [showExecutionPanel, setShowExecutionPanel] = React.useState(false)
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = React.useState(false)
  const [templateBrowserOpen, setTemplateBrowserOpen] = React.useState(false)

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null)

  useAutoSave()

  // Assign reactFlowInstance to window object for JSON export/import
  useEffect(() => {
    if (reactFlowInstance) {
      window.reactFlowInstance = reactFlowInstance
    }
  }, [reactFlowInstance])

  // Sync from local state to store (when nodes/edges are added/removed)
  useEffect(() => {
    // Sync both structural and data changes while avoiding infinite loops
    const storedNodes = state.currentWorkflow.nodes
    
    // Deep compare nodes excluding position and selected state
    const hasChanges = nodes.some((node, index) => {
      const storedNode = storedNodes[index]
      return !storedNode || 
        JSON.stringify(node.data) !== JSON.stringify(storedNode.data) ||
        node.type !== storedNode.type
    })

    if (hasChanges || nodes.length !== storedNodes.length) {
      actions.setNodes(nodes)
    }
  }, [nodes, state.currentWorkflow.nodes])

  useEffect(() => {
    const currentEdgeIds = edges.map(e => `${e.source}-${e.target}`).sort((a, b) => a.localeCompare(b)).join(',')
    const storedEdgeIds = state.currentWorkflow.edges.map(e => `${e.source}-${e.target}`).sort((a, b) => a.localeCompare(b)).join(',')

    // Only sync when structure changes (add/remove edges), not data changes
    if (currentEdgeIds !== storedEdgeIds) {
      actions.setEdges(edges)
    }
  }, [edges.length])

  // Sync from store to local state ONLY when template is loaded or workflow is reset
  useEffect(() => {
    const storeNodeCount = state.currentWorkflow.nodes.length
    const localNodeCount = nodes.length

    // Only sync when there's a significant change that suggests template loading
    if (storeNodeCount > 0 && storeNodeCount !== localNodeCount) {
      setNodes(state.currentWorkflow.nodes as Node[])
      setEdges(state.currentWorkflow.edges)
    }
  }, [state.currentWorkflow.id]) // Only trigger on workflow ID change (new workflow/template)

  const validation = actions.validateWorkflow()

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source)
      const targetNode = nodes.find((n) => n.id === params.target)

      if (sourceNode && targetNode) {
        // Prevent self-connections
        if (params.source === params.target) {
          actions.addExecutionLog({
            level: "error",
            message: "Cannot connect a node to itself",
          })
          return
        }

        setEdges((eds) => addEdge(params, eds))
        actions.addExecutionLog({
          level: "info",
          message: `Connected ${sourceNode.data.label || sourceNode.data.name} to ${targetNode.data.label || targetNode.data.name}`,
        })
      }
    },
    [nodes, setEdges, actions],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setIsPropertiesPanelOpen(true)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setIsPropertiesPanelOpen(false)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")
      const nodeData = JSON.parse(event.dataTransfer.getData("application/nodedata"))

      if (typeof type === "undefined" || !type || !reactFlowBounds) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { ...nodeData, status: "idle" },
      }

      setNodes((nds) => nds.concat(newNode))
      actions.addExecutionLog({
        level: "info",
        message: `Added ${nodeData.name || nodeData.label} to workflow`,
      })
    },
    [reactFlowInstance, setNodes, actions],
  )

  const handleRun = useCallback(async () => {
    setShowExecutionPanel(true)
    await executeWorkflow()
  }, [executeWorkflow])

  const handleStop = useCallback(() => {
    stopExecution()
  }, [stopExecution])

  const handleGenerateFromText = useCallback(async (description: string) => {
    // TODO: Implement the actual API call to your backend
    // This is where you'll call your backend service to convert text to graph
    try {
      actions.addExecutionLog({
        level: "info",
        message: `Generating workflow from description: ${description.slice(0, 100)}...`,
      })

      // Placeholder - replace with your actual API call
      const response = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate workflow')
      }

      const { nodes: generatedNodes, edges: generatedEdges } = await response.json()

      // Clear existing workflow and set new generated nodes/edges
      setNodes(generatedNodes)
      setEdges(generatedEdges)
      actions.setNodes(generatedNodes)
      actions.setEdges(generatedEdges)

      actions.addExecutionLog({
        level: "success",
        message: "Workflow generated successfully from text description",
      })
    } catch (error) {
      actions.addExecutionLog({
        level: "error",
        message: `Failed to generate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
      throw error
    }
  }, [setNodes, setEdges, actions])

  const handleTemplateBrowserClick = React.useCallback(() => {
    setTemplateBrowserOpen(true)
  }, [])

  const handleTemplateSelect = React.useCallback((template: any) => {
    console.log("Selected template:", template)
    setTemplateBrowserOpen(false)
    // Here you would load the template into the workflow
  }, [])

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ backgroundColor: "var(--talan-light-gray)" }}>
      {/* Left Sidebar - Tool Palette */}
      <div
        className="border-r flex-shrink-0"
        style={{
          backgroundColor: "var(--talan-white)",
          borderColor: "var(--talan-light-gray-border)",
          width: "360px",
        }}
      >
        <ToolPalette onBackToWelcome={onBackToWelcome} onTemplatesClick={handleTemplateBrowserClick} />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <div
          className="h-16 border-b flex-shrink-0"
          style={{
            backgroundColor: "var(--talan-white)",
            borderColor: "var(--talan-light-gray-border)",
          }}
        >
          <TopToolbar
            workflowName={state.currentWorkflow.name}
            onWorkflowNameChange={actions.setWorkflowName}
            workflowStatus={state.currentWorkflow.status}
            onRun={handleRun}
            onStop={handleStop}
            onSave={actions.saveWorkflow}
            isValid={validation.isValid}
            validationErrors={validation.errors}
            onBackToWelcome={onBackToWelcome}
            onGenerateFromText={handleGenerateFromText}
          />
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 relative min-h-0" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              style={{ backgroundColor: "var(--talan-light-gray)" }}
            >
              <Controls
                style={{
                  backgroundColor: "var(--talan-white)",
                  border: `1px solid var(--talan-light-gray-border)`,
                }}
              />
              <MiniMap
                style={{
                  backgroundColor: "var(--talan-white)",
                  border: `1px solid var(--talan-light-gray-border)`,
                }}
                nodeColor={(node) => {
                  switch (node.type) {
                    case "agent":
                      return "var(--talan-purple)"
                    case "tool":
                      return "var(--talan-light-blue)"
                    case "thinker":
                      return "var(--talan-pink-magenta)"
                    case "conditional":
                      return "var(--talan-green)"
                    default:
                      return "var(--talan-medium-gray)"
                  }
                }}
              />
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--talan-light-gray-border)" />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Execution Panel */}
        {showExecutionPanel && (
          <div
            className="h-64 border-t flex-shrink-0"
            style={{
              backgroundColor: "var(--talan-white)",
              borderColor: "var(--talan-light-gray-border)",
            }}
          >
            <WorkflowExecutionPanel logs={state.executionLogs} onClose={() => setShowExecutionPanel(false)} />
          </div>
        )}
      </div>

      {/* Right Sidebar - Properties Panel */}
      {isPropertiesPanelOpen && (
        <div
          className="w-80 border-l flex-shrink-0 overflow-hidden"
          style={{
            backgroundColor: "var(--talan-white)",
            borderColor: "var(--talan-light-gray-border)",
          }}
        >
          <PropertiesPanel
            selectedNode={selectedNode}
            setNodes={setNodes}
            onClose={() => setIsPropertiesPanelOpen(false)}
          />
        </div>
      )}
      {!isPropertiesPanelOpen && selectedNode && (
        <Button
          onClick={() => setIsPropertiesPanelOpen(true)}
          className="fixed top-1/2 right-4 z-10 h-12 w-12 rounded-full shadow-lg"
          style={{
            backgroundColor: "var(--talan-light-blue)",
            color: "white",
            border: "none",
          }}
          suppressHydrationWarning
        >
          <ArrowLeft className="h-5 w-5 rotate-180" />
        </Button>
      )}

      {/* Agent Creation FAB */}
      <AgentCreationFab />

      {/* Template Browser */}
      {templateBrowserOpen && (
        <div className="fixed inset-0 z-50" style={{ backgroundColor: "var(--talan-white)" }}>
          <TemplateBrowser onSelectTemplate={handleTemplateSelect} onClose={() => setTemplateBrowserOpen(false)} />
        </div>
      )}
    </div>
  )
}
