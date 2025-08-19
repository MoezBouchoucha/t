"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Search,
  Mail,
  Database,
  Globe,
  FileText,
  Bot,
  Users,
  TrendingUp,
  DollarSign,
  FileCheck,
  Brain,
  GitBranch,
  Building2,
  FolderOpen,
} from "lucide-react"

// Optimize styles - define outside component to prevent recreation
const styles = {
  borderColor: { borderColor: "var(--talan-light-gray-border)" },
  titleColor: { color: "var(--talan-dark-gray-blue)" },
  mediumGrayColor: { color: "var(--talan-medium-gray)" },
  separatorBg: { backgroundColor: "var(--talan-light-gray-border)" },
  thinkerBg: { backgroundColor: "rgba(233, 30, 99, 0.1)" },
  conditionalBg: { backgroundColor: "rgba(39, 174, 96, 0.1)" },
  thinkerColor: { color: "var(--talan-pink-magenta)" },
  conditionalColor: { color: "var(--talan-green)" },
  toolBg: { backgroundColor: "var(--talan-light-blue-hover)" },
  toolColor: { color: "var(--talan-light-blue)" },
  agentBg: { backgroundColor: "var(--talan-light-purple)" },
  agentColor: { color: "var(--talan-purple)" },
  cardStyle: {
    borderColor: "var(--talan-light-gray-border)",
    backgroundColor: "var(--talan-white)",
  },
  badgeStyle: {
    backgroundColor: "var(--talan-light-purple)",
    color: "var(--talan-purple)",
    border: "none",
    fontSize: "10px",
    padding: "2px 6px",
  },
  descriptionStyle: {
    color: "var(--talan-medium-gray)",
    lineHeight: "1.3",
    display: "-webkit-box" as const,
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden" as const,
  },
}

const tools = [
  {
    id: "rag",
    name: "RAG Tool",
    icon: Database,
    description: "Retrieval Augmented Generation",
    category: "AI",
    parameters: {
      embeddingModel: {
        type: "select",
        options: ["text-embedding-ada-002", "text-embedding-3-small", "text-embedding-3-large"],
        default: "text-embedding-ada-002",
      },
      dataSource: { type: "text", placeholder: "Enter data source path or URL" },
      chunkSize: { type: "number", default: 1000, min: 100, max: 4000 },
      topK: { type: "number", default: 5, min: 1, max: 20 },
    },
  },
  {
    id: "web-search",
    name: "Web Search",
    icon: Globe,
    description: "Search the web for information",
    category: "Data",
    parameters: {
      query: { type: "text", placeholder: "Search query" },
      resultLimit: { type: "number", default: 10, min: 1, max: 50 },
      searchEngine: { type: "select", options: ["google", "bing", "duckduckgo"], default: "google" },
      safeSearch: { type: "boolean", default: true },
    },
  },
  {
    id: "send-mail",
    name: "Send Mail",
    icon: Mail,
    description: "Send email notifications",
    category: "Communication",
    parameters: {
      recipient: { type: "text", placeholder: "recipient@example.com" },
      subject: { type: "text", placeholder: "Email subject" },
      bodyTemplate: { type: "textarea", placeholder: "Email body template with variables" },
      attachments: { type: "file", multiple: true },
    },
  },
  {
    id: "deep-search",
    name: "Deep Search",
    icon: Search,
    description: "Advanced search capabilities",
    category: "Data",
    parameters: {
      searchQuery: { type: "text", placeholder: "Advanced search query" },
      filters: { type: "json", placeholder: '{"dateRange": "last_month", "type": "document"}' },
      searchDepth: { type: "select", options: ["shallow", "medium", "deep"], default: "medium" },
      includeMetadata: { type: "boolean", default: true },
    },
  },
  {
    id: "scraping",
    name: "Scraping",
    icon: FileText,
    description: "Extract data from websites",
    category: "Data",
    parameters: {
      url: { type: "text", placeholder: "https://example.com" },
      selectors: { type: "json", placeholder: '{"title": "h1", "content": ".content"}' },
      outputFormat: { type: "select", options: ["json", "csv", "xml"], default: "json" },
      respectRobots: { type: "boolean", default: true },
    },
  },
]

