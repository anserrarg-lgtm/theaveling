import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { aplicarVistaForzada } from './utils/viewport.ts'

// 2026-11-26: si la URL trae `?vista=desktop` / `?vista=mobile`, marca el
// <html> ANTES de renderizar — así el primer paint ya sale con la vista
// pedida (el CSS de index.css reacciona a ese atributo). Ver viewport.ts.
aplicarVistaForzada()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
