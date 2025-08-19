"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"

interface WorkflowSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkflowSettingsDialog({ open, onOpenChange }: WorkflowSettingsDialogProps) {
  const [autoSave, setAutoSave] = useState(true)
  const [executionTimeout, setExecutionTimeout] = useState("300")
  const [logLevel, setLogLevel] = useState("info")
  const [parallelExecution, setParallelExecution] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" style={{ color: "var(--talan-medium-gray)" }} />
            Workflow Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label style={{ color: "var(--talan-medium-gray)" }}>Auto-save workflow</Label>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>

            <div>
              <Label style={{ color: "var(--talan-medium-gray)" }}>Log Level</Label>
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="execution" className="space-y-4">
            <div>
              <Label htmlFor="timeout" style={{ color: "var(--talan-medium-gray)" }}>
                Execution Timeout (seconds)
              </Label>
              <Input
                id="timeout"
                type="number"
                value={executionTimeout}
                onChange={(e) => setExecutionTimeout(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label style={{ color: "var(--talan-medium-gray)" }}>Enable parallel execution</Label>
              <Switch checked={parallelExecution} onCheckedChange={setParallelExecution} />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label style={{ color: "var(--talan-medium-gray)" }}>Error Handling Strategy</Label>
              <Select defaultValue="stop">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stop">Stop on Error</SelectItem>
                  <SelectItem value="continue">Continue on Error</SelectItem>
                  <SelectItem value="retry">Retry on Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max-retries" style={{ color: "var(--talan-medium-gray)" }}>
                Max Retries
              </Label>
              <Input id="max-retries" type="number" defaultValue="3" className="mt-2" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            style={{
              backgroundColor: "var(--talan-purple)",
              color: "var(--talan-white)",
            }}
            className="hover:opacity-90"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
