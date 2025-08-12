// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     global: 'globalThis',
//   },
//   optimizeDeps: {
//     include: ['sockjs-client']
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['sockjs-client']
  },
  server: {
    host: true,
    port: 5713
  },
  preview: {
    host: true,
    port: 5713
  }
})