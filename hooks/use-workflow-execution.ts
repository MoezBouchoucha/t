"use client"

import { useCallback } from "react"
import { useApp } from "@/lib/workflow-store"
import type { Node } from "reactflow"

export function useWorkflowExecution() {
  const { state, actions } = useApp()

  const executeWorkflow = useCallback(async () => {
    const validation = actions.validateWorkflow()
    if (!validation.isValid) {
      actions.addExecutionLog({
        level: "error",
        message: `Validation failed: ${validation.errors.join(", ")}`,
      })
      return
    }

    actions.setWorkflowStatus("running")
    actions.addExecutionLog({
      level: "info",
      message: "Starting workflow execution...",
    })

    try {
      // Update all nodes to running status
      const updatedNodes = state.currentWorkflow.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: "running" },
      }))
      actions.setNodes(updatedNodes)

      // Simulate workflow execution
      await simulateExecution(state.currentWorkflow.nodes, actions.addExecutionLog)

      // Mark as completed
      actions.setWorkflowStatus("completed")
      actions.addExecutionLog({
        level: "success",
        message: "Workflow completed successfully",
      })

      // Update all nodes to completed status
      const completedNodes = state.currentWorkflow.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: "completed" },
      }))
      actions.setNodes(completedNodes)
    } catch (error) {
      actions.setWorkflowStatus("error")
      actions.addExecutionLog({
        level: "error",
        message: `Execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })

      // Update nodes to error status
      const errorNodes = state.currentWorkflow.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: "error" },
      }))
      actions.setNodes(errorNodes)
    }
  }, [state.currentWorkflow.nodes, actions])

  const stopExecution = useCallback(() => {
    actions.setWorkflowStatus("idle")
    actions.addExecutionLog({
      level: "info",
      message: "Workflow execution stopped",
    })

    // Reset node statuses
    const resetNodes = state.currentWorkflow.nodes.map((node) => ({
      ...node,
      data: { ...node.data, status: "idle" },
    }))
    actions.setNodes(resetNodes)
  }, [state.currentWorkflow.nodes, actions])

  const resetExecution = useCallback(() => {
    actions.setWorkflowStatus("idle")
    actions.clearExecutionLogs()
    actions.addExecutionLog({
      level: "info",
      message: "Workflow reset",
    })

    // Reset all node statuses
    const resetNodes = state.currentWorkflow.nodes.map((node) => ({
      ...node,
      data: { ...node.data, status: "idle" },
    }))
    actions.setNodes(resetNodes)
  }, [state.currentWorkflow.nodes, actions])

  return {
    executeWorkflow,
    stopExecution,
    resetExecution,
    isExecuting: state.currentWorkflow.status === "running",
    executionStatus: state.currentWorkflow.status,
  }
}

// Simulate workflow execution
async function simulateExecution(
  nodes: Node[],
  addLog: (log: { level: "info" | "error" | "success"; message: string; nodeId?: string }) => void,
) {
  for (const node of nodes) {
    addLog({
      level: "info",
      message: `Executing ${node.data.label || node.data.name}...`,
      nodeId: node.id,
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simulate occasional errors
    if (Math.random() < 0.1) {
      throw new Error(`Failed to execute ${node.data.label || node.data.name}`)
    }

    addLog({
      level: "success",
      message: `Completed ${node.data.label || node.data.name}`,
      nodeId: node.id,
    })
  }
}
