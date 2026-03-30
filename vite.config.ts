import { defineConfig } from "vite"
import { tanstackStart as start } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import tailwind from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwind(), start(), react()],
  resolve: { tsconfigPaths: true },
})
