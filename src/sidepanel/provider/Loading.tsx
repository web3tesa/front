import { HTMLAttributes, createContext, useEffect, useMemo, useState } from "react"
import { SOLPanelStorage } from "../schema/storage"

interface ILoadingContext {
    loading: boolean,
    setLoading: (isLoading: boolean) => void
}
export const LoadingContext = createContext<ILoadingContext>({} as ILoadingContext)

export const LoadingProvider = (props: HTMLAttributes<HTMLDivElement>) => {
    const [loadingArr, setLoadingArr] = useState<boolean[]>([])
    const loading = useMemo(() => {
        // get loading status
        let trueCount = 0
        let falseCount = 0
        loadingArr.forEach((item) => {
            if (item) {
                trueCount++
            } else {
                falseCount++
            }
        })
        return trueCount > falseCount

    }, [loadingArr])

    const setLoading = (isLoading: boolean) => {
        let _loadingArr = [...loadingArr]
        _loadingArr.push(isLoading)
        setLoadingArr(_loadingArr)
    }

    return <LoadingContext.Provider value={{
        loading,
        setLoading
    }}>
        {props.children}
    </LoadingContext.Provider>
}