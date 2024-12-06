const config = {
    APP_NAME: "Tesa",
    APP_DOM_ID: "tesa-extension-root",
    APP_ID: "Tesa",
    JWT_TOKEN_STORAGE_KEY: "TESA_TOKEN",
    WebSite_MESSAGE: {
        LOGIN_TOKEN_KEY: "setLoginToken",
        JWT_TOKEN_KEY: "setJWTToken"
    },
    CHROME_LOCAL_STORAGE_KEY: {
        JWT: "jwtToken"
    },
    EXTENSION_MIDDLE_PAGE_URL: import.meta.env.VITE_EXTENSION_MIDDEL_PAGE_URL,
    SOL_RPC_URL: import.meta.env.VITE_SOL_RPC_URL,
}

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export default config