# OpenAI ChatKit Starter App - Complete Codebase Documentation

## Project Overview

This is a Next.js application that serves as a starter template for building ChatKit applications using OpenAI's hosted workflows. The app provides a minimal UI with the ChatKit web component and a ready-to-use session endpoint for experimenting with OpenAI-hosted workflows built using Agent Builder.

## Tech Stack

- **Framework**: Next.js 15.5.4
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4
- **TypeScript**: 5
- **ChatKit**: @openai/chatkit-react >=1.1.1
- **Linting**: ESLint 9

## Project Structure

```
openai-chatkit-starter-app/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── create-session/
│   │       └── route.ts         # API endpoint for ChatKit sessions
│   ├── App.tsx                   # Main app component
│   ├── favicon.ico               # App favicon
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ChatKitPanel.tsx         # Main ChatKit integration component
│   └── ErrorOverlay.tsx         # Error handling overlay
├── hooks/                        # Custom React hooks
│   └── useColorScheme.ts        # Color scheme management hook
├── lib/                         # Utility libraries
│   └── config.ts                # App configuration
├── public/                      # Static assets
│   └── docs/
│       └── workflow.jpg         # Documentation image
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── next-env.d.ts               # Next.js TypeScript definitions
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

## Core Files Analysis

### 1. Package Configuration (`package.json`)

```json
{
  "name": "openai-chatkit-starter-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@openai/chatkit-react": ">=1.1.1 <2.0.0",
    "next": "^15.5.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "optionalDependencies": {
    "lightningcss-linux-x64-gnu": "1.30.1",
    "@tailwindcss/oxide-linux-x64-gnu": "4.1.11"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 2. App Entry Point (`app/page.tsx`)

```tsx
import App from "./App";

export default function Home() {
  return <App />;
}
```

### 3. Root Layout (`app/layout.tsx`)

```tsx
import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentKit demo",
  description: "Demo of ChatKit with hosted workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

### 4. Main App Component (`app/App.tsx`)

```tsx
"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function App() {
  const { scheme, setScheme } = useColorScheme();

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <ChatKitPanel
          theme={scheme}
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={setScheme}
        />
      </div>
    </main>
  );
}
```

### 5. ChatKit Panel Component (`components/ChatKitPanel.tsx`)

This is the core component that integrates with OpenAI's ChatKit. Key features:

- **Session Management**: Handles ChatKit session creation and management
- **Error Handling**: Comprehensive error states for script loading, session creation, and integration
- **Theme Support**: Light/dark theme switching with system preference detection
- **Client Tools**: Handles `switch_theme` and `record_fact` tool invocations
- **File Upload**: Enables file attachments in the chat interface

**Key Types:**
```tsx
export type FactAction = {
  type: "save";
  factId: string;
  factText: string;
};

type ChatKitPanelProps = {
  theme: ColorScheme;
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
  onThemeRequest: (scheme: ColorScheme) => void;
};

type ErrorState = {
  script: string | null;
  session: string | null;
  integration: string | null;
  retryable: boolean;
};
```

**Key Functions:**
- `getClientSecret()`: Creates ChatKit sessions via API
- `handleResetChat()`: Resets chat state and reinitializes
- `extractErrorDetail()`: Parses error messages from API responses

### 6. Error Overlay Component (`components/ErrorOverlay.tsx`)

```tsx
"use client";

import type { ReactNode } from "react";

type ErrorOverlayProps = {
  error: string | null;
  fallbackMessage?: ReactNode;
  onRetry?: (() => void) | null;
  retryLabel?: string;
};

