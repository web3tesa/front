import { useCallback, useContext, useEffect, useState } from "react"
import { UserValueContext } from "../provider/userValue"
import { ERouter, RouterContext } from "../provider/router"
import { ConfigContext } from "../provider/Config"
import { reqTokenInfo, reqTokenSimpleInfo } from "../../service/coin"
import { LoadingContext } from "../provider/Loading"
import { LanguageContext } from "../provider/language"
import { ELanguage } from "../../types/enum"
import EnLangJsonValue from "../../assets/locales/en.json"
import CnLangJsonValue from "../../assets/locales/zh-cn.json"
import { useInterval } from "ahooks"
import { getUserJWTToken } from "../../utils/message/jwtToken"
import { getTokenInfoForDexScreener, getTokenPriceChange } from "../../utils/sol/token"
import { BASE_TOKEN_INFO } from "../../constant/nsp"
import { getTokenInfoWithSolana } from "../../utils/sol/transaction"

export const useUserValue = () => {
    const { userValue, setUserValue, refreshUserBalance, userAddressList, getUserValueLoading, setUserAddressList } = useContext(UserValueContext)
    return { userValue, setUserValue, userAddressList, refreshUserBalance, setUserAddressList, getUserValueLoading }
}

export const useLoading = () => {
    // loading context from provider
    const { loading, setLoading } = useContext(LoadingContext)
    return { loading, setLoading }
}


export const useUserIsLogin = () => {
    const [jwtToken, setJwtToken] = useState("")
    useInterval(() => {
        (async () => {
            const _token = await getUserJWTToken()
            if (_token !== jwtToken) {
                setJwtToken(_token || "")
            }
        })()
    }, 1000)
    return { isLogin: jwtToken !== "", jwtToken }
}

export const useRouter = () => {
    const { routerValue, setRouterValue } = useContext(RouterContext)
    const router = useCallback(() => {
        return {
            to: (path: ERouter, value = {}) => {
                let _routerValue = [...routerValue]
                _routerValue.push({ path, value })
                setRouterValue(_routerValue)
            },
            back: (number = 1) => {
                let _routerValue = [...routerValue]
                for (let i = 0; i < number; i++) {
                    _routerValue.pop()
                }
                setRouterValue(_routerValue)
            },
            path: routerValue[routerValue.length - 1].path,
            value: routerValue[routerValue.length - 1].value,
            history: routerValue
        }
    }, [routerValue])
    return { router: router() }
}

export const useConfig = () => {
    const { config, setConfig } = useContext(ConfigContext)
    return { config, setConfig }
}

export const useRefreshTokenList = () => {
    const [isRefreshTokenList, setIsRefreshTokenList] = useState(false)
    return { isRefreshTokenList, setIsRefreshTokenList }
}


export const useSolPrice = () => {
    const [solPrice, setSolPrice] = useState(0)
    const [lastRequestTime, setLastRequestTime] = useState(0)

    const getSolPrice = async () => {
        // request price every 1 minute
        const currentTime = new Date().getTime()
        if (solPrice !== 0 && ((currentTime - lastRequestTime) < 60000)) {
            return solPrice
        }
        const { price } = await reqTokenInfo({
            coin: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" //usdc
        })
        const _solPrice = Number((1 / Number(price)).toFixed(2))
        setSolPrice(_solPrice)
        setLastRequestTime(currentTime)
        return _solPrice
    }
    return { getSolPrice }
}

export const useLanguage = () => {
    const { language: lang } = useContext(LanguageContext)
    const dictionaries = {
        [ELanguage.EN]: EnLangJsonValue,
        [ELanguage.ZH]: CnLangJsonValue,
    };
    const [language, setLanguage] = useState<any>(EnLangJsonValue);
    useEffect(() => {
        (async () => {
            const result = await dictionaries[lang];
            setLanguage(result);
        })();
    }, [lang]);
    return language;
};

export const useTokenInfo = () => {
    const { getSolPrice } = useSolPrice()
    const getTokenInfo = async (tokenAddress: string, isNeedPriceChange = false): Promise<ITokenListItem> => {
        try {
            console.log("tokenAddress", tokenAddress);
            
            const tokenInfo = await Promise.any([
                (
                    async (_tokenAddress) => {
                        return new Promise<ITokenListItem>(async (resolve, reject) => {
                            try {
                                const tokenInfo = await getTokenInfoForDexScreener(_tokenAddress)
                                resolve(tokenInfo)
                            } catch (error) {
                                console.error("error 1", error);
                                reject(error)
                            }
                        })
                    }
                )(tokenAddress),
                (async (_tokenAddress) => (new Promise<ITokenListItem>(async (resolve, reject) => {
                    try {
                        const data = await reqTokenInfo({ coin: _tokenAddress })
                        resolve({
                            ...BASE_TOKEN_INFO,
                            address: tokenAddress,
                            name: data?.name,
                            logo: data?.image,
                            pool: data.pool,
                            pair:data.pool,
                            decimals: data.decimal,
                            totalSupply: data.totalSupply,
                            price: data?.price,
                            holder: 0,
                        })
                    } catch (error) {
                        console.error("error 2", error);

                        reject(error)
                    }
                })))(tokenAddress)
            ])
            // const { decimal, totalSupply } = await reqTokenSimpleInfo({
            //     coin: tokenAddress
            // })
            const {decimals,totalSupply} = await getTokenInfoWithSolana(tokenAddress)
            console.log("decimals",decimals,totalSupply);
            
            const solPrice = await getSolPrice()
            tokenInfo.decimals = decimals
            tokenInfo.totalSupply = String(totalSupply)
            tokenInfo.tokenPrice = tokenInfo.tokenPrice ? tokenInfo.tokenPrice : String(Number(tokenInfo.price) * solPrice)
            tokenInfo.mcap = tokenInfo.mcap ? tokenInfo.mcap : String(Number(tokenInfo.price) * solPrice * Number(totalSupply) / Math.pow(10, decimals))
            if (isNeedPriceChange && !tokenInfo.five_min) {
                const tokenPriceChange = await getTokenPriceChange(tokenAddress)
                tokenInfo.five_min = tokenPriceChange.m5
                tokenInfo.one_hour = tokenPriceChange.h1
                tokenInfo.six_hour = tokenPriceChange.h6
            }
            return tokenInfo
        } catch (error) {
            console.error("we got error", error);

            return BASE_TOKEN_INFO
        }
    }
    return {
        getTokenInfo
    }
}
