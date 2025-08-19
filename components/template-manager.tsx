"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Share2,
  Download,
  Eye,
  Star,
  Clock,
  Users,
  Lock,
  Globe,
  Link,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MyTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  downloads: number
  views: number
  rating: number
  shareLevel: "private" | "link" | "public"
  nodes: number
  isPublished: boolean
}

const myTemplates: MyTemplate[] = [
  {
    id: "my-1",
    name: "My RFP Workflow",
    description: "Custom RFP analysis workflow for our company needs",
    category: "Document Processing",
    tags: ["rfp", "custom", "analysis"],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-22"),
    downloads: 12,
    views: 45,
    rating: 4.2,
    shareLevel: "private",
    nodes: 6,
    isPublished: false,
  },
  {
    id: "my-2",
    name: "Customer Onboarding Flow",
    description: "Automated customer onboarding with document verification",
    category: "Automation",
    tags: ["onboarding", "automation", "verification"],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-21"),
    downloads: 28,
    views: 89,
    rating: 4.6,
    shareLevel: "public",
    nodes: 8,
    isPublished: true,
  },
  {
    id: "my-3",
    name: "Data Processing Pipeline",
    description: "ETL pipeline for processing customer data",
    category: "Data Processing",
    tags: ["etl", "data", "processing"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-19"),
    downloads: 7,
    views: 23,
    rating: 4.0,
    shareLevel: "link",
    nodes: 10,
    isPublished: true,
  },
]

interface TemplateManagerProps {
  onClose: () => void
}

export function TemplateManager({ onClose }: TemplateManagerProps) {
  const [templates] = useState<MyTemplate[]>(myTemplates)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getShareIcon = (shareLevel: string) => {
    switch (shareLevel) {
      case "public":
        return <Globe className="h-3 w-3" style={{ color: "var(--talan-green)" }} />
      case "link":
        return <Link className="h-3 w-3" style={{ color: "var(--talan-light-blue)" }} />
      default:
        return <Lock className="h-3 w-3" style={{ color: "var(--talan-medium-gray)" }} />
    }
  }

  const getShareBadgeStyle = (shareLevel: string) => {
    switch (shareLevel) {
      case "public":
        return { backgroundColor: "rgba(39, 174, 96, 0.1)", color: "var(--talan-green)" }
      case "link":
        return { backgroundColor: "var(--talan-light-blue-hover)", color: "var(--talan-light-blue)" }
      default:
        return { backgroundColor: "var(--talan-light-gray)", color: "var(--talan-medium-gray)" }
    }
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "var(--talan-white)" }}>
      {/* Header */}
      <div
        className="p-6 border-b"
        style={{
          borderColor: "var(--talan-light-gray-border)",
          backgroundColor: "var(--talan-light-gray)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold" style={{ color: "var(--talan-dark-gray-blue)" }}>
            My Templates
          </h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search my templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderColor: "var(--talan-light-gray-border)" }}
            />
          </div>
          <Button
            style={{
              backgroundColor: "var(--talan-purple)",
              color: "var(--talan-white)",
            }}
            className="hover:opacity-90"
          >
            Create New Template
          </Button>
        </div>
      </div>

      {/* Templates List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({templates.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({templates.filter((t) => t.isPublished).length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({templates.filter((t) => !t.isPublished).length})</TabsTrigger>
              <TabsTrigger value="shared">
                Shared ({templates.filter((t) => t.shareLevel !== "private").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} style={{ borderColor: "var(--talan-light-gray-border)" }}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold" style={{ color: "var(--talan-dark-gray-blue)" }}>
                              {template.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={getShareBadgeStyle(template.shareLevel)}
                              >
                                {getShareIcon(template.shareLevel)}
                                <span className="ml-1 capitalize">{template.shareLevel}</span>
                              </Badge>
                              {!template.isPublished && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: "var(--talan-medium-gray)",
                                    color: "var(--talan-medium-gray)",
                                  }}
                                >
                                  Draft
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-sm mb-3" style={{ color: "var(--talan-medium-gray)" }}>
                            {template.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {template.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                                style={{
                                  backgroundColor: "var(--talan-light-blue-hover)",
                                  color: "var(--talan-light-blue)",
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div
                            className="flex items-center space-x-6 text-xs"
                            style={{ color: "var(--talan-medium-gray)" }}
                          >
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Updated {template.updatedAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="h-3 w-3" />
                              <span>{template.downloads} downloads</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{template.views} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3" />
                              <span>{template.rating}/5</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{template.nodes} nodes</span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Template
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="published">
              <div className="space-y-4">
                {filteredTemplates
                  .filter((t) => t.isPublished)
                  .map((template) => (
                    <Card key={template.id} style={{ borderColor: "var(--talan-light-gray-border)" }}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--talan-dark-gray-blue)" }}>
                          {template.name}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts">
              <div className="space-y-4">
                {filteredTemplates
                  .filter((t) => !t.isPublished)
                  .map((template) => (
                    <Card key={template.id} style={{ borderColor: "var(--talan-light-gray-border)" }}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--talan-dark-gray-blue)" }}>
                          {template.name}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="shared">
              <div className="space-y-4">
                {filteredTemplates
                  .filter((t) => t.shareLevel !== "private")
                  .map((template) => (
                    <Card key={template.id} style={{ borderColor: "var(--talan-light-gray-border)" }}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--talan-dark-gray-blue)" }}>
                          {template.name}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
