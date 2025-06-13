import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'axios',
        'clsx',
        'tiny-warning',
        'hoist-non-react-statics',
        '@popperjs/core',
        'prop-types',
        '@emotion/cache'
      ]
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
      '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material'),
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled'),
      'axios': path.resolve(__dirname, 'node_modules/axios'),
      'clsx': path.resolve(__dirname, 'node_modules/clsx'),
      'tiny-warning': path.resolve(__dirname, 'node_modules/tiny-warning'),
      'hoist-non-react-statics': path.resolve(__dirname, 'node_modules/hoist-non-react-statics'),
      '@popperjs/core': path.resolve(__dirname, 'node_modules/@popperjs/core'),
      'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
      '@emotion/cache': path.resolve(__dirname, 'node_modules/@emotion/cache')
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'axios',
      'clsx',
      'tiny-warning',
      'hoist-non-react-statics',
      '@popperjs/core',
      'prop-types',
      '@emotion/cache'
    ],
    exclude: [],
  },
}) 