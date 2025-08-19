import type { Template } from './workflow-store'

// Import all template JSON files
import customerSupportTemplate from '../data/templates/customer-support-automation.json'
import documentAnalysisTemplate from '../data/templates/document-analysis-pipeline.json'
import leadGenerationTemplate from '../data/templates/lead-generation-qualification.json'
import contentCreationTemplate from '../data/templates/content-creation-pipeline.json'
import emailMarketingTemplate from '../data/templates/email-marketing-automation.json'
import dataProcessingTemplate from '../data/templates/data-processing-pipeline.json'
import socialMediaTemplate from '../data/templates/social-media-campaign.json'
import ecommerceTemplate from '../data/templates/e-commerce-order-processing.json'
import hrRecruitmentTemplate from '../data/templates/hr-recruitment-pipeline.json'

// Helper function to convert string dates to Date objects
function parseTemplate(template: any): Template {
    return {
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt)
    }
}

// Load all templates
export const dummyTemplates: Template[] = [
    parseTemplate(customerSupportTemplate),
    parseTemplate(documentAnalysisTemplate),
    parseTemplate(leadGenerationTemplate),
    parseTemplate(contentCreationTemplate),
    parseTemplate(emailMarketingTemplate),
    parseTemplate(dataProcessingTemplate),
    parseTemplate(socialMediaTemplate),
    parseTemplate(ecommerceTemplate),
    parseTemplate(hrRecruitmentTemplate)
]

// Function to get templates by category
export function getTemplatesByCategory(category: string): Template[] {
    return dummyTemplates.filter(template => template.category === category)
}

// Function to get template by ID
export function getTemplateById(id: string): Template | undefined {
    return dummyTemplates.find(template => template.id === id)
}

// Function to search templates
export function searchTemplates(query: string): Template[] {
    const lowercaseQuery = query.toLowerCase()
    return dummyTemplates.filter(template =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)) ||
        template.category.toLowerCase().includes(lowercaseQuery)
    )
}

// Get all unique categories
export function getTemplateCategories(): string[] {
    const categories = dummyTemplates.map(template => template.category)
    return [...new Set(categories)]
}

// Get all unique tags
export function getTemplateTags(): string[] {
    const tags = dummyTemplates.flatMap(template => template.tags)
    return [...new Set(tags)]
}
