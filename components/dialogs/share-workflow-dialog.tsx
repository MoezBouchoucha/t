"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Share2, Copy, Link } from "lucide-react"

interface ShareWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowName: string
}

export function ShareWorkflowDialog({ open, onOpenChange, workflowName }: ShareWorkflowDialogProps) {
  const [shareLevel, setShareLevel] = useState("private")
  const [allowEditing, setAllowEditing] = useState(false)
  const [shareLink] = useState(`https://workflow-platform.com/shared/${Date.now()}`)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" style={{ color: "var(--talan-light-blue)" }} />
            Share Workflow
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <>
              <div className="flex items-center justify-between">
                <Label style={{ color: "var(--talan-medium-gray)" }}>Allow Editing</Label>
                <Switch checked={allowEditing} onCheckedChange={setAllowEditing} />
              </div>

              <div>
                <Label style={{ color: "var(--talan-medium-gray)" }}>Share Link</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    value={shareLink}
                    readOnly
                    style={{
                      backgroundColor: "var(--talan-input-meta-background)",
                      borderColor: "var(--talan-light-gray-border)",
                    }}
                  />
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              style={{
                backgroundColor: "var(--talan-light-blue)",
                color: "var(--talan-white)",
              }}
              className="hover:opacity-90"
            >
              <Link className="mr-2 h-4 w-4" />
              Generate Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
