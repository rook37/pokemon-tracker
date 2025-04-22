import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: process.env.ALLOWED_HOST
      ? [process.env.ALLOWED_HOST]
      : [],
  },
})
