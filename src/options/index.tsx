import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { Options } from './Options'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { config } from './wagmiConfig'

const queryClient = new QueryClient()

// const config = getDefaultConfig({
//   appName: 'My RainbowKit App',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [mainnet],
// })

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
)
