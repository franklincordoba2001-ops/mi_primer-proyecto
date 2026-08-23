import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-pqrs-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/pqrs' || req.url?.startsWith('/api/pqrs?')) {
            try {
              const filePath = path.resolve(process.cwd(), 'data/pqrs.json')
              const fileContents = fs.readFileSync(filePath, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(fileContents)
            } catch (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Error al leer data/pqrs.json' }))
            }
            return
          }
          next()
        })
      }
    }
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
