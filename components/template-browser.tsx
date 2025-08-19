"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Download, Eye, X } from "lucide-react"
import { useApp } from "@/lib/workflow-store"
import type { Template } from "@/lib/workflow-store"

const categories = [
  "All Categories",
  "Customer Service",
  "Document Processing",
  "Sales & Marketing",
  "Content & Marketing",
  "Communication",
  "Finance",
  "Content Management",
  "Sales",
  "Data Processing",
  "Automation",
]

interface TemplateBrowserProps {
  readonly onSelectTemplate: (template: Template) => void
  readonly onClose: () => void
}

export function TemplateBrowser({ onSelectTemplate, onClose }: TemplateBrowserProps) {
  const { state, actions } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("popular")

  // Use templates from the store
  const templates = state.templates

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All Categories" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.downloads - a.downloads
      case "rating":
        return b.rating - a.rating
      case "recent":
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleTemplateSelect = (template: Template) => {
    actions.loadTemplate(template)
    onSelectTemplate(template)
  }

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case "simple":
        return "var(--talan-green)"
      case "medium":
        return "var(--talan-yellow)"
      case "complex":
        return "var(--talan-pink-magenta)"
      default:
        return "var(--talan-medium-gray)"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "var(--talan-white)" }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: "var(--talan-light-gray-border)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--talan-dark-gray-blue)" }}>
              Template Library
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--talan-medium-gray)" }}>
              Choose from pre-built workflows to get started quickly
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "var(--talan-medium-gray)" }} />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{ borderColor: "var(--talan-light-gray-border)" }}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates Grid */}
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderColor: "var(--talan-light-gray-border)" }}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg" style={{ color: "var(--talan-dark-gray-blue)" }}>
                      {template.name}
                    </CardTitle>
                    <p className="text-sm mt-1" style={{ color: "var(--talan-medium-gray)" }}>
                      by {template.author}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" style={{ color: "var(--talan-yellow)" }} />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: "var(--talan-medium-gray)" }}>
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: "var(--talan-light-purple)",
                        color: "var(--talan-purple)",
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: "var(--talan-light-gray-border)" }}
                    >
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm" style={{ color: "var(--talan-medium-gray)" }}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{template.nodes || 0} nodes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: getComplexityColor(template.complexity),
                        }}
                      />
                      <span className="text-xs" style={{ color: getComplexityColor(template.complexity) }}>
                        {template.complexity || 'medium'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{template.downloads}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--talan-light-gray-border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--talan-medium-gray)" }}>
                      Updated {formatDate(template.updatedAt)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium" style={{ color: "var(--talan-medium-gray)" }}>
              No templates found
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--talan-medium-gray)" }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
