/// <reference types="chrome" />
// @ts-ignore
/// <reference types="vite-plugin-svgr/client" />

import { useEffect, useState } from 'react'
import './App.css'
import '../../styles/index.scss'


import "./InjectedScript"
import DexScreenerCard from './components/DexScreenerCard'

export enum EPlatform {
  DEXSCREENER = "dexscreener",
  OTHER = "other"
}

function App() {

  useEffect(() => {
    const script = document.createElement('script')

    script.src = chrome.runtime.getURL("/injectpage.js")
    script.id = "tesa-id";
    (document.head || document.documentElement).appendChild(script);
    console.log("add injected script success")
  }, [])

  // if (!showNotification) {
  //   return null
  // }

  return <>
    <ContentCard />
  </>

}


const ContentCard = () => {
  const [platformName, setPlatformName] = useState<EPlatform>(EPlatform.OTHER)
  useEffect(() => {
    switch (location.hostname) {
      case "dexscreener.com":
        setPlatformName(EPlatform.DEXSCREENER)
        break
      default:
        setPlatformName(EPlatform.OTHER)
        break
    }
  }, [location])
  return (
    <>
      {
        platformName === EPlatform.DEXSCREENER && <DexScreenerCard />
      }
    </>
  )
}
export default App
