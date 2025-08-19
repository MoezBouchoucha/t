"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, Link, EyeOff, Globe, Copy } from "lucide-react"

type ShareLevel = "private" | "link" | "public"

interface SaveWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowName: string
  onSave: (options: SaveOptions) => void
}

export interface SaveOptions {
  name: string
  description: string
  category: string
  tags: string[]
  shareLevel: ShareLevel
  allowEditing: boolean
}

export function SaveWorkflowDialog({ open, onOpenChange, workflowName, onSave }: Readonly<SaveWorkflowDialogProps>) {
  const [name, setName] = useState(workflowName)
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("general")
  const [tags, setTags] = useState("")
  const [shareLevel, setShareLevel] = useState<ShareLevel>("private")
  const [allowEditing, setAllowEditing] = useState(false)
  const [shareLink] = useState(`https://workflow-platform.com/shared/${Date.now()}`)

  const handleSave = () => {
    const saveOptions: SaveOptions = {
      name,
      description,
      category,
      tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
      shareLevel,
      allowEditing
    }
    onSave(saveOptions)
    onOpenChange(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
  }

  const getShareIcon = () => {
    switch (shareLevel) {
      case "private":
        return <EyeOff className="h-4 w-4" />
      case "link":
        return <Link className="h-4 w-4" />
      case "public":
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Save className="mr-2 h-5 w-5" style={{ color: "var(--talan-purple)" }} />
            Save Workflow
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="workflow-name" style={{ color: "var(--talan-medium-gray)" }}>
              Workflow Name
            </Label>
            <Input id="workflow-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
          </div>

          <div>
            <Label htmlFor="workflow-description" style={{ color: "var(--talan-medium-gray)" }}>
              Description
            </Label>
            <Textarea
              id="workflow-description"
              placeholder="Describe what this workflow does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label style={{ color: "var(--talan-medium-gray)" }}>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="data-processing">Data Processing</SelectItem>
                  <SelectItem value="document-analysis">Document Analysis</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workflow-tags" style={{ color: "var(--talan-medium-gray)" }}>
                Tags (comma-separated)
              </Label>
              <Input
                id="workflow-tags"
                placeholder="ai, automation, data..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Sharing Section */}
          <div className="border-t pt-4">
            <Label className="text-base font-medium flex items-center" style={{ color: "var(--talan-medium-gray)" }}>
              {getShareIcon()}
              <span className="ml-2">Sharing Options</span>
            </Label>

            <div className="mt-3">
              <Label style={{ color: "var(--talan-medium-gray)" }}>Visibility</Label>
              <Select value={shareLevel} onValueChange={(value) => setShareLevel(value as ShareLevel)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center">
                      <EyeOff className="mr-2 h-4 w-4" />
                      Private - Only you can access
                    </div>
                  </SelectItem>
                  <SelectItem value="link">
                    <div className="flex items-center">
                      <Link className="mr-2 h-4 w-4" />
                      Link Only - Anyone with link can view
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      Public - Visible in template gallery
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {shareLevel !== "private" && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Label style={{ color: "var(--talan-medium-gray)" }}>Allow others to edit</Label>
                  <Switch checked={allowEditing} onCheckedChange={setAllowEditing} />
                </div>

                <div>
                  <Label style={{ color: "var(--talan-medium-gray)" }}>Share Link</Label>
                  <div className="flex mt-2">
                    <Input value={shareLink} readOnly className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              style={{
                background: "linear-gradient(135deg, var(--talan-purple) 0%, var(--talan-light-blue) 100%)",
                color: "var(--talan-white)",
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
