"use client"

import { useCallback, useRef } from "react"
import type { Node } from "@xyflow/react"
import { useApp } from "@/lib/workflow-store"

export function useNodeUpdate() {
    const { actions } = useApp()
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const updateNode = useCallback((
        nodeId: string,
        updates: Record<string, any>,
        setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void
    ) => {
        // Update local ReactFlow state immediately for responsive UI
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...updates } }
                    : node
            )
        )

        // Update store immediately without debouncing
        setNodes((currentNodes) => {
            actions.setNodes(currentNodes)
            return currentNodes
        })
    }, [actions])

    return { updateNode }
}
