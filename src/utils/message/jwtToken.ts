import { localExtStorage } from "@webext-core/storage"
import { SOLPanelStorage } from "../../sidepanel/schema/storage"
import config from "../../constant/config"

const { EXTENSION_MIDDLE_PAGE_URL } = config

/**
 * get user current jwttoken
 * @returns jwttoken string | null
 */
export const getUserJWTToken = async (): Promise<string | null> => {
    return await SOLPanelStorage.getItem("UserJWTToken")
}

/**
 * save user jwttoken
 * @param UserJWTToken jwttoken
 * @returns boolean
 */
export const saveUserJWTToken = async (UserJWTToken: string): Promise<boolean> => {
    try {
        await SOLPanelStorage.setItem("UserJWTToken", UserJWTToken)
        await chrome.storage.local.set({ UserJWTToken })
        return true
    } catch (error) {
        return false
    }
}

export const removeJWTToken = async (): Promise<boolean> => {
    try {
        await SOLPanelStorage.removeItem("UserJWTToken")
        return true
    } catch (error) {
        return false
    }
}
export const openUserSignMessagePage = () => {
    chrome.tabs.create({ url: EXTENSION_MIDDLE_PAGE_URL })
}