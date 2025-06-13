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
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      external: ['axios'],
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ]
        }
      }
    }
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
      'axios': path.resolve(__dirname, 'node_modules/axios/dist/axios.js'),
      'clsx': path.resolve(__dirname, 'node_modules/clsx'),
      'tiny-warning': path.resolve(__dirname, 'node_modules/tiny-warning'),
      'hoist-non-react-statics': path.resolve(__dirname, 'node_modules/hoist-non-react-statics'),
      '@popperjs/core': path.resolve(__dirname, 'node_modules/@popperjs/core'),
      'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
      '@emotion/cache': path.resolve(__dirname, 'node_modules/@emotion/cache'),
      'deepmerge': path.resolve(__dirname, 'node_modules/deepmerge/dist/umd.js')
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'formik',
      'yup',
      'date-fns',
      'deepmerge'
    ],
    exclude: ['axios']
  },
}) 