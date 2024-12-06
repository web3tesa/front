import { useState, useEffect } from 'react'

import './SidePanel.css'
import SidePanelLayout from './components/layout'
import TokenList from './components/tokenList'
import SidePanelProvider from './components/provider'
import { useRouter, useUserValue } from './hooks'
import InitialsCard from './components/initials'
import { ERouter, WITHOUT_USER_ROUTER } from './provider/router'
import TradePage from './components/trade'
import SearchMemePage from './components/searchmeme'
import Setting from './components/setting'
import SignMessagePage from './components/signPage'
import { useInterval } from 'ahooks'
import { getUserJWTToken } from '../utils/message/jwtToken'
import { reqUserAddress } from '../service/user'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Refer from './components/refer'
import OrderHistory from './components/orderHistory'
import SmartMoney from './components/smartMoney'
import SmartKols from './components/smartKols'

export const SidePanel = () => {

  return (
    <SidePanelProvider>
      <SidePanelLayout>
        <SidePanelContent />
        <ToastContainer
          position="top-right"
          autoClose={800}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{
            width: "150px",
            top: "20px",
            left: "20px",
            fontSize: "12px",
            borderRadius: "12px"
          }}
        // transition="Bounce"
        />
      </SidePanelLayout>
    </SidePanelProvider>
  )
}

const SidePanelContent = () => {
  const { userValue, getUserValueLoading, setUserValue } = useUserValue()
  const [token, setToken] = useState('')
  const { router } = useRouter()
  const [loading, setLoading] = useState(true)

  useInterval(() => {
    if (token) return
    (async () => {
      const _token = await getUserJWTToken()
      if (_token) {
        setLoading(false)
        setToken(_token)
      } else {
        setLoading(false)
      }
    })()
  }, 1000)
  useEffect(() => {
    if (token) {
      (async () => {
        const _userValue = await reqUserAddress()
        setUserValue({
          ...userValue,
          address: _userValue.address
        })
      })()
    }
  }, [token])
  useEffect(() => {
    if (loading || getUserValueLoading) return
    if (!WITHOUT_USER_ROUTER.includes(router.path)) {
      if (!token) router.to(ERouter.SIGN_MESSAGE)
      else if (!userValue?.address) router.to(ERouter.INIT)
      else if (router.path == ERouter.INIT || router.path == ERouter.SIGN_MESSAGE) router.to(ERouter.DASHBOARD)
    }
  }, [token, loading, userValue?.address])
  switch (router.path) {
    case ERouter.INIT:
      return <InitialsCard />
    case ERouter.DASHBOARD:
      return <TokenList />
    case ERouter.TRADE:
      return <TradePage />
    case ERouter.SEARCH_MEME:
      return <SearchMemePage />
    case ERouter.SETTING:
      return <Setting />
    case ERouter.SIGN_MESSAGE:
      return <SignMessagePage />
    case ERouter.REFER:
      return <Refer />
    case ERouter.ORDER_HISTORY:
      return <OrderHistory />
    case ERouter.SMART_MONEY:
      return <SmartMoney />
    case ERouter.SMART_KOLS:
      return <SmartKols />
    default:
      return <div>404</div>
  }
}


export default SidePanel
