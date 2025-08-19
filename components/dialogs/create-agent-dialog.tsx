"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Bot, Wand2 } from "lucide-react"

interface CreateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "existing" | "tools" | "prompt"
  tools: any[]
  agents: any[]
}

export function CreateAgentDialog({ open, onOpenChange, mode, tools, agents }: CreateAgentDialogProps) {
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [promptInput, setPromptInput] = useState("")

  const handleCreate = () => {
    // Here you would implement the agent creation logic
    console.log("Creating agent:", {
      name: agentName,
      description: agentDescription,
      systemPrompt,
      selectedTools,
      selectedAgents,
      promptInput,
      mode,
    })
    onOpenChange(false)
  }

  const renderContent = () => {
    switch (mode) {
      case "existing":
        return (
          <div className="space-y-4">
            <div>
              <Label style={{ color: "var(--talan-medium-gray)" }}>Select Agents to Combine</Label>
              <ScrollArea className="h-48 mt-2">
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="p-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedAgents.includes(agent.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAgents([...selectedAgents, agent.id])
                            } else {
                              setSelectedAgents(selectedAgents.filter((id) => id !== agent.id))
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.description}</p>
                        </div>
                        <Badge variant="secondary">{agent.category}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )

      case "tools":
        return (
          <div className="space-y-4">
            <div>
              <Label style={{ color: "var(--talan-medium-gray)" }}>Select Tools</Label>
              <ScrollArea className="h-48 mt-2">
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <Card key={tool.id} className="p-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedTools.includes(tool.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTools([...selectedTools, tool.id])
                            } else {
                              setSelectedTools(selectedTools.filter((id) => id !== tool.id))
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                        <Badge variant="secondary">{tool.category}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )

      case "prompt":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt-input" style={{ color: "var(--talan-medium-gray)" }}>
                Describe Your Agent
              </Label>
              <Textarea
                id="prompt-input"
                placeholder="Describe what you want your agent to do. For example: 'Create an agent that analyzes customer feedback and generates improvement suggestions...'"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              style={{
                borderColor: "var(--talan-purple)",
                color: "var(--talan-purple)",
              }}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Agent with AI
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" style={{ color: "var(--talan-purple)" }} />
            Create New Agent
            {mode === "existing" && " from Existing Agents"}
            {mode === "tools" && " from Tools"}
            {mode === "prompt" && " from Prompt"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="agent-name" style={{ color: "var(--talan-medium-gray)" }}>
                Agent Name
              </Label>
              <Input
                id="agent-name"
                placeholder="Enter agent name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="agent-description" style={{ color: "var(--talan-medium-gray)" }}>
                Description
              </Label>
              <Input
                id="agent-description"
                placeholder="Brief description of what this agent does"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Mode-specific content */}
          {renderContent()}

          {/* System Prompt */}
          {mode !== "prompt" && (
            <div>
              <Label htmlFor="system-prompt" style={{ color: "var(--talan-medium-gray)" }}>
                System Prompt
              </Label>
              <Textarea
                id="system-prompt"
                placeholder="Define the agent's behavior and instructions..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              style={{
                backgroundColor: "var(--talan-purple)",
                color: "var(--talan-white)",
              }}
              className="hover:opacity-90"
            >
              Create Agent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