const prebuiltAgents = [
  {
    id: "rfp-analyzer",
    name: "RFP Analyzer",
    icon: FileCheck,
    description: "Analyze RFP documents and extract key information",
    category: "Document Processing",
    capabilities: ["Document parsing", "Key information extraction", "Requirement analysis"],
    systemPrompt:
      "You are an expert RFP analyzer. Extract key requirements, deadlines, and evaluation criteria from RFP documents.",
  },
  {
    id: "references-manager",
    name: "Sparkie References ",
    icon: Users,
    description: "Manage references and contacts",
    category: "CRM",
    capabilities: ["Contact management", "Reference tracking", "Communication history"],
    systemPrompt: "You manage professional references and maintain contact relationships.",
  },
  {
    id: "suivi-transformation",
    name: "Suivi Transformation",
    icon: TrendingUp,
    description: "Track transformation progress and metrics",
    category: "Analytics",
    capabilities: ["Progress tracking", "Metrics analysis", "Reporting"],
    systemPrompt: "You track and analyze transformation initiatives, providing insights on progress and bottlenecks.",
  },
  {
    id: "financial-agent",
    name: "Financial Agent",
    icon: DollarSign,
    description: "Handle financial operations and analysis",
    category: "Finance",
    capabilities: ["Financial analysis", "Budget tracking", "Cost optimization"],
    systemPrompt: "You are a financial expert specializing in business analysis and cost optimization.",
  },
  {
    id: "staffer-agent",
    name: "Staffer Agent",
    icon: Users,
    description: "Manage staffing operations and recruitment",
    category: "HR",
    capabilities: ["Recruitment", "Staff allocation", "Skills matching"],
    systemPrompt: "You manage staffing operations, matching skills to requirements and optimizing team composition.",
  },
  {
    id: "resume-generator",
    name: "Resume Generator",
    icon: FileText,
    description: "Generate professional resumes",
    category: "Document Generation",
    capabilities: ["Resume creation", "Template selection", "Content optimization"],
    systemPrompt: "You create professional resumes tailored to specific job requirements and industries.",
  },
]

const workflowComponents = [
  {
    id: "thinker-llm",
    name: "Thinker LLM",
    icon: Brain,
    description: "React orchestrator for complex reasoning",
    category: "Orchestration",
    type: "thinker",
  },
  {
    id: "conditional-edge",
    name: "Conditional Edge",
    icon: GitBranch,
    description: "Add conditional logic to workflow",
    category: "Logic",
    type: "conditional",
  },
]

