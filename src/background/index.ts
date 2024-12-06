import { localExtStorage } from '@webext-core/storage'
import { websiteMessenger } from '../website-messenging'
import { onMessage, sendMessage } from '../messaging'
import axios from 'axios'
import dayjs from 'dayjs'
const JTW_TOKEN_STORAGE_KEY = 'TESA_JWT_TOKEN'
import config from '../constant/config'
import { reqUserJWTToken } from '../service/user'
import { saveUserJWTToken } from '../utils/message/jwtToken'
import * as serviceReq from '../service'


const { EXTENSION_MIDDLE_PAGE_URL } = config

onMessage('getStringLength', (message) => {
  return message.data.length
})

onMessage('setJWTToken', async (message) => {
  await localExtStorage.setItem(JTW_TOKEN_STORAGE_KEY, message.data)
  return !!message
})

async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action === 'openSidePanel') {
    try {

      console.log("got message, open sidepanel");
      chrome.sidePanel.setOptions({ path: "sidepanel.html" })
      chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } catch (error) {

    }
  }



  chrome.runtime.sendMessage({ from: 'background', to: 'sidebar', data: message.data });
  // if (message.from === 'content' && message.to === 'sidebar') {
  // }
})


chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "send-request") {
    port.onMessage.addListener(async (message) => {
      try {

        const res = await (serviceReq.default as any)[message.method as any](message.params)
        port.postMessage({
          status: "success",
          data: res
        });
      } catch (error) {
        port.postMessage({
          status: "error",
          data: error
        });
      }
    })
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: EXTENSION_MIDDLE_PAGE_URL })
  chrome.sidePanel.setOptions({ path: "sidepanel.html" })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
})


function isWithinFiveMinutes(time: string) {
  const currentTime = dayjs();
  const givenTime = dayjs(time);
  const differenceInSeconds = currentTime.diff(givenTime, 'second');
  return Math.abs(differenceInSeconds) <= 300;
}

// setInterval(async () => {
//   const token = await localExtStorage.getItem(JTW_TOKEN_STORAGE_KEY)
//   const res: {
//     Platform: string;
//     Amount: number
//     CreateTime: string
//   }[] = (
//     await axios.get(`${BASE_URL}/v1/rebate/getrebatelog?lang=en`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//   )?.data?.data
//   const recent = res?.find(i => isWithinFiveMinutes(i.CreateTime))
//   if (recent) {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
//     sendMessage('newCashback', {
//       Platform: recent.Platform,
//       Amount: recent.Amount,
//       CreateTime: recent.CreateTime
//     }, tab.id)
//   }

// }, 5000)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log('🚀 ~ file: index.ts:21 ~ changeInfo:', changeInfo)
  // console.log('🚀 ~ file: index.ts:19 ~ tabId,changeInfo,tab:', tabId, changeInfo, tab)
  if (changeInfo.status === 'complete') {
    getCurrentTab()
  }
})
