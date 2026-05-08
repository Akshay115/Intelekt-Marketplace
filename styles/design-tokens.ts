export const designTokens = {
  colors: {
    brand: {
      teal: "oklch(0.56 0.122 184.2)",
      blue: "oklch(0.58 0.13 239.5)",
      amber: "oklch(0.76 0.13 82.2)",
    },
    semantic: {
      success: "var(--success)",
      warning: "var(--warning)",
      destructive: "var(--destructive)",
    },
    surface: {
      background: "var(--background)",
      raised: "var(--surface-raised)",
      subtle: "var(--surface-subtle)",
      border: "var(--border)",
    },
  },
  spacing: {
    pageX: "clamp(1rem, 4vw, 3rem)",
    sectionY: "clamp(3rem, 8vw, 7rem)",
    gridGap: "1rem",
  },
  radius: {
    sm: "calc(var(--radius) * 0.6)",
    md: "calc(var(--radius) * 0.8)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) * 1.4)",
  },
  typography: {
    sans: "Geist, Geist Fallback, ui-sans-serif, system-ui, sans-serif",
    mono: "Geist Mono, Geist Mono Fallback, ui-monospace, monospace",
    display: {
      weight: 650,
      lineHeight: 1,
      letterSpacing: "0",
    },
  },
} as const;
