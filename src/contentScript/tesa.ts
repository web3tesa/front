import { websiteMessenger } from '../website-messenging';
import { saveUserJWTToken } from '../utils/message/jwtToken';

const script = document.createElement('script');
script.type = 'module'
script.src = chrome.runtime.getURL('/src/contentScript/tesa.ts.js');
document.head.appendChild(script);

script.onload = () => {
  websiteMessenger.sendMessage("init", {
    data: 'init'
  });
}

websiteMessenger.onMessage("send_jwtToken", async (data: {
  data: {
    token: string
    address: string
  }
}) => {
  const issave = await saveUserJWTToken(data.data.token)
  chrome.runtime.sendMessage({ action: "openSidePanel" });
})
