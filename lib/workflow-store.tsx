"use client"

import type React from "react"

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"
import type { Node, Edge } from "reactflow"
import { type SaveOptions } from "@/components/dialogs/save-workflow-dialog"
import { dummyTemplates } from "./template-loader"

// Types
interface WorkflowState {
  id: string
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
  status: "idle" | "running" | "completed" | "error"
  createdAt: Date
  updatedAt: Date
  isAutoSaving: boolean
  hasUnsavedChanges: boolean
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  author: string
  createdAt: Date
  updatedAt: Date
  downloads: number
  rating: number
  isPublic: boolean
  shareLevel: "private" | "link" | "public"
  nodes?: number
  complexity?: "simple" | "medium" | "complex"
  workflow: {
    nodes: Node[]
    edges: Edge[]
  }
}

export type { Template }

interface ExecutionLog {
  id: string
  timestamp: Date
  level: "info" | "error" | "success"
  message: string
  nodeId?: string
}

interface AppState {
  currentWorkflow: WorkflowState
  templates: Template[]
  myTemplates: Template[]
  executionLogs: ExecutionLog[]
  isLoading: boolean
  error: string | null
  settings: {
    autoSave: boolean
    executionTimeout: number
    logLevel: "debug" | "info" | "warn" | "error"
    parallelExecution: boolean
  }
}

