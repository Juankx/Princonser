import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [
        'deepmerge',
        'tiny-warning',
        'hoist-non-react-statics',
        'clsx',
        'axios',
        '@emotion/styled',
        '@emotion/react',
        '@emotion/cache'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          axios: ['axios'],
          emotion: ['@emotion/styled', '@emotion/react', '@emotion/cache']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
    exclude: [
      'deepmerge',
      'tiny-warning',
      'hoist-non-react-statics',
      'clsx',
      'axios',
      '@emotion/styled',
      '@emotion/react',
      '@emotion/cache'
    ]
  },
  resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'main'],
    alias: {
      'tiny-warning': 'tiny-warning/dist/tiny-warning.esm.js',
      'hoist-non-react-statics': 'hoist-non-react-statics/dist/hoist-non-react-statics.esm.js',
      'clsx': 'clsx/dist/clsx.mjs',
      'axios': 'axios/dist/axios.js',
      '@emotion/styled': '@emotion/styled/dist/emotion-styled.esm.js',
      '@emotion/react': '@emotion/react/dist/emotion-react.esm.js',
      '@emotion/cache': '@emotion/cache/dist/emotion-cache.esm.js'
    }
  }
}) 