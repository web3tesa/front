import { Dispatch, HTMLAttributes, SetStateAction, createContext, useState } from "react";

export enum ERouter {
    TRADE = "trade",
    DASHBOARD = "dashboard",
    INIT = "init",
    SEARCH_MEME = "search_meme",
    SETTING = "setting",
    SIGN_MESSAGE = "sign_mesage",
    REFER = "refer",
    ORDER_HISTORY = "order_history",
    SMART_KOLS = "smart_kols",
    SMART_MONEY = "smart_money",
}

export const WITHOUT_USER_ROUTER = [ERouter.INIT, ERouter.SIGN_MESSAGE, ERouter.SMART_MONEY, ERouter.SMART_KOLS]

interface IRouterVale {
    path: ERouter,
    value: any
}

export const RouterContext = createContext<{
    routerValue: IRouterVale[],
    setRouterValue: Dispatch<SetStateAction<IRouterVale[]>>
}>({
    routerValue: [{ path: ERouter.DASHBOARD, value: {} }],
    setRouterValue: () => { }
})

export const RouterProvider = (props: HTMLAttributes<HTMLDivElement>) => {
    const [routerValue, setRouterValue] = useState<
        IRouterVale[]
    >([{ path: ERouter.DASHBOARD, value: {} }])
    return <RouterContext.Provider value={{
        routerValue: routerValue,
        setRouterValue: setRouterValue
    }}>{props.children}</RouterContext.Provider>
}