// Actions
type AppAction =
  | { type: "SET_WORKFLOW_NAME"; payload: string }
  | { type: "SET_WORKFLOW_DESCRIPTION"; payload: string }
  | { type: "SET_NODES"; payload: Node[] }
  | { type: "SET_EDGES"; payload: Edge[] }
  | { type: "SET_WORKFLOW_STATUS"; payload: WorkflowState["status"] }
  | { type: "ADD_EXECUTION_LOG"; payload: Omit<ExecutionLog, "id" | "timestamp"> }
  | { type: "CLEAR_EXECUTION_LOGS" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_TEMPLATE"; payload: Template }
  | { type: "ADD_TEMPLATE"; payload: Template }
  | { type: "UPDATE_TEMPLATE"; payload: { id: string; updates: Partial<Template> } }
  | { type: "DELETE_TEMPLATE"; payload: string }
  | { type: "SET_TEMPLATES"; payload: Template[] }
  | { type: "SET_MY_TEMPLATES"; payload: Template[] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppState["settings"]> }
  | { type: "MARK_SAVED" }
  | { type: "MARK_UNSAVED" }
  | { type: "RESET_WORKFLOW" }

// Initial state
const initialState: AppState = {
  currentWorkflow: {
    id: "new-workflow",
    name: "Untitled Workflow",
    description: "",
    nodes: [],
    edges: [],
    status: "idle",
    createdAt: new Date(),
    updatedAt: new Date(),
    isAutoSaving: false,
    hasUnsavedChanges: false,
  },
  templates: dummyTemplates,
  myTemplates: [],
  executionLogs: [],
  isLoading: false,
  error: null,
  settings: {
    autoSave: true,
    executionTimeout: 300,
    logLevel: "info",
    parallelExecution: false,
  },
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_WORKFLOW_NAME":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          name: action.payload,
          updatedAt: new Date(),
          hasUnsavedChanges: true,
        },
      }

    case "SET_WORKFLOW_DESCRIPTION":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          description: action.payload,
          updatedAt: new Date(),
          hasUnsavedChanges: true,
        },
      }

    case "SET_NODES":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          nodes: action.payload,
          updatedAt: new Date(),
          hasUnsavedChanges: true,
        },
      }

    case "SET_EDGES":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          edges: action.payload,
          updatedAt: new Date(),
          hasUnsavedChanges: true,
        },
      }

    case "SET_WORKFLOW_STATUS":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          status: action.payload,
        },
      }

    case "ADD_EXECUTION_LOG":
      const newLog: ExecutionLog = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
      return {
        ...state,
        executionLogs: [newLog, ...state.executionLogs].slice(0, 100), // Keep last 100 logs
      }

    case "CLEAR_EXECUTION_LOGS":
      return {
        ...state,
        executionLogs: [],
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }

    case "LOAD_TEMPLATE":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          name: action.payload.name,
          description: action.payload.description,
          nodes: action.payload.workflow.nodes,
          edges: action.payload.workflow.edges,
          updatedAt: new Date(),
          hasUnsavedChanges: true,
        },
      }

    case "ADD_TEMPLATE":
      return {
        ...state,
        myTemplates: [...state.myTemplates, action.payload],
      }

    case "UPDATE_TEMPLATE":
      return {
        ...state,
        myTemplates: state.myTemplates.map((template) =>
          template.id === action.payload.id ? { ...template, ...action.payload.updates } : template,
        ),
      }

    case "DELETE_TEMPLATE":
      return {
        ...state,
        myTemplates: state.myTemplates.filter((template) => template.id !== action.payload),
      }

    case "SET_TEMPLATES":
      return {
        ...state,
        templates: action.payload,
      }

    case "SET_MY_TEMPLATES":
      return {
        ...state,
        myTemplates: action.payload,
      }

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      }

    case "MARK_SAVED":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          hasUnsavedChanges: false,
          isAutoSaving: false,
        },
      }

    case "MARK_UNSAVED":
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          hasUnsavedChanges: true,
        },
      }

    case "RESET_WORKFLOW":
      return {
        ...state,
        currentWorkflow: {
          ...initialState.currentWorkflow,
          id: `workflow-${Date.now()}`,
        },
        executionLogs: [],
      }

    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  actions: {
    setWorkflowName: (name: string) => void
    setWorkflowDescription: (description: string) => void
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    setWorkflowStatus: (status: WorkflowState["status"]) => void
    addExecutionLog: (log: Omit<ExecutionLog, "id" | "timestamp">) => void
    clearExecutionLogs: () => void
    loadTemplate: (template: Template) => void
    saveWorkflow: (options?: SaveOptions) => Promise<void>
    resetWorkflow: () => void
    validateWorkflow: () => { isValid: boolean; errors: string[] }
  }
} | null>(null)

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Actions
  const setWorkflowName = useCallback((name: string) => {
    dispatch({ type: "SET_WORKFLOW_NAME", payload: name })
  }, [])

  const setWorkflowDescription = useCallback((description: string) => {
    dispatch({ type: "SET_WORKFLOW_DESCRIPTION", payload: description })
  }, [])

  const setNodes = useCallback((nodes: Node[]) => {
    dispatch({ type: "SET_NODES", payload: nodes })
  }, [])

  const setEdges = useCallback((edges: Edge[]) => {
    dispatch({ type: "SET_EDGES", payload: edges })
  }, [])

  const setWorkflowStatus = useCallback((status: WorkflowState["status"]) => {
    dispatch({ type: "SET_WORKFLOW_STATUS", payload: status })
  }, [])

  const addExecutionLog = useCallback((log: Omit<ExecutionLog, "id" | "timestamp">) => {
    dispatch({ type: "ADD_EXECUTION_LOG", payload: log })
  }, [])

  const clearExecutionLogs = useCallback(() => {
    dispatch({ type: "CLEAR_EXECUTION_LOGS" })
  }, [])

  const loadTemplate = useCallback(
    (template: Template) => {
      dispatch({ type: "LOAD_TEMPLATE", payload: template })
      addExecutionLog({
        level: "info",
        message: `Loaded template: ${template.name}`,
      })
    },
    [addExecutionLog],
  )

  const saveWorkflow = useCallback(async (options?: SaveOptions) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      // Simulate API call with save options
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update workflow name if provided
      if (options?.name && options.name !== state.currentWorkflow.name) {
        dispatch({ type: "SET_WORKFLOW_NAME", payload: options.name })
      }

      dispatch({ type: "MARK_SAVED" })

      // Log save with sharing information
      const shareMessage = options?.shareLevel === "public"
        ? " and made public"
        : options?.shareLevel === "link"
          ? " with shareable link"
          : ""

      addExecutionLog({
        level: "success",
        message: `Workflow "${options?.name || state.currentWorkflow.name}" saved successfully${shareMessage}`,
      })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to save workflow" })
      addExecutionLog({
        level: "error",
        message: "Failed to save workflow",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.currentWorkflow.name, addExecutionLog])

  const resetWorkflow = useCallback(() => {
    dispatch({ type: "RESET_WORKFLOW" })
    addExecutionLog({
      level: "info",
      message: "Workflow reset",
    })
  }, [addExecutionLog])

  const validateWorkflow = useCallback(() => {
    const errors: string[] = []
    const { nodes, edges } = state.currentWorkflow

    if (nodes.length === 0) {
      errors.push("Workflow must contain at least one node")
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>()
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    const disconnectedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id) && nodes.length > 1)

    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} disconnected node(s)`)
    }

    // Check for start node
    const hasStartNode = nodes.some((node) => !edges.some((edge) => edge.target === node.id))

    if (!hasStartNode && nodes.length > 1) {
      errors.push("Workflow must have a start node")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }, [state.currentWorkflow])

  const actions = {
    setWorkflowName,
    setWorkflowDescription,
    setNodes,
    setEdges,
    setWorkflowStatus,
    addExecutionLog,
    clearExecutionLogs,
    loadTemplate,
    saveWorkflow,
    resetWorkflow,
    validateWorkflow,
  }

  return <AppContext.Provider value={{ state, dispatch, actions }}>{children}</AppContext.Provider>
}

// Hook
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
