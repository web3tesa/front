import { Stack } from '@mui/material'
import { useState } from 'react'
import { useInterval } from 'ahooks'

import { useUserLoginStatue } from '../hooks'
import AuthCard from './components/AuthCard'


export default function Main() {

  const { isLogin } = useUserLoginStatue()
  
  const [copySuccess, setCopySuccess] = useState(false)


  useInterval(
    () => {
      setCopySuccess(false)
    },
    copySuccess ? 3000 : undefined,
  )

  return (
    <>
      <main>
        <Stack
          sx={{
            paddingTop: '16px',
            background: '#061027',
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 999,
          }}
        >
          {
            !isLogin ?
              <AuthCard />
              : <>
              </>
          }
        </Stack>
      </main>
    </>
  )
}
