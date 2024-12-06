import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { Popup } from './Popup'
import './index.css'

const queryClient = new QueryClient()

// const config = {
//   ...getDefaultConfig({
//     appName: 'My RainbowKit App',
//     projectId: 'YOUR_PROJECT_ID',
//     chains: [mainnet],
//   }),
//   connectors: [injected()],
// }

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <RainbowKitProvider> */}
      <Popup />
      {/* </RainbowKitProvider> */}
    </QueryClientProvider>
  </React.StrictMode>,
)
