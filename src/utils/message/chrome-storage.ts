export const getChrmeLocalStorage = async (key: string) => {
    const data = await chrome.storage.local.get(key)
    return data[key]
}