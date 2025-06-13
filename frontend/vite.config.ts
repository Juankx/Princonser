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
        'prop-types',
        'tiny-warning',
        'deepmerge',
        'clsx',
        'date-fns',
        'axios',
        '@emotion/react',
        '@emotion/styled',
        '@emotion/cache',
        '@mui/material',
        '@mui/icons-material',
        '@popperjs/core',
        'react',
        'react-dom',
        'react-router-dom',
        'ReactPropTypesSecret',
        'hoist-non-react-statics',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
      '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material'),
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled'),
      '@emotion/cache': path.resolve(__dirname, 'node_modules/@emotion/cache'),
      'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
      'tiny-warning': path.resolve(__dirname, 'node_modules/tiny-warning'),
      'deepmerge': path.resolve(__dirname, 'node_modules/deepmerge'),
      'clsx': path.resolve(__dirname, 'node_modules/clsx'),
      'date-fns': path.resolve(__dirname, 'node_modules/date-fns'),
      'axios': path.resolve(__dirname, 'node_modules/axios'),
      '@popperjs/core': path.resolve(__dirname, 'node_modules/@popperjs/core'),
      'ReactPropTypesSecret': path.resolve(__dirname, 'node_modules/react/lib/ReactPropTypesSecret'),
      'hoist-non-react-statics': path.resolve(__dirname, 'node_modules/hoist-non-react-statics'),
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
      '@emotion/cache',
      'prop-types',
      'tiny-warning',
      'deepmerge',
      'clsx',
      'date-fns',
      'axios',
      '@popperjs/core',
      'ReactPropTypesSecret',
      'hoist-non-react-statics',
    ],
    exclude: [],
  },
}) 