import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n';
import { ThemeProvider } from './shadcnuicomponents/theme-provider.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
