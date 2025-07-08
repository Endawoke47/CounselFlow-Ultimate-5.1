import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { App } from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { WebSocketProvider } from './hooks/useWebSocket.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { OfflineProvider } from './hooks/useOfflineCapability.tsx'
import { Toaster } from 'react-hot-toast'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <OfflineProvider>
              <WebSocketProvider>
                <App />
                <Toaster position="top-right" />
              </WebSocketProvider>
            </OfflineProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)