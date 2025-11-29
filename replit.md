# Widget SDK - Embeddable Widgets

## Overview

A drop-in widget system that allows websites to add professional embeddable components with a single script tag. The SDK provides three core widget types (contact forms, calculators, and chat widgets) that can be integrated into any website with minimal configuration.

## Recent Changes (November 2025)

- **Completed MVP Implementation**: Built fully functional widget SDK with backend API support
- **Three Widget Types**: Contact form, calculator, and chat widgets all working
- **Live Demo Page**: Added `/demo` route with fully interactive widget demonstrations
- **Backend API**: Form submission and chat message endpoints with validation
- **Direct DOM Integration**: Widgets render directly into host site DOM with scoped styles

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for the demo/marketing site
- Vite as the build tool and development server
- Tailwind CSS for styling with custom design tokens
- shadcn/ui component library based on Radix UI primitives
- Wouter for client-side routing

**Pages:**
- `/` - Homepage with hero section, features, widget previews, and documentation
- `/demo` - Live demo page with fully functional embeddable widgets
- `/404` - Not found page

**Design System:**
- Primary brand color: Blue (#1d4ed8 / hsl(217 91% 45%))
- Typography: System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Support for light and dark modes (class-based)
- Custom CSS variables for theming (defined in `client/src/index.css`)
- Elevation system with hover effects via utility classes
- Mobile-first responsive design approach

**Component Organization:**
- **Pages**: Home, Demo, NotFound (in `client/src/pages/`)
- **Sections**: HeroSection, FeaturesSection, IntegrationExamples, DocumentationSection, Footer
- **Widgets**: WidgetPreview component for showcasing widgets on homepage
- **UI Components**: shadcn/ui primitives in `client/src/components/ui/`

### Widget SDK

**SDK File Location:** `client/public/widget-sdk.js`

**Architecture:**
- Vanilla JavaScript (no framework dependencies)
- IIFE (Immediately Invoked Function Expression) for browser compatibility
- Direct DOM manipulation and rendering
- Scoped CSS styles to prevent conflicts with host sites
- Exposes global `WidgetSDK` object for initialization

**Widget Types:**

1. **Form Widget** (`form`)
   - Renders contact form with name, email, and message fields
   - Requires a target container element (e.g., `#contact-form`)
   - Submits to `/api/forms/submit` via fetch
   - Supports `onSubmit` callback for custom handling
   - Displays success/error messages inline

2. **Calculator Widget** (`calculator`)
   - Renders fully functional calculator
   - Requires a target container element (e.g., `#calculator`)
   - Client-side calculation (no backend needed)
   - Grid layout with number and operator buttons
   - Monospace display for calculation results

3. **Chat Widget** (`chat`)
   - Renders as floating button (position configurable)
   - No target container needed - appends to document body
   - Opens to full chat interface with message history
   - Sends messages to `/api/chat/message` endpoint
   - Receives auto-response from bot
   - Supports `onMessage` callback
   - Position options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'

**SDK Initialization:**
```javascript
WidgetSDK.init({
  form: {
    target: '#contact-form',
    onSubmit: (data) => console.log(data)
  },
  calculator: {
    target: '#calculator'
  },
  chat: {
    position: 'bottom-right',
    onMessage: (msg) => console.log(msg)
  }
});
```

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module system
- Development server with Vite middleware integration
- Serves both the React app and the SDK file

**API Endpoints:**

1. **GET /widget-sdk.js**
   - Serves the widget SDK JavaScript file
   - Static file serving from `client/public/widget-sdk.js`

2. **POST /api/forms/submit**
   - Accepts form submissions with name, email, message
   - Validates using Zod schema (insertFormSubmissionSchema)
   - Stores in memory storage
   - Returns success confirmation with submission data

3. **POST /api/chat/message**
   - Accepts chat messages with sessionId, text, sender
   - Validates sender as enum: 'user' | 'bot'
   - Stores user message
   - Auto-generates bot response message
   - Returns both user message and bot response

4. **GET /api/chat/history/:sessionId**
   - Retrieves all chat messages for a session
   - Returns messages sorted by timestamp

5. **GET /api/forms/submissions**
   - Returns all form submissions (for admin/demo purposes)
   - Sorted by submission date (newest first)

**Data Layer:**
- In-memory storage implementation (MemStorage class)
- Interface-based design (IStorage) allows easy swap to database
- UUID generation for entity IDs using crypto.randomUUID()
- Automatic timestamp tracking on all submissions

### Data Models

**Schema Location:** `shared/schema.ts`

**Form Submissions:**
```typescript
{
  id: string;              // UUID, auto-generated
  name: string;            // Required
  email: string;           // Required
  message: string;         // Required
  submittedAt: Date;       // Auto-generated timestamp
}
```

**Chat Messages:**
```typescript
{
  id: string;              // UUID, auto-generated
  sessionId: string;       // Required for grouping conversations
  text: string;            // Message content
  sender: 'user' | 'bot';  // Validated enum
  sentAt: Date;            // Auto-generated timestamp
}
```

**Data Validation:**
- Zod schemas generated from Drizzle schema using drizzle-zod
- Insert schemas exclude auto-generated fields (id, timestamps)
- Chat sender validated as enum to ensure only 'user' or 'bot'
- Full TypeScript type safety throughout

### Storage Interface

**Location:** `server/storage.ts`

**IStorage Interface:**
```typescript
interface IStorage {
  // Form submissions
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  getAllFormSubmissions(): Promise<FormSubmission[]>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
}
```

**Current Implementation:**
- MemStorage class for in-memory data storage
- Map-based storage for both forms and chat messages
- Can be swapped for database implementation without API changes
- Perfect for development and demo purposes

## Integration Approach

**Direct DOM Integration:**
- Widgets inject HTML directly into the host page's DOM
- CSS styles are scoped with `.widget-` prefixes to prevent conflicts
- No iframe isolation (suitable for same-origin embedding)
- Simple integration model - just add script tag and call init

**Suitable For:**
- Same-origin website integration
- Sites where you control both the host and widget
- Applications requiring tight integration with page content
- Scenarios where iframe limitations are problematic

**Not Suitable For:**
- Cross-origin embedding where security isolation is required
- Third-party widget distribution to untrusted sites
- Scenarios requiring strict style/script isolation

## External Dependencies

**Core Framework Dependencies:**
- React and React DOM (v18+) - for demo site only, not SDK
- Express.js for backend server
- Vite for build tooling and development
- TypeScript for type safety

**UI Component Libraries (Demo Site Only):**
- Radix UI primitives (tabs, cards, buttons, etc.)
- Tailwind CSS for utility-first styling
- Lucide React for icons
- Wouter for routing

**Database and Validation:**
- Drizzle ORM (schema definitions only, not used at runtime)
- Zod for runtime validation
- drizzle-zod for generating Zod schemas from Drizzle schemas

**Development Tools:**
- tsx for running TypeScript in development
- esbuild for production bundling
- PostCSS with Autoprefixer for CSS processing

## Future Enhancements

**Database Persistence:**
- PostgreSQL database integration (schema already defined)
- Drizzle Kit migrations for schema management
- Swap MemStorage for database-backed storage

**Security & Authentication:**
- API key authentication for widget endpoints
- Domain whitelist for CORS validation
- Rate limiting per workspace/API key
- CSRF protection for form submissions

**Advanced Features:**
- Customizable widget themes (colors, fonts, styles)
- Webhook support for forwarding submissions to customer backends
- Analytics and usage tracking
- File upload support for forms
- Rich text formatting in chat
- Typing indicators and read receipts
- Multi-language support (i18n)

**AI-Powered Chat (Planned):**
- Integration with OpenAI/Claude for intelligent responses
- Intent detection and routing
- Sentiment analysis
- Auto-escalation to human agents
- Conversation context and memory

## Configuration Files

- `components.json`: shadcn/ui configuration
- `tailwind.config.ts`: Tailwind customization with design tokens
- `tsconfig.json`: TypeScript configuration with path aliases
- `vite.config.ts`: Main app build configuration
- `drizzle.config.ts`: Database migration configuration
