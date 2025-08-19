# Text-to-Graph Feature Implementation

## Overview
The text-to-graph feature allows users to generate workflow diagrams by simply describing their process in natural language. The system converts text descriptions into visual workflow nodes and connections.

## Components Added

### 1. TextToGraphDialog Component
- **Location**: `components/text-to-graph-dialog.tsx`
- **Purpose**: Provides UI for text input and workflow generation
- **Features**:
  - Large text area for workflow description
  - Example prompts to guide users
  - Real-time validation
  - Loading states during generation
  - Information about what will be generated

### 2. Integration in TopToolbar
- **Location**: `components/top-toolbar.tsx`
- **Added**: "Generate from Text" button with wizard icon
- **Placement**: Next to the "Back to Welcome" button for easy access

### 3. Backend Integration Structure
- **Location**: `BACKEND_INTEGRATION_GUIDE.ts`
- **Purpose**: Complete guide for implementing the AI backend
- **Includes**: API endpoint structure, AI service integration examples, data formats

### 4. Type Definitions
- **Location**: `types/workflow-generation.ts`
- **Purpose**: TypeScript interfaces for workflow generation
- **Includes**: Request/response types, node/edge definitions, workflow patterns

## How It Works

### Frontend Flow
1. User clicks "Generate from Text" button in the toolbar
2. TextToGraphDialog opens with input area and examples
3. User enters workflow description or selects an example
4. System validates input and shows loading state
5. API call is made to backend with description
6. Generated nodes and edges replace current workflow
7. User can immediately interact with the generated workflow

### Backend Integration (To Be Implemented)
1. Receive text description via POST to `/api/generate-workflow`
2. Process description using AI service (OpenAI, Claude, etc.)
3. Convert AI response to workflow nodes and edges
4. Return structured JSON with nodes and connections
5. Frontend automatically updates the canvas

## Example Usage

### Sample Input
```
"Create a customer support workflow that analyzes incoming emails, 
categorizes them by urgency, and routes them to appropriate agents"
```

### Generated Output
- **Email Analyzer Agent**: Processes incoming emails
- **Urgency Classifier Tool**: Categorizes by priority
- **Routing Conditional**: Decides which agent to assign
- **Assignment Tool**: Routes to appropriate agent
- **Notification Tool**: Sends confirmations

## Integration Steps for Backend

### 1. Create API Endpoint
```bash
mkdir -p app/api/generate-workflow
# Copy content from BACKEND_INTEGRATION_GUIDE.ts
```

### 2. Add Environment Variables
```bash
# Add to .env.local
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

### 3. Install AI SDK
```bash
npm install openai
# or
npm install @anthropic-ai/sdk
```

### 4. Implement AI Processing
- Replace placeholder response in the guide
- Add prompt engineering for workflow generation
- Parse AI response into node/edge format
- Add error handling and validation

## Features

### ✅ Implemented
- [x] UI dialog for text input
- [x] Example prompts and guidance
- [x] Integration with toolbar
- [x] Loading states and validation
- [x] Type definitions
- [x] Backend integration guide
- [x] Error handling structure

### 🔄 To Be Implemented (Backend)
- [ ] AI service integration
- [ ] Prompt engineering for workflow generation
- [ ] Response parsing and validation
- [ ] Node positioning algorithms
- [ ] Workflow complexity analysis
- [ ] Performance optimization

## Testing

1. Start the development server: `npm run dev`
2. Navigate to the workflow builder
3. Click "Generate from Text" button
4. Enter a workflow description
5. Currently shows placeholder/mock response
6. Replace with actual AI integration for full functionality

## Customization

### Adding New Node Types
Edit the backend integration to support additional node types by modifying the node generation logic.

### Custom Prompts
Update the `examplePrompts` array in `TextToGraphDialog` to provide domain-specific examples.

### Styling
Modify the dialog styling by updating the Tailwind classes and Talan color variables.

## Architecture

```
User Input → TextToGraphDialog → WorkflowBuilder → API Call → AI Service → Response → Canvas Update
```

This feature provides a powerful way to quickly bootstrap workflows from natural language descriptions, making the platform more accessible to non-technical users while maintaining the flexibility for technical customization.
