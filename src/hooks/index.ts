import { useEffect, useState } from "react"
import { GetMessageInjectToContent } from "../utils/message/inject-content"
import { useInterval } from "ahooks"
import { getChrmeLocalStorage } from "../utils/message/chrome-storage"

import config from "../constant/config"
import { SOLPanelStorage } from "../sidepanel/schema/storage"
import { ELanguage } from "../types/enum"

import EnLangJsonValue from "../assets/locales/en.json"
import CnLangJsonValue from "../assets/locales/zh-cn.json"

const { CHROME_LOCAL_STORAGE_KEY } = config

export const useDomWithXPath = <T extends Node>(xpath: string): T | null | undefined => {
    const [nodes, setNodes] = useState<T | null>()
    let lastNode: T | null = null
    useEffect(() => {
        const internal = setInterval(() => {
            const node: any = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue
            lastNode = node
            setNodes(node)
        }, 1000)
        return () => {
            clearInterval(internal)
        }
    }, [xpath])
    return nodes
}

export const getDomWithXPath = <T extends Node>(xpath: string): T => {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue as T;
}

export const useUserLoginStatue = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [userToken, setUserToken] = useState<string>("")
    useInterval(() => {
        getJWTToken()
    }, 1000)
    const getJWTToken = async () => {
        const jwt = await getChrmeLocalStorage(CHROME_LOCAL_STORAGE_KEY.JWT)
        if (jwt != userToken) {
            setIsLogin(!!jwt)
            setUserToken(jwt)
        }
    }
    return { isLogin, userToken }
}


export const useUserAddress = () => {
    const [address, setAddress] = useState<string>("")
    useEffect(() => {
        GetMessageInjectToContent((message: any) => {
            const _message = JSON.parse(message)
            if (_message.type == "address") {
                setAddress(_message.message[0])
            }
        })
    }, [])
    return { address }
}

export const useLanguageForSideBar = () => {
    const [lang, setLang] = useState(ELanguage.EN)
    const dictionaries = {
        [ELanguage.EN]: EnLangJsonValue,
        [ELanguage.ZH]: CnLangJsonValue,
    };
    const [language, setLanguage] = useState<any>(EnLangJsonValue);
    useInterval(() => {
        chrome.storage.local.get('language', (result) => {
            setLang(result.language || ELanguage.EN)
        })
    }, 1000)
    useEffect(() => {
        (async () => {
            const result = await dictionaries[lang];
            setLanguage(result);
        })();
    }, [lang]);
    return language;
};

export const useBackendReq = () => {
    const sendReq = async <T>({
        method = "",
        params = {} as any
    }): Promise<T> => {
        return new Promise((resolve, reject) => {
            const sendPort = chrome.runtime.connect({ name: "send-request" });
            sendPort.postMessage({ method, params });
            sendPort.onMessage.addListener((message) => {
                if (message.status == "success") {
                    console.log("trade success", message.data);

                    resolve(message.data as T)
                    sendPort.disconnect()
                } else {
                    console.log("trade hook errorrrr", message);
                    reject("trade error")
                    sendPort.disconnect()
                }
            })
        })
    }
    return { sendReq }
}