export function ToolPalette({ onBackToWelcome, onTemplatesClick }: Readonly<{ onBackToWelcome?: () => void; onTemplatesClick?: () => void }>) {
  const [activeFilter, setActiveFilter] = useState<"all" | "components" | "tools" | "agents">("all")

  const onDragStart = (event: React.DragEvent, type: string, data: any) => {
    const dragData = { type, ...data }
    event.dataTransfer.setData("application/reactflow", type)
    event.dataTransfer.setData("application/nodedata", JSON.stringify(dragData))
    event.dataTransfer.effectAllowed = "move"
  }

  const shouldShowSection = (sectionType: string) => {
    return activeFilter === "all" || activeFilter === sectionType
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden max-w-full">
      {/* Header with Back Button and Filter Tabs */}
      <div className="flex-shrink-0 border-b overflow-hidden" style={styles.borderColor}>
        {(onBackToWelcome || onTemplatesClick) && (
          <div className="px-3 py-2 pb-1">
            <div className="flex gap-2">
              {onBackToWelcome && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onBackToWelcome}
                  className="flex-1 h-9 justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-400"
                  suppressHydrationWarning
                >
                  <Building2 className="mr-1 h-4 w-4" />
                  Back to Welcome
                </Button>
              )}
              {onTemplatesClick && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onTemplatesClick}
                  className="flex-1 h-9 justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-400"
                  suppressHydrationWarning
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Browse Templates
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="p-3 pb-5">
          <h2 className="text-lg font-semibold mb-4 truncate" style={styles.titleColor}>
            Tools & Agents
          </h2>
          <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)} className="w-full my-2">
            <TabsList className="grid w-full grid-cols-4 h-10" suppressHydrationWarning>
              <TabsTrigger value="all" className="text-xs px-2" suppressHydrationWarning>
                All
              </TabsTrigger>
              <TabsTrigger value="components" className="text-xs px-2" suppressHydrationWarning>
                Flow
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs px-2" suppressHydrationWarning>
                Tools
              </TabsTrigger>
              <TabsTrigger value="agents" className="text-xs px-2" suppressHydrationWarning>
                Agents
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-4 overflow-hidden">
          {/* Workflow Components Section */}
          {shouldShowSection("components") && (
            <div>
              <h3
                className="text-m font-medium mb-3 uppercase tracking-wide flex items-center gap-2"
                style={styles.mediumGrayColor}
              >
                <GitBranch className="h-3 w-3" />
                Workflow Components
              </h3>
              <div className="space-y-2">
                {workflowComponents.map((component) => (
                  <Card
                    key={component.id}
                    className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:scale-[1.02] border overflow-hidden w-full max-w-full"
                    draggable
                    onDragStart={(e) => onDragStart(e, component.type, component)}
                    style={styles.cardStyle}
                  >
                    <CardContent className="p-3 h-[70px]">
                      <div className="flex items-start space-x-3 h-full">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={component.id === "thinker-llm" ? styles.thinkerBg : styles.conditionalBg}
                        >
                          <component.icon
                            className="h-4 w-4"
                            style={component.id === "thinker-llm" ? styles.thinkerColor : styles.conditionalColor}
                          />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm font-medium truncate" style={styles.titleColor}>
                            {component.name}
                          </p>
                          <p
                            className="text-xs mt-1 line-clamp-1 break-words"
                            style={styles.descriptionStyle}
                          >
                            {component.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {shouldShowSection("components") && (shouldShowSection("tools") || shouldShowSection("agents")) && (
            <Separator style={styles.separatorBg} />
          )}

          {/* Tools Section */}
          {shouldShowSection("tools") && (
            <div>
              <h3
                className="text-m font-medium mb-3 uppercase tracking-wide flex items-center gap-2"
                style={{ color: "var(--talan-medium-gray)" }}
              >
                <Database className="h-3 w-3" />
                Tools
              </h3>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <Card
                    key={tool.id}
                    className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:scale-[1.02] border overflow-hidden w-full max-w-full"
                    draggable
                    onDragStart={(e) => onDragStart(e, "tool", tool)}
                    style={{
                      borderColor: "var(--talan-light-gray-border)",
                      backgroundColor: "var(--talan-white)",
                    }}
                  >
                    <CardContent className="p-3 h-[80px]">
                      <div className="flex items-start space-x-3 h-full">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: "var(--talan-light-blue-hover)" }}
                        >
                          <tool.icon className="h-4 w-4" style={{ color: "var(--talan-light-blue)" }} />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden flex flex-col justify-between h-full">
                          <div className="flex-1 overflow-hidden">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "var(--talan-dark-gray-blue)" }}
                            >
                              {tool.name}
                            </p>
                            <p
                              className="text-xs mt-1 line-clamp-2 break-words"
                              style={{
                                color: "var(--talan-medium-gray)",
                                lineHeight: "1.3",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                              }}
                            >
                              {tool.description}
                            </p>
                          </div>
                          <div className="flex justify-end m-0">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: "var(--talan-light-blue-hover)",
                                color: "var(--talan-light-blue)",
                                border: "none",
                                fontSize: "10px",
                                padding: "2px 6px",
                              }}
                            >
                              {tool.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {shouldShowSection("tools") && shouldShowSection("agents") && (
            <Separator style={{ backgroundColor: "var(--talan-light-gray-border)" }} />
          )}

          {/* Pre-built Agents Section */}
          {shouldShowSection("agents") && (
            <div>
              <h3
                className="text-m font-medium mb-3 uppercase tracking-wide flex items-center gap-2"
                style={{ color: "var(--talan-medium-gray)" }}
              >
                <Bot className="h-3 w-3" />
                Pre-built Agents
              </h3>
              <div className="space-y-2">
                {prebuiltAgents.map((agent) => (
                  <Card
                    key={agent.id}
                    className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:scale-[1.02] border overflow-hidden w-full max-w-full"
                    draggable
                    onDragStart={(e) => onDragStart(e, "agent", agent)}
                    style={{
                      borderColor: "var(--talan-light-gray-border)",
                      backgroundColor: "var(--talan-white)",
                    }}
                  >
                    <CardContent className="p-3 h-[80px]">
                      <div className="flex items-start space-x-3 h-full">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: "var(--talan-light-purple)" }}
                        >
                          <agent.icon className="h-4 w-4" style={{ color: "var(--talan-purple)" }} />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden flex flex-col justify-between h-full">
                          <div className="flex-1 overflow-hidden">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "var(--talan-dark-gray-blue)" }}
                            >
                              {agent.name}
                            </p>
                            <p
                              className="text-xs mt-1 line-clamp-2 break-words"
                              style={{
                                color: "var(--talan-medium-gray)",
                                lineHeight: "1.3",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                              }}
                            >
                              {agent.description}
                            </p>
                          </div>
                          <div className="flex justify-end pt-0 mt-0">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: "var(--talan-light-purple)",
                                color: "var(--talan-purple)",
                                border: "none",
                                fontSize: "10px",
                                padding: "2px 6px",
                              }}
                            >
                              {agent.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(shouldShowSection("agents") || activeFilter === "all") && (
            <>
              <Separator style={{ backgroundColor: "var(--talan-light-gray-border)" }} />
              {/* Agent creation moved to floating action button */}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
