interface Window {
  reactFlowInstance?: {
    getNodes: () => any[]
    getEdges: () => any[]
    setNodes: (nodes: any[]) => void
    setEdges: (edges: any[]) => void
  }
}