"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Database, FileText, Plus, X } from "lucide-react"
import { CreateAgentDialog } from "./dialogs/create-agent-dialog"

interface AgentCreationFabProps {
    onCreateAgent?: (mode: "existing" | "tools" | "prompt") => void
}

export function AgentCreationFab({ onCreateAgent }: AgentCreationFabProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [createAgentOpen, setCreateAgentOpen] = useState(false)
    const [createAgentMode, setCreateAgentMode] = useState<"existing" | "tools" | "prompt">("existing")

    const handleCreateAgent = (mode: "existing" | "tools" | "prompt") => {
        setCreateAgentMode(mode)
        setCreateAgentOpen(true)
        setIsOpen(false)
        onCreateAgent?.(mode)
    }

    const agentOptions = [
        {
            mode: "existing" as const,
            icon: Bot,
            title: "From Existing Agents",
            description: "Combine existing agents",
            color: "from-blue-500 to-blue-600"
        },
        {
            mode: "tools" as const,
            icon: Database,
            title: "From Tools",
            description: "Build agent from tools",
            color: "from-green-500 to-green-600"
        },
        {
            mode: "prompt" as const,
            icon: FileText,
            title: "From Prompt",
            description: "Generate with AI",
            color: "from-purple-500 to-purple-600"
        }
    ]

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                {/* Options Menu */}
                {isOpen && (
                    <div className="mb-4 space-y-3">
                        {agentOptions.map((option) => {
                            const IconComponent = option.icon
                            return (
                                <Card
                                    key={option.mode}
                                    className="shadow-lg border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-200"
                                    style={{ animationDelay: `${agentOptions.indexOf(option) * 50}ms` }}
                                >
                                    <CardContent className="p-0">
                                        <Button
                                            variant="ghost"
                                            className="w-full h-auto p-4 justify-start hover:bg-gray-50 rounded-lg"
                                            onClick={() => handleCreateAgent(option.mode)}
                                        >
                                            <div className={`mr-3 p-2 rounded-lg bg-gradient-to-r ${option.color}`}>
                                                <IconComponent className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-medium text-gray-900">{option.title}</div>
                                                <div className="text-sm text-gray-500">{option.description}</div>
                                            </div>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {/* Main FAB Button */}
                <Button
                    size="lg"
                    className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 ${isOpen
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rotate-45"
                        : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        } border-0`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-white" />
                    ) : (
                        <Plus className="h-6 w-6 text-white" />
                    )}
                </Button>

                {/* Backdrop */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>

            {/* Create Agent Dialog */}
            {createAgentOpen && (
                <CreateAgentDialog
                    open={createAgentOpen}
                    onOpenChange={setCreateAgentOpen}
                    mode={createAgentMode}
                    tools={[]} // TODO: Pass actual tools from parent
                    agents={[]} // TODO: Pass actual agents from parent
                />
            )}
        </>
    )
}