export function ErrorOverlay({
  error,
  fallbackMessage,
  onRetry,
  retryLabel,
}: ErrorOverlayProps) {
  if (!error && !fallbackMessage) {
    return null;
  }

  const content = error ?? fallbackMessage;

  if (!content) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col justify-center rounded-[inherit] bg-white/85 p-6 text-center backdrop-blur dark:bg-slate-900/90">
      <div className="pointer-events-auto mx-auto w-full max-w-md rounded-xl bg-white px-6 py-4 text-lg font-medium text-slate-700 dark:bg-transparent dark:text-slate-100">
        <div>{content}</div>
        {error && onRetry ? (
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-none transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            onClick={onRetry}
          >
            {retryLabel ?? "Restart chat"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
```

### 7. Color Scheme Hook (`hooks/useColorScheme.ts`)

A sophisticated hook for managing color schemes with system preference detection:

```tsx
export type ColorScheme = "light" | "dark";
export type ColorSchemePreference = ColorScheme | "system";

type UseColorSchemeResult = {
  scheme: ColorScheme;
  preference: ColorSchemePreference;
  setScheme: (scheme: ColorScheme) => void;
  setPreference: (preference: ColorSchemePreference) => void;
  resetPreference: () => void;
};
```

**Key Features:**
- System preference detection using `matchMedia`
- Local storage persistence
- Cross-tab synchronization via storage events
- Server-side rendering support
- Automatic DOM class and CSS custom property updates

### 8. Configuration (`lib/config.ts`)

```tsx
import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "What can you do?",
    prompt: "What can you do?",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Ask anything...";

export const GREETING = "How can I help you today?";

export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
      level: 1,
    },
  },
  radius: "round",
});
```

### 9. API Route (`app/api/create-session/route.ts`)

This is an Edge Runtime API route that handles ChatKit session creation:

**Key Features:**
- **Edge Runtime**: Optimized for performance
- **Session Management**: Generates and manages user sessions with cookies
- **Error Handling**: Comprehensive error extraction and reporting
- **Security**: HttpOnly cookies with proper attributes
- **File Upload Support**: Configurable file upload capabilities

**Request/Response Flow:**
1. Validates OpenAI API key
2. Resolves user ID from cookies or generates new one
3. Extracts workflow ID from request or environment
4. Makes upstream request to OpenAI ChatKit API
5. Returns client secret and expiration data
6. Sets session cookie for future requests

**Key Functions:**
- `resolveUserId()`: Manages user session persistence
- `extractUpstreamError()`: Parses API error responses
- `buildJsonResponse()`: Constructs standardized API responses
- `safeParseJson()`: Safe JSON parsing with error handling

### 10. Global Styles (`app/globals.css`)

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
  color-scheme: light;
}

:root[data-color-scheme="dark"] {
  --background: #0a0a0a;
  --foreground: #ededed;
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme]) {
    --background: #0a0a0a;
    --foreground: #ededed;
    color-scheme: dark;
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: Arial, Helvetica, sans-serif;
  --font-mono: SFMono-Regular, Consolas, "Liberation Mono", monospace;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}
```

### 11. Configuration Files

**TypeScript Configuration (`tsconfig.json`):**
- Target: ES2017
- Module resolution: bundler
- Path mapping: `@/*` to `./*`
- Strict mode enabled
- Next.js plugin integration

**Next.js Configuration (`next.config.ts`):**
- Basic webpack configuration
- Path alias support

**ESLint Configuration (`eslint.config.mjs`):**
- Next.js core web vitals
- TypeScript support
- Standard ignore patterns

**PostCSS Configuration (`postcss.config.mjs`):**
- Tailwind CSS plugin integration

## Environment Variables

Required environment variables:

```bash
# OpenAI API Key (must be from same org as Agent Builder)
OPENAI_API_KEY=sk-...

# ChatKit Workflow ID (from Agent Builder)
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_...

# Optional: Custom ChatKit API base URL
CHATKIT_API_BASE=https://api.openai.com
```

## Key Features

### 1. ChatKit Integration
- Full ChatKit web component integration
- Session management with user persistence
- File upload support
- Custom theme configuration

### 2. Error Handling
- Script loading error detection
- Session creation error handling
- Integration error management
- User-friendly error overlays with retry functionality

### 3. Theme System
- Light/dark theme support
- System preference detection
- Cross-tab synchronization
- Persistent user preferences

### 4. Client Tools
- Theme switching via ChatKit tools
- Fact recording and processing
- Extensible tool system

### 5. Development Experience
- TypeScript throughout
- ESLint configuration
- Hot reload support
- Comprehensive logging in development

## Usage Flow

1. **Initialization**: App loads ChatKit script and initializes color scheme
2. **Session Creation**: User interaction triggers session creation via API
3. **Chat Interface**: ChatKit component renders with configured theme and settings
4. **Tool Handling**: Client tools (theme switching, fact recording) are processed
5. **Error Recovery**: Errors are displayed with retry options

## Customization Points

1. **Theme Configuration**: Modify `getThemeConfig()` in `lib/config.ts`
2. **Starter Prompts**: Update `STARTER_PROMPTS` array
3. **Error Messages**: Customize error handling in `ChatKitPanel.tsx`
4. **Styling**: Modify `globals.css` and Tailwind classes
5. **API Behavior**: Extend session creation logic in `route.ts`

## Security Considerations

- HttpOnly cookies for session management
- Secure cookie attributes in production
- API key validation
- Input sanitization
- Error message filtering

## Performance Optimizations

- Edge Runtime for API routes
- Script loading with `beforeInteractive` strategy
- Efficient state management with refs
- Minimal re-renders through proper dependency arrays
- Lazy error state initialization

This codebase provides a solid foundation for building ChatKit applications with modern React patterns, comprehensive error handling, and a polished user experience.
