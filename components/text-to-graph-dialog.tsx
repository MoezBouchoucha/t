"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, Wand2, FileText, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TextToGraphDialogProps {
    onGenerateWorkflow: (description: string) => Promise<void>
    isGenerating?: boolean
}

export function TextToGraphDialog({ onGenerateWorkflow, isGenerating = false }: TextToGraphDialogProps) {
    const [description, setDescription] = useState("")
    const [open, setOpen] = useState(false)

    const handleGenerate = async () => {
        if (!description.trim()) return

        try {
            await onGenerateWorkflow(description)
            setOpen(false)
            setDescription("")
        } catch (error) {
            console.error("Failed to generate workflow:", error)
        }
    }

    const examplePrompts = [
        "Create a customer support workflow that analyzes incoming emails, categorizes them by urgency, and routes them to appropriate agents",
        "Build a content creation pipeline that takes a topic, researches it, generates an article, and then creates social media posts",
        "Design a data processing workflow that validates input data, transforms it, runs quality checks, and stores results in a database",
        "Create an e-commerce order processing flow that validates payment, checks inventory, updates stock, and sends confirmation emails"
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="flex items-center gap-2"
                    style={{
                        backgroundColor: "var(--talan-purple)",
                        color: "white",
                        border: "none",
                    }}
                >
                    <Wand2 className="h-4 w-4" />
                    Generate from Text
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2" style={{ color: "var(--talan-dark-gray-blue)" }}>
                        <FileText className="h-5 w-5" />
                        Generate Workflow from Description
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Input Section */}
                    <div className="space-y-3">
                        <Label htmlFor="workflow-description" className="text-base font-medium" style={{ color: "var(--talan-dark-gray-blue)" }}>
                            Describe your workflow
                        </Label>
                        <Textarea
                            id="workflow-description"
                            placeholder="Describe the workflow you want to create. Be specific about the steps, conditions, and data flow..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="resize-none"
                            style={{ borderColor: "var(--talan-light-gray-border)" }}
                        />
                        <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                            Tip: Include details about data sources, processing steps, decision points, and outputs for better results.
                        </p>
                    </div>

                    {/* Examples Section */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium" style={{ color: "var(--talan-dark-gray-blue)" }}>
                            Example prompts
                        </Label>
                        <div className="grid gap-3">
                            {examplePrompts.map((prompt, index) => (
                                <Card
                                    key={`example-${prompt.slice(0, 20)}-${index}`}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => setDescription(prompt)}
                                    style={{ borderColor: "var(--talan-light-gray-border)" }}
                                >
                                    <CardContent className="p-3">
                                        <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                                            {prompt}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Features Info */}
                    <Card style={{ backgroundColor: "var(--talan-light-gray)", borderColor: "var(--talan-light-gray-border)" }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm" style={{ color: "var(--talan-dark-gray-blue)" }}>
                                What will be generated
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" style={{ backgroundColor: "var(--talan-light-purple)", color: "var(--talan-purple)" }}>
                                    Nodes
                                </Badge>
                                <ArrowRight className="h-3 w-3" style={{ color: "var(--talan-medium-gray)" }} />
                                <span className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                                    Agents, tools, thinkers, and conditionals
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" style={{ backgroundColor: "var(--talan-light-blue)", color: "var(--talan-dark-gray-blue)" }}>
                                    Connections
                                </Badge>
                                <ArrowRight className="h-3 w-3" style={{ color: "var(--talan-medium-gray)" }} />
                                <span className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                                    Logical flow between components
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" style={{ backgroundColor: "var(--talan-light-green)", color: "var(--talan-green)" }}>
                                    Configuration
                                </Badge>
                                <ArrowRight className="h-3 w-3" style={{ color: "var(--talan-medium-gray)" }} />
                                <span className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                                    Pre-configured parameters and settings
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isGenerating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={!description.trim() || isGenerating}
                            className="flex items-center gap-2"
                            style={{
                                backgroundColor: description.trim() ? "var(--talan-purple)" : undefined,
                                color: description.trim() ? "white" : undefined,
                                border: "none",
                            }}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="h-4 w-4" />
                                    Generate Workflow
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
