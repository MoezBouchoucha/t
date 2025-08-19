"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wand2, FileText, X } from "lucide-react"

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentWorkflow?: {
    name: string
    description: string
    nodes: number
  }
}

export function CreateTemplateDialog({ open, onOpenChange, currentWorkflow }: CreateTemplateDialogProps) {
  const [templateName, setTemplateName] = useState(currentWorkflow?.name || "")
  const [description, setDescription] = useState(currentWorkflow?.description || "")
  const [category, setCategory] = useState("general")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [shareLevel, setShareLevel] = useState("private")
  const [allowEditing, setAllowEditing] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [creationMode, setCreationMode] = useState<"current" | "ai">("current")

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleCreate = () => {
    // Here you would implement the template creation logic
    console.log("Creating template:", {
      name: templateName,
      description,
      category,
      tags,
      shareLevel,
      allowEditing,
      creationMode,
      aiPrompt: creationMode === "ai" ? aiPrompt : undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" style={{ color: "var(--talan-purple)" }} />
            Create Template
          </DialogTitle>
        </DialogHeader>

        <Tabs value={creationMode} onValueChange={(value) => setCreationMode(value as "current" | "ai")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current" disabled={!currentWorkflow}>
              From Current Workflow
            </TabsTrigger>
            <TabsTrigger value="ai">Generate with AI</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {currentWorkflow && (
              <div className="p-4 rounded-md mb-4" style={{ backgroundColor: "var(--talan-light-blue-hover)" }}>
                <h4 className="font-medium mb-2" style={{ color: "var(--talan-dark-gray-blue)" }}>
                  Current Workflow
                </h4>
                <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                  {currentWorkflow.name} • {currentWorkflow.nodes} nodes
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="template-name" style={{ color: "var(--talan-medium-gray)" }}>
                Template Name
              </Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="template-description" style={{ color: "var(--talan-medium-gray)" }}>
                Description
              </Label>
              <Textarea
                id="template-description"
                placeholder="Describe what this template does and when to use it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div>
              <Label htmlFor="ai-prompt" style={{ color: "var(--talan-medium-gray)" }}>
                Describe Your Template
              </Label>
              <Textarea
                id="ai-prompt"
                placeholder="Describe the workflow you want to create. For example: 'Create a template for processing customer feedback, analyzing sentiment, and generating response suggestions...'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-2"
                rows={4}
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
              Generate Template with AI
            </Button>
          </TabsContent>
        </Tabs>

        {/* Common fields */}
        <div className="space-y-4">
          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="document-processing">Document Processing</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
                <SelectItem value="data-processing">Data Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Tags</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button size="sm" onClick={addTag} disabled={!newTag.trim()}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs cursor-pointer"
                    onClick={() => removeTag(tag)}
                    style={{
                      backgroundColor: "var(--talan-light-blue-hover)",
                      color: "var(--talan-light-blue)",
                    }}
                  >
                    {tag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label style={{ color: "var(--talan-medium-gray)" }}>Sharing Level</Label>
            <Select value={shareLevel} onValueChange={setShareLevel}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private - Only you can access</SelectItem>
                <SelectItem value="link">Link Only - Anyone with link can view</SelectItem>
                <SelectItem value="public">Public - Visible in template gallery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {shareLevel !== "private" && (
            <div className="flex items-center justify-between">
              <Label style={{ color: "var(--talan-medium-gray)" }}>Allow others to edit</Label>
              <Switch checked={allowEditing} onCheckedChange={setAllowEditing} />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!templateName.trim()}
            style={{
              backgroundColor: "var(--talan-purple)",
              color: "var(--talan-white)",
            }}
            className="hover:opacity-90"
          >
            Create Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
