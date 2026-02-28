import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToolProvider } from './context/ToolContext.tsx'
import { FlowGraphProvider } from './context/FlowGraphContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToolProvider>
      <FlowGraphProvider>
        <App />
      </FlowGraphProvider>
    </ToolProvider>
  </StrictMode>,
)
