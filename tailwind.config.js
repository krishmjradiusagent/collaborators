/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#5a5ff2", // Figma Primary
          50: "#EEF2FF",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        neutral: {
           50: "#F9FAFB",
           100: "#F1F1FE",
           200: "#E5E7EB",
           700: "#374151",
           800: "#1F2937",
           900: "#111827",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'radius-nav': '0px 4px 8px 0px rgba(0,0,0,0.05)',
        'radius-fab': '0px 4px 10px 0px rgba(165,168,255,0.3)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
