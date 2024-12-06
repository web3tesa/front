import { ThemeProvider, createTheme } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import './Popup.css'
import Main from './main'

const queryClient = new QueryClient()

export const Popup = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    chrome.storage.sync.get(['count'], (result) => {
      setCount(result.count || 0)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ count })
    chrome.runtime.sendMessage({ type: 'COUNT', count })
  }, [count])

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#146CF0',
          },
        },
        typography: {
          allVariants: {
            textTransform: 'none',
          },
        },
      })}
    >
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default Popup
