// Types for text-to-graph workflow generation
// File: types/workflow-generation.ts

export interface GenerateWorkflowRequest {
    description: string
    options?: {
        maxNodes?: number
        preferredLayout?: 'horizontal' | 'vertical' | 'hierarchical'
        includeValidation?: boolean
    }
}

export interface GenerateWorkflowResponse {
    nodes: WorkflowNode[]
    edges: WorkflowEdge[]
    metadata?: {
        generationTime: number
        nodeCount: number
        edgeCount: number
        complexity: 'simple' | 'medium' | 'complex'
    }
}

export interface WorkflowNode {
    id: string
    type: 'agent' | 'tool' | 'thinker' | 'conditional'
    position: { x: number; y: number }
    data: NodeData
}

export interface WorkflowEdge {
    id: string
    source: string
    target: string
    type?: 'default' | 'smoothstep' | 'straight'
    animated?: boolean
    label?: string
}

export interface NodeData {
    label: string
    name: string
    description?: string

    // Agent-specific properties
    systemPrompt?: string
    capabilities?: string[]
    model?: string

    // Tool-specific properties
    parameters?: Record<string, ToolParameter>

    // Conditional-specific properties
    condition?: string
    conditionType?: 'javascript' | 'python' | 'simple'

    // Thinker-specific properties
    strategy?: 'analytical' | 'creative' | 'logical' | 'intuitive'
    processingTime?: number
}

export interface ToolParameter {
    type: 'text' | 'select' | 'boolean' | 'number'
    label?: string
    placeholder?: string
    options?: string[]
    required?: boolean
    defaultValue?: any
}

// Example workflow patterns that can be generated
export const WORKFLOW_PATTERNS = {
    DATA_PROCESSING: {
        description: 'Data ingestion, validation, transformation, and storage',
        suggestedNodes: ['agent', 'tool', 'conditional', 'tool']
    },
    CUSTOMER_SUPPORT: {
        description: 'Ticket analysis, routing, response generation, and follow-up',
        suggestedNodes: ['agent', 'conditional', 'agent', 'tool']
    },
    CONTENT_CREATION: {
        description: 'Research, writing, editing, and publishing pipeline',
        suggestedNodes: ['agent', 'thinker', 'agent', 'tool']
    },
    APPROVAL_WORKFLOW: {
        description: 'Request submission, review, approval/rejection, and notification',
        suggestedNodes: ['tool', 'conditional', 'agent', 'tool']
    }
} as const
