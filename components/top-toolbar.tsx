"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Play,
  Square,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit2,
  Check,
  X,
  Download,
  Upload,
} from "lucide-react"
import { SaveWorkflowDialog, type SaveOptions } from "./dialogs/save-workflow-dialog"
import { WorkflowSettingsDialog } from "./dialogs/workflow-settings-dialog"
import { TemplateBrowser } from "./template-browser"
import { TemplateManager } from "./template-manager"
import { CreateTemplateDialog } from "./dialogs/create-template-dialog"
import { TextToGraphDialog } from "./text-to-graph-dialog"

interface TopToolbarProps {
  workflowName: string
  onWorkflowNameChange: (name: string) => void
  workflowStatus: "idle" | "running" | "completed" | "error"
  onRun: () => void
  onStop: () => void
  onSave: (options: SaveOptions) => void
  isValid: boolean
  validationErrors: string[]
  onBackToWelcome?: () => void
  onGenerateFromText?: (description: string) => Promise<void>
}

export function TopToolbar({
  workflowName,
  onWorkflowNameChange,
  workflowStatus,
  onRun,
  onStop,
  onSave,
  isValid,
  validationErrors,
  onBackToWelcome,
  onGenerateFromText,
}: Readonly<TopToolbarProps>) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(workflowName)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [templateBrowserOpen, setTemplateBrowserOpen] = useState(false)
  const [templateManagerOpen, setTemplateManagerOpen] = useState(false)
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNameEdit = () => {
    setTempName(workflowName)
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    onWorkflowNameChange(tempName)
    setIsEditingName(false)
  }

  const handleNameCancel = () => {
    setTempName(workflowName)
    setIsEditingName(false)
  }

  const getStatusBadge = () => {
    switch (workflowStatus) {
      case "running":
        return (
          <Badge
            className="ml-2"
            style={{
              backgroundColor: "var(--talan-light-blue)",
              color: "var(--talan-white)",
            }}
          >
            <Clock className="mr-1 h-3 w-3" />
            Running
          </Badge>
        )
      case "completed":
        return (
          <Badge
            className="ml-2"
            style={{
              backgroundColor: "var(--talan-green)",
              color: "var(--talan-white)",
            }}
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "error":
        return (
          <Badge
            className="ml-2"
            style={{
              backgroundColor: "var(--talan-red)",
              color: "var(--talan-white)",
            }}
          >
            <AlertCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  const handleTemplateSelect = (template: any) => {
    console.log("Selected template:", template)
    setTemplateBrowserOpen(false)
    // Here you would load the template into the workflow
  }

  // Function to download workflow as JSON
  const handleDownloadJSON = () => {
    // Get workflow data from the current state
    const nodes = window.reactFlowInstance?.getNodes() || []
    const edges = window.reactFlowInstance?.getEdges() || []

    // Create a deep copy of nodes to ensure all data is preserved
    const serializedNodes = nodes.map(node => {
      // Create a complete deep copy of the node and its data
      // This ensures we preserve ALL properties without having to list them individually
      const nodeCopy = JSON.parse(JSON.stringify(node));
      
      // Make sure we have a data object
      if (!nodeCopy.data) {
        nodeCopy.data = {};
      }
      
      // Ensure status is set
      if (!nodeCopy.data.status) {
        nodeCopy.data.status = 'idle';
      }
      
      return nodeCopy;
    })

    const workflowData = {
      name: workflowName,
      nodes: serializedNodes,
      edges: edges,
      version: "1.0" // Adding version for future compatibility
    }

    // Create a blob with the JSON data
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' })

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)

        // Validate the JSON structure
        if (!jsonData.nodes || !jsonData.edges) {
          throw new Error('Invalid workflow JSON format')
        }

        // Update workflow name if available
        if (jsonData.name) {
          onWorkflowNameChange(jsonData.name)
        }

        // Process nodes to ensure all data is properly restored
        const processedNodes = jsonData.nodes.map((node: any) => {
          // Create a properly structured node with all required properties
          const nodeData = node.data || {};
          
          // Prepare node-specific properties with defaults
          const nodeSpecificProps: Record<string, any> = {};
          
          // Handle specific node types and their unique parameters
          if (node.type === 'tool') {
            if (nodeData.id === 'web-search') {
              // Restore search engine specific parameters
              nodeSpecificProps.searchEngine = nodeData.searchEngine || 'google';
              nodeSpecificProps.safeSearch = nodeData.safeSearch !== undefined ? nodeData.safeSearch : true;
              nodeSpecificProps.maxResults = nodeData.maxResults || 10;
            } else if (nodeData.id === 'send-mail') {
              // Restore email specific parameters
              nodeSpecificProps.recipients = nodeData.recipients || [];
              nodeSpecificProps.subject = nodeData.subject || '';
              nodeSpecificProps.template = nodeData.template || '';
              nodeSpecificProps.attachments = nodeData.attachments || [];
            } else if (nodeData.id === 'deep-search') {
              // Restore deep search parameters
              nodeSpecificProps.depth = nodeData.depth || 3;
              nodeSpecificProps.breadth = nodeData.breadth || 5;
              nodeSpecificProps.filters = nodeData.filters || [];
            } else if (nodeData.id === 'scraping') {
              // Restore scraping parameters
              nodeSpecificProps.selectors = nodeData.selectors || [];
              nodeSpecificProps.format = nodeData.format || 'json';
            }
          } else if (node.type === 'conditional') {
            // Restore conditional edge parameters
            nodeSpecificProps.condition = nodeData.condition || '';
            nodeSpecificProps.conditionType = nodeData.conditionType || 'javascript';
          } else if (node.type === 'rag') {
            // Restore RAG-specific parameters
            nodeSpecificProps.vectorDb = nodeData.vectorDb || 'pinecone';
            nodeSpecificProps.embeddingModel = nodeData.embeddingModel || 'text-embedding-ada-002';
            nodeSpecificProps.chunkSize = nodeData.chunkSize || 1000;
            nodeSpecificProps.topK = nodeData.topK || 5;
          }
          
          return {
            ...node,
            // Ensure node data is properly restored with all important properties
            data: {
              ...nodeData,
              // Restore any default values for properties that might be missing
              name: nodeData.name || '',
              label: nodeData.label || '',
              description: nodeData.description || '',
              systemPrompt: nodeData.systemPrompt || '',
              capabilities: Array.isArray(nodeData.capabilities) ? nodeData.capabilities : [],
              parameters: nodeData.parameters || {},
              model: nodeData.model || '',
              strategy: nodeData.strategy || '',
              // Include node-specific properties
              ...nodeSpecificProps,
              status: nodeData.status || 'idle'
            }
          };
        })

        // Load the processed nodes and edges into the workflow
        if (window.reactFlowInstance) {
          window.reactFlowInstance.setNodes(processedNodes)
          window.reactFlowInstance.setEdges(jsonData.edges)
        }
      } catch (error) {
        console.error('Error loading workflow:', error)
        alert('Failed to load workflow. The file may be corrupted or in an invalid format.')
      }
    }
    reader.readAsText(file)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="h-full flex items-center px-6 bg-gradient-to-r from-white to-gray-50">
        {/* Left side - Primary Actions */}
        <div className="flex items-center space-x-4">
          {onGenerateFromText && (
            <TextToGraphDialog
              onGenerateWorkflow={onGenerateFromText}
              isGenerating={workflowStatus === "running"}
            />
          )}

          <Button
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-sm"
            suppressHydrationWarning
          >
            <Save className="mr-2 h-4 w-4" />
            Save Workflow
          </Button>

          {/* Download JSON Button */}
          <Button
            size="sm"
            onClick={handleDownloadJSON}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-sm"
            suppressHydrationWarning
          >
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>

          {/* Upload JSON Button */}
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-sm"
            suppressHydrationWarning
          >
            <Upload className="mr-2 h-4 w-4" />
            Load JSON
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>

        {/* Center - Workflow name and status */}
        <div className="flex-1 flex items-center justify-center">
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-center font-semibold border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                style={{ maxWidth: "300px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameSave()
                  if (e.key === "Escape") handleNameCancel()
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleNameSave} className="text-green-600 hover:text-green-700">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleNameCancel} className="text-red-600 hover:text-red-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleNameEdit}
            >
              <h1 className="text-lg font-semibold text-gray-800">
                {workflowName}
              </h1>
              <Edit2 className="h-4 w-4 text-gray-400" />
              {getStatusBadge()}
            </button>
          )}
        </div>

        {/* Right side - Execution and secondary actions */}
        <div className="flex items-center space-x-3">

          <div className="h-6 w-px bg-gray-300" />

          {/* Validation indicator */}
          {!isValid && (
            <Badge
              variant="outline"
              className="text-xs border-red-300 text-red-600"
              title={validationErrors.join(", ")}
            >
              <AlertCircle className="mr-1 h-3 w-3" />
              {validationErrors.length} Error{validationErrors.length !== 1 ? "s" : ""}
            </Badge>
          )}

          {/* Execution controls */}
          {workflowStatus === "running" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onStop}
              className="border-red-300 text-red-600 hover:bg-red-50"
              suppressHydrationWarning
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onRun}
              disabled={!isValid}
              className={`${isValid
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } border-0 shadow-sm`}
              suppressHydrationWarning
            >
              <Play className="mr-2 h-4 w-4" />
              Run Workflow
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSettingsDialogOpen(true)}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <SaveWorkflowDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        workflowName={workflowName}
        onSave={onSave}
      />
      <WorkflowSettingsDialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen} />

      {templateBrowserOpen && (
        <div className="fixed inset-0 z-50" style={{ backgroundColor: "var(--talan-white)" }}>
          <TemplateBrowser onSelectTemplate={handleTemplateSelect} onClose={() => setTemplateBrowserOpen(false)} />
        </div>
      )}

      {templateManagerOpen && (
        <div className="fixed inset-0 z-50" style={{ backgroundColor: "var(--talan-white)" }}>
          <TemplateManager onClose={() => setTemplateManagerOpen(false)} />
        </div>
      )}

      <CreateTemplateDialog
        open={createTemplateOpen}
        onOpenChange={setCreateTemplateOpen}
        currentWorkflow={{
          name: workflowName,
          description: "Current workflow",
          nodes: 5, // This would come from actual node count
        }}
      />
    </>
  )
}
