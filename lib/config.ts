import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "¿Qué es ChatKit?",
    prompt: "What is ChatKit and what does it do?",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT =
  "Elige alguna de las opciones o comienza a escribir :)";

export const GREETING = "¡Hola! ¿En qué puedo ayudarte hoy?";

export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  colorScheme: "light",
  radius: "pill",
  density: "compact",
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: "#d67a7a",
      level: 1,
    },
  },
  typography: {
    baseSize: 16,
    fontFamily:
      '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
    fontFamilyMono:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
    fontSources: [
      {
        family: "OpenAI Sans",
        src: "https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2",
        weight: 400,
        style: "normal",
        display: "swap",
      },
    ],
  },
});

export const COMPOSER_ATTACHMENTS = {
  enabled: true,
  maxCount: 5,
  maxSize: 10485760, // 10 MB
} as const;

export const COMPOSER_TOOLS = [
  {
    id: "search_docs",
    label: "Search docs",
    shortLabel: "Docs",
    placeholderOverride: "Search documentation",
    icon: "book-open",
    pinned: false,
  },
] as const;

export const MODEL_OPTIONS = [
  {
    id: "gpt-5",
    label: "gpt-5",
    description: "Balanced intelligence",
    default: true,
  },
] as const;
