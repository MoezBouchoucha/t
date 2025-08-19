"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Bot,
    Users,
    FileText,
    Search,
    TrendingUp,
    DollarSign,
    ArrowRight,
    Sparkles,
    Building2
} from "lucide-react"
import "../styles/welcome.css"

interface WelcomePageProps {
    onCreateAgent: () => void
}

const featuredAgents = [
    {
        id: "references-manager",
        name: "Sparkie References ",
        icon: Users,
        description: "Manage professional references and maintain contact relationships with automated tracking and communication history.",
        category: "CRM",
        color: "#8e44ad", // Purple
        bgColor: "#ecf0f1", // Light Purple
    },
    {
        id: "deepskop",
        name: "DeepSkop",
        icon: Search,
        description: "Advanced deep search and analysis capabilities with AI-powered insights for comprehensive data exploration.",
        category: "Analytics",
        color: "#3498db", // Light Blue
        bgColor: "#e8f4f8", // Light Blue Hover
    },
    {
        id: "staffer-agent",
        name: "Staffer",
        icon: Users,
        description: "Intelligent staffing operations and recruitment with skills matching and team composition optimization.",
        category: "HR",
        color: "#27ae60", // Green
        bgColor: "#f8f9fa", // Light Gray
    },
    {
        id: "cv-pro",
        name: "CV Pro",
        icon: FileText,
        description: "Professional resume generation and optimization tailored to specific job requirements and industries.",
        category: "Document Generation",
        color: "#e91e63", // Pink/Magenta
        bgColor: "#ffe6e6", // Error Background (light pink)
    },
    {
        id: "suivi-transformation",
        name: "Suivi Transformation",
        icon: TrendingUp,
        description: "Track transformation progress and metrics with comprehensive analytics and bottleneck identification.",
        category: "Analytics",
        color: "#e74c3c", // Red
        bgColor: "#f0f0f0", // Input/Meta Background
    },
    {
        id: "financial-agent",
        name: "Financial Agent",
        icon: DollarSign,
        description: "Handle financial operations and analysis with business intelligence and cost optimization capabilities.",
        category: "Finance",
        color: "#2c3e50", // Dark Gray Blue
        bgColor: "#e1e8ed", // Light Gray Border
    },
]

