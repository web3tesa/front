import React, { Dispatch, HTMLAttributes, SetStateAction, createContext, useState } from 'react'

interface IConfigContext {
    buySlip: number,
    sellSlip: number,
    transactionPriorityMode: "fast" | "turbo",
    language: "en" | "zh-cn",
}


const initConfig: IConfigContext = {
    buySlip: 10,
    sellSlip: 10,
    transactionPriorityMode: "fast",
    language: "en"
}

export const ConfigContext = createContext<{
    config: IConfigContext,
    setConfig: Dispatch<SetStateAction<IConfigContext>>
}>({
    config: initConfig,
    setConfig: () => { }
})

export default function ConfigProvider(props: HTMLAttributes<HTMLDivElement>) {
    const [config, setConfig] = useState<IConfigContext>(initConfig)
    return (
        <ConfigContext.Provider value={{
            config,
            setConfig
        }}>
            {props.children}
        </ConfigContext.Provider>
    )
}
