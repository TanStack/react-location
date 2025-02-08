import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      codeSplittingOptions: {
        shouldSplit: ({ routeId }) => {
          if (routeId === '/posts') {
            return [['component', 'pendingComponent']]
          }
        },
      },
    }),
    react(),
  ],
})