export function WelcomePage({ onCreateAgent }: WelcomePageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-200 to-gray-300">
            {/* Header */}
            <div
                className="border-b relative overflow-hidden bg-gradient-to-r from-white to-gray-50"
                style={{
                    borderColor: "#e1e8ed"
                }}
            >
                {/* Subtle decorative pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 left-20 w-32 h-32 rounded-full" style={{ backgroundColor: "#8e44ad" }}></div>
                    <div className="absolute top-16 right-32 w-24 h-24 rounded-full" style={{ backgroundColor: "#e91e63" }}></div>
                    <div className="absolute bottom-8 left-1/3 w-16 h-16 rounded-full" style={{ backgroundColor: "#3498db" }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div
                                className=" rounded-lg"
                                style={{ backgroundColor: "#ffffff" }}
                            >
                                <img src="talan.png" className="h-8 w-30 text-white" />
                            </div>
                            <div>
                                <h1
                                    className="text-3xl font-bold"
                                    style={{ color: "#2c3e50" }}
                                >
                                    Spark Platform
                                </h1>
                                <p
                                    className="text-lg"
                                    style={{ color: "#666666" }}
                                >
                                    Intelligent Automation for Modern Business
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={onCreateAgent}
                            size="lg"
                            className="flex items-center space-x-2 px-8 py-3 text-lg font-semibold button-hover-glow transition-all duration-200 hover:scale-105 animate-pulse-subtle"
                            style={{
                                backgroundColor: "#e91e63",
                                color: "#ffffff",
                                border: "none",
                            }}
                            suppressHydrationWarning
                        >
                            <Sparkles className="h-5 w-5" />
                            <span>Create Your Agent</span>
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2
                        className="text-4xl font-bold mb-6"
                        style={{ color: "#2c3e50" }}
                    >
                        Discover Our Intelligent Agents
                    </h2>
                    <p
                        className="text-xl max-w-3xl mx-auto leading-relaxed"
                        style={{ color: "#666666" }}
                    >
                        Empower your business with AI-driven agents designed to streamline operations,
                        enhance productivity, and deliver exceptional results across every department.
                    </p>
                </div>        {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {featuredAgents.map((agent) => (
                        <Card
                            key={agent.id}
                            className="h-full transition-all duration-300 hover:shadow-lg card-hover-effect cursor-pointer border-2"
                            style={{
                                borderColor: "#e1e8ed",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div
                                        className="p-3 rounded-lg flex-shrink-0"
                                        style={{ backgroundColor: agent.bgColor }}
                                    >
                                        <agent.icon
                                            className="h-6 w-6"
                                            style={{ color: agent.color }}
                                        />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                        style={{
                                            backgroundColor: agent.bgColor,
                                            color: agent.color,
                                            border: "none",
                                        }}
                                    >
                                        {agent.category}
                                    </Badge>
                                </div>
                                <CardTitle
                                    className="text-xl font-semibold mt-4"
                                    style={{ color: "#2c3e50" }}
                                >
                                    {agent.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{
                                        color: "#666666",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {agent.description}
                                </p>
                                <div className="mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full transition-all duration-200 bg-gradient-to-br from-slate-300 via-gray-200 to-pink-200"
                                        style={{
                                            borderColor: agent.color,
                                            color: agent.color,
                                            backgroundColor: "transparent",
                                        }}
                                        onClick={() => window.open("https://references.sparkai-talan.com", "_blank")}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = agent.color
                                            e.currentTarget.style.color = "#ffffff"
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "transparent"
                                            e.currentTarget.style.color = agent.color
                                        }}
                                        suppressHydrationWarning
                                    >
                                        Visit Website
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center py-16 rounded-2xl bg-gradient-to-r from-slate-800 via-purple-800 to-pink-600 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
                        <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-white"></div>
                        <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-white"></div>
                        <div className="absolute bottom-40 right-1/3 w-8 h-8 rounded-full bg-white"></div>
                    </div>

                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <h3 className="text-3xl font-bold text-white mb-6">
                            Ready to Build Your Custom Agent?
                        </h3>
                        <p className="text-xl text-white opacity-90 mb-8 leading-relaxed">
                            Join us in this intelligent agentic platform to transform
                            your operations. Create your personalized agent in minutes with our intuitive workflow builder.
                        </p>
                        <Button
                            onClick={onCreateAgent}
                            size="lg"
                            className="px-12 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: "#e91e63",
                                color: "#ffffff",
                                border: "none",
                            }}
                            suppressHydrationWarning
                        >
                            <Sparkles className="mr-3 h-6 w-6" />
                            Start Creating Now
                            <ArrowRight className="ml-3 h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-20">
                    <h3
                        className="text-2xl font-bold text-center mb-12"
                        style={{ color: "#2c3e50" }}
                    >
                        Why Choose Spark Platform?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ backgroundColor: "#e8f4f8" }}
                            >
                                <Bot
                                    className="h-8 w-8"
                                    style={{ color: "#3498db" }}
                                />
                            </div>
                            <h4
                                className="text-lg font-semibold mb-3"
                                style={{ color: "#2c3e50" }}
                            >
                                AI-Powered Intelligence
                            </h4>
                            <p
                                className="text-sm"
                                style={{ color: "#666666" }}
                            >
                                Advanced machine learning algorithms that adapt and improve with every interaction.
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ backgroundColor: "#ecf0f1" }}
                            >
                                <Sparkles
                                    className="h-8 w-8"
                                    style={{ color: "#8e44ad" }}
                                />
                            </div>
                            <h4
                                className="text-lg font-semibold mb-3"
                                style={{ color: "#2c3e50" }}
                            >
                                Easy Customization
                            </h4>
                            <p
                                className="text-sm"
                                style={{ color: "#666666" }}
                            >
                                Drag-and-drop workflow builder that requires no coding experience.
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ backgroundColor: "#f0f0f0" }}
                            >
                                <TrendingUp
                                    className="h-8 w-8"
                                    style={{ color: "#27ae60" }}
                                />
                            </div>
                            <h4
                                className="text-lg font-semibold mb-3"
                                style={{ color: "#2c3e50" }}
                            >
                                Enterprise Ready
                            </h4>
                            <p
                                className="text-sm"
                                style={{ color: "#666666" }}
                            >
                                Scalable, secure, and designed for enterprise-level performance and reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 py-16 bg-gradient-to-r from-slate-800 to-purple-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                >
                                    <img src="talan.png" className="h-8 w-30 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Spark Platform</h3>
                            </div>
                            <p className="text-white opacity-80 mb-4 max-w-md leading-relaxed">
                                Revolutionizing business automation with intelligent AI agents.
                                Streamline your operations, boost productivity, and unlock new possibilities
                                with our cutting-edge platform.
                            </p>
                            <div className="flex space-x-4">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                >
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                >
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                >
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Agent Builder</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Templates</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Integrations</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Analytics</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Security</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Documentation</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Community</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Help Center</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">Contact Us</a></li>
                                <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity duration-200">API Reference</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div
                        className="pt-8 border-t flex flex-col md:flex-row justify-between items-center"
                        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                        <p className="text-white opacity-60 text-sm mb-4 md:mb-0">
                            © 2025 Talan. All rights reserved. Empowering businesses with intelligent automation.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-white opacity-60 hover:opacity-100 text-sm transition-opacity duration-200">Privacy Policy</a>
                            <a href="#" className="text-white opacity-60 hover:opacity-100 text-sm transition-opacity duration-200">Terms of Service</a>
                            <a href="#" className="text-white opacity-60 hover:opacity-100 text-sm transition-opacity duration-200">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
