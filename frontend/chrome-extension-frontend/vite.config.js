import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         // Copy additional files to the root of the dist folder
  //         'manifest.json': manifest,
  //         // Add more entries as needed
  //       },
  //     },
  //   },
  // },
})