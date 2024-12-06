import { Button, Stack, ThemeProvider, createTheme } from '@mui/material'
import { useInterval } from 'ahooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getTokenAddressFromUrl, getTokenInfoWithSolana } from '../utils/dom'
import FailIcon from "../assets/Fail"
import { getDomWithXPath, useBackendReq, useLanguageForSideBar } from '../../../hooks'
import { formatNumberToUnits, formatSolAddress, formatToTwoDecimals } from '../../../utils'
import { SOLPanelStorage } from '../../../sidepanel/schema/storage'
import { solToLamports, tokenForDecimalsToLamports } from '../../../utils/sol/token'
import LoadingIcon from '../assets/loading'
import Header from '../assets/Header'
import config from '../../../constant/config'
import ProfitSpan from '../../../components/ProfitSpan'
import { MessageContentToSidePannelToRefreshTokenList } from '../../../utils/message/inject-content'
import { ETradeStatus } from '../../../types/enum'
import TradeProgress from '../../../components/tradeProgress'
import Tesa from '../assets/tesa'
import Draggable from 'react-draggable';
import { BASE_TOKEN_INFO } from '../../../constant/nsp'


const EXTENSION_MIDDLE_PAGE_URL = config.EXTENSION_MIDDLE_PAGE_URL

enum ETradeCardRoute {
    INIT,
    PENDING,
    SUCCESS,
    FAILED,
    FAILED_SIGN
}


const tokenAddressDomList = [
    `//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[3]/div/div[1]/div[7]/span`,
    `//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[3]/div/div[1]/div[9]/span`,
    `//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[4]/div/div[1]/div[9]/span`,
    `//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[4]/div/div[1]/div[11]/span`,
    `//*[@id="root"]/div/main/div/div[3]/div/div[1]/div/div[1]/div[4]/div/div[1]/div[9]/span`,
    `//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[3]/div/div[1]/div[5]/span`,
    `//*[@id="root"]/div/main/div/div[3]/div/div[1]/div/div[1]/div[3]/div/div[1]/div[9]/span`
]


const tokenTickerDomList = [
    `//*[@id="root"]/div/main/div/div[3]/div/div[1]/div/div[1]/div[1]/div/div[1]/h2/span[1]/span`,
    `//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[1]/div[1]/div[1]/h2/span[1]/span`,
    `//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[1]/div/div[1]/h2/span[1]/span`
]

const tokenLogoDomList = [
    `//*[@id="root"]/div/main/div/div[3]/div/div[1]/div/header/img`,
    `//*[@id="root"]/div/main/div/div/div[1]/div/header/img`,
    `//*[@id="root"]/div/main/div/div[3]/div/div[1]/div/header/img`
]

const theme = createTheme({
    palette: {
        primary: {
            main: '#f2a43f',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    color: 'white',
                    backgroundColor: '#FFA015',
                    boxShadow: "none",
                },
                root: {
                    transition: 'transform 200ms ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        backgroundColor: '#FFA015',
                    },
                    '&:active': {
                        transform: 'scale(0.98)',
                    },
                },
            }
        }
    }
})

export default function DexScreenerCard() {
    const [tokenInfo, setTokenInfo] = useState({
        pair: "",
        address: "",
        logo: "",
        ticker: ""
    })
    const [userValue, settUserValue] = useState<IUserValue>({
        address: "",
        balance: "0",
        value: "0",
        tokenValue: []
    })

    // 0 init 1 pending 2success 3 failed
    const [tradeProcess, setTradeProcess] = useState({
        coinInfo: ETradeStatus.INIT,
        onChain: ETradeStatus.INIT,
    })

    const [loading, setLoading] = useState({
        profit: true
    })

    const { sendReq } = useBackendReq()
    const t = useLanguageForSideBar()

    const [isOpen, setIsOpen] = useState(true)

    const [isBuy, setIsBuy] = useState(true)
    // const [tradeTokenValue,setTradeTokenValue] = useState<ITokenInfoRes>({

    // })
    const [tradeTokenValue, setTradeTokenValue] = useState({
        txHash: "",
        address: "",
        pool: "",
        profitPersent: 0,
        profitSolValue: 0,
        valueSol: 0,
        valueUSD: 0,
        Mcap: "0",
        tokenPrice: 0,
        initialSol: 0,
        initialUSD: 0,
        balance: "0",
        decimals: 0,
        type: ""
    })

    const [tradeStatus, setTradeStatus] = useState<ETradeCardRoute>(ETradeCardRoute.INIT)

    const [buySolAmount, setBuySolAmount] = useState("")

    const dragRef = useRef(null)


    const userInputValueIsLawful = useMemo(() => {
        return !(Number(buySolAmount) > Number(userValue.balance))
    }, [buySolAmount, userValue.balance])

    const [sellTokenValue, setSellTokenValue] = useState("")
    useInterval(() => {
        // without solana then return
        if (!location.href.includes("solana")) return

        let _tokenInfo = {
            pair: tokenInfo.pair,
            address: tokenInfo.address,
            logo: tokenInfo.logo,
            ticker: tokenInfo.ticker
        }
        let tokenPair = getTokenAddressFromUrl(location.href)
        // let tokenTicker = getDomWithXPath<HTMLSpanElement>(`//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[1]/div[1]/div[1]/h2/span[1]/span`)
        // let _tokenTicker = document.evaluate(`//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[1]/div[1]/div[1]/h2/span[1]/span`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue

        let tokenTicker = ""
        for (let index = 0; index < tokenTickerDomList.length; index++) {
            const item = tokenTickerDomList[index];
            if (getDomWithXPath<HTMLSpanElement>(item)?.innerText) {
                tokenTicker = getDomWithXPath<HTMLSpanElement>(item)?.innerText
                break
            }
        }

        let tokenAddress = ""
        for (let index = 0; index < tokenAddressDomList.length; index++) {
            const item = tokenAddressDomList[index];
            if (getDomWithXPath<HTMLSpanElement>(item)?.innerText == tokenTicker) {
                tokenAddress = getDomWithXPath<HTMLSpanElement>(item)?.title || ""
                break
            }
        }
        let tokenImage = ""
        for (let index = 0; index < tokenLogoDomList.length; index++) {
            const item = tokenLogoDomList[index];
            if (getDomWithXPath<HTMLImageElement>(item)) {
                tokenImage = getDomWithXPath<HTMLImageElement>(item)?.src
                break
            }
        }

        _tokenInfo = {
            pair: tokenPair,
            address: tokenAddress,
            logo: tokenImage,
            ticker: tokenTicker
        }
        for (const key in _tokenInfo) {
            if ((_tokenInfo as any)[key] !== (tokenInfo as any)[key]) {
                setTokenInfo(_tokenInfo)
                break
            }
        }
    }, 1000)


    useEffect(() => {
        setIsOpen(true)
        setTradeStatus(ETradeCardRoute.INIT)
    }, [location.href])

    useEffect(() => {
        getUserValue()
    }, [])

    useInterval(() => {
        getUserValue()
    }, 3000)


    useInterval(() => {
        if (tradeProcess.onChain == ETradeStatus.SUCCESS && loading.profit) {
            getTransInfo()
        }
    }, 1000)

    const getSolPrice = async () => {
        const solPrice = await sendReq<ICoinInfoRes>({
            method: "reqTokenInfo",
            params: {
                coin: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            }
        })
        return Number((1 / Number(solPrice.price)).toFixed(2))
    }

    const getTransInfo = async () => {
        if (!loading.profit) return
        try {
            const _tradeValue = { ...tradeTokenValue }
            const tokenProfit = await sendReq<ITokenCoinProfitRes>({
                method: "reqTokenProfit",
                params: {
                    coin: tokenInfo.address
                }
            })
            const solPrice = await getSolPrice()

            if (isBuy) {
                const tokenPrice = Number(tokenProfit.price) * solPrice
                _tradeValue.valueSol = Number(tokenProfit.value)
                _tradeValue.valueUSD = Number(tokenProfit.value) * solPrice
                _tradeValue.profitPersent = tokenProfit.profit
                _tradeValue.profitSolValue = tokenProfit.profit * Number(buySolAmount)
                _tradeValue.Mcap = String(tokenPrice * Number(tokenProfit.total_supply))
                _tradeValue.initialSol = Number(tokenProfit.initial)
                _tradeValue.initialUSD = Number(tokenProfit.initial) * solPrice
                _tradeValue.balance = tokenProfit.balance
                _tradeValue.tokenPrice = tokenPrice
            }
            setTradeTokenValue(_tradeValue)
            setLoading({
                ...loading,
                profit: false
            })
            MessageContentToSidePannelToRefreshTokenList("")
            setTradeStatus(ETradeCardRoute.SUCCESS)
        } catch (error) {

        }
    }

    const getUserValue = async () => {
        const _userValue = await SOLPanelStorage.getItem("userValue")

        if (_userValue) {
            settUserValue(_userValue)
        }
    }

    const handleChangeBuySolAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuySolAmount(event.target.value.trim())
    }

    const getTokenInfoForDexScreener = async (tokenAddress: string): Promise<ITokenListItem> => {
        const result = BASE_TOKEN_INFO
        console.log("start get token info", tokenAddress);

        const { pairs } = await sendReq<IDexScreenerTokenInfoRes>({
            method: "reqcoinDexScreenerCoin",
            params: {
                coin: tokenAddress,
            }
        })
        let tokenInfo = {} as IResTokenInfoForDexscreenerListItem
        pairs.forEach((item, index) => {
            if (item.dexId == "raydium" && item.chainId == "solana" && !item?.label?.includes("cpmm")) {
                if (!tokenInfo?.liquidity?.base || item.liquidity.base > tokenInfo?.liquidity?.base) {
                    tokenInfo = { ...item }
                }
            }
        })

        result.name = tokenInfo.baseToken.symbol
        result.logo = tokenInfo.info.imageUrl
        result.type = ""
        result.address = tokenInfo.baseToken.address
        result.pair = tokenInfo.pairAddress
        result.pool = tokenInfo.pairAddress
        result.price = tokenInfo.priceNative
        result.tokenPrice = tokenInfo.priceUsd
        result.five_min = tokenInfo.priceChange.m5
        result.one_hour = tokenInfo.priceChange.h1
        result.six_hour = tokenInfo.priceChange.h6

        return result
    }

    const getTokenInfo = async (tokenAddress: string, isNeedPriceChange = false): Promise<ITokenListItem> => {
        try {
            const tokenInfo = await Promise.any([
                (
                    async () => {
                        return new Promise<ITokenListItem>(async (resolve, reject) => {
                            try {

                                const tokenInfo = await getTokenInfoForDexScreener(tokenAddress)
                                resolve(tokenInfo)
                            } catch (error) {
                                console.error("error 1", error);
                                reject(error)
                            }
                        })
                    }
                )(),
                (async () => (new Promise<ITokenListItem>(async (resolve, reject) => {
                    try {
                        const data = await sendReq<ICoinInfoRes>({
                            method: "reqTokenInfo",
                            params: {
                                coin: tokenAddress
                            }
                        })
                        resolve({
                            ...BASE_TOKEN_INFO,
                            address: tokenAddress,
                            name: data.name,
                            logo: data.image,
                            pool: data.pool,
                            pair: data.pool,
                            decimals: data.decimal,
                            totalSupply: data.totalSupply,
                            price: data.price,
                            holder: 0,
                        })
                    } catch (error) {
                        console.error("error 2", error);

                        reject(error)
                    }
                })))()
            ])
            // const { decimal, totalSupply } = await reqTokenSimpleInfo({
            //     coin: tokenAddress
            // })
            const { decimals, totalSupply } = await getTokenInfoWithSolana(tokenAddress)

            const solPrice = await getSolPrice()
            tokenInfo.decimals = decimals
            tokenInfo.totalSupply = String(totalSupply)
            tokenInfo.tokenPrice = tokenInfo.tokenPrice ? tokenInfo.tokenPrice : String(Number(tokenInfo.price) * solPrice)
            tokenInfo.mcap = tokenInfo.mcap ? tokenInfo.mcap : String(Number(tokenInfo.price) * solPrice * Number(totalSupply) / Math.pow(10, decimals))
            if (isNeedPriceChange && !tokenInfo.five_min) {
                const tokenPriceChange = await getTokenInfoForDexScreener(tokenAddress)
                tokenInfo.five_min = tokenPriceChange.five_min
                tokenInfo.one_hour = tokenPriceChange.one_hour
                tokenInfo.six_hour = tokenPriceChange.six_hour
            }
            return tokenInfo
        } catch (error) {
            console.error("we got error", error);

            return BASE_TOKEN_INFO
        }
    }


    const getTradeValue = async (): Promise<ITokenSimpleInfoRes> => {
        return await Promise.any([
            (async () => {
                return await sendReq<ITokenSimpleInfoRes>({
                    method: "reqTokenSimpleInfo",
                    params: {
                        coin: tokenInfo.address
                    }
                })
            })(),
            (async (): Promise<ITokenSimpleInfoRes> => {
                return new Promise<ITokenSimpleInfoRes>(async (resolve, reject) => {

                    const result = {
                        decimal: 0,
                        totalSupply: "",
                        pool: ""
                    } as ITokenSimpleInfoRes
                    try {

                        const tokenData = await getTokenInfo(tokenInfo.address)
                        result.decimal = tokenData?.decimals || 0
                        result.totalSupply = tokenData?.totalSupply || ""
                        result.pool = tokenData.pool || ""
                        resolve(result)
                    } catch (error) {
                        reject(error)
                    }
                })
            })()
        ])
    }

    const handleBuyToken = async (tradeValue: string) => {
        setTradeProcess({
            coinInfo: ETradeStatus.PENDING,
            onChain: ETradeStatus.INIT,
        })
        setLoading({
            ...loading,
            profit: true
        })
        if (tradeValue == "" || Number(tradeValue) <= 0) return
        setTradeStatus(ETradeCardRoute.PENDING)
        setIsBuy(true)
        setBuySolAmount(tradeValue)
        const tokenValue = await getTradeValue()

        setTradeProcess({
            coinInfo: ETradeStatus.SUCCESS,
            onChain: ETradeStatus.PENDING,
        })
        try {

            const { txSignature } = await sendReq<ITokenBuyRes>({
                method: "reqTokenBuy",
                params: {
                    coin: tokenInfo.address,
                    pool: tokenValue.pool || "",
                    amount: solToLamports(Number(tradeValue)),
                    decimal: tokenValue.decimal || 0
                }
            })
            setTradeTokenValue({
                ...tradeTokenValue,
                address: tokenInfo.address,
                pool: tokenValue.pool || "",
                txHash: txSignature,
                type: "1"
            })
            setTradeProcess({
                coinInfo: ETradeStatus.SUCCESS,
                onChain: ETradeStatus.SUCCESS,
            })
            if (!txSignature) throw Error("txSignature is null")
        } catch (error) {
            setTradeProcess({
                coinInfo: ETradeStatus.SUCCESS,
                onChain: ETradeStatus.FAILED,
            })
            setTradeStatus(ETradeCardRoute.FAILED)
        }

    }
    const handleSellToken = async (value: string) => {
        setLoading({
            ...loading,
            profit: true
        })
        setTradeProcess({
            coinInfo: ETradeStatus.PENDING,
            onChain: ETradeStatus.INIT,
        })
        setIsBuy(false)
        setTradeStatus(ETradeCardRoute.PENDING)
        try {
            const tokenValue = await getTradeValue()
            // const tokenValue = await reqTokenInfo({ coin: tokenInfo.address })
            setTradeProcess({
                coinInfo: ETradeStatus.SUCCESS,
                onChain: ETradeStatus.PENDING,
            })
            const { txSignature } = await sendReq<ITokenSellRes>({
                method: "reqTokenSell",
                params: {
                    coin: tokenInfo.address,
                    pool: tokenValue.pool || "",
                    amount: tokenForDecimalsToLamports(Number(value), tokenValue.decimal || 0),
                    decimal: tokenValue.decimal || 0
                }
            })
            setTradeProcess({
                coinInfo: ETradeStatus.SUCCESS,
                onChain: ETradeStatus.SUCCESS,
            })
        } catch (error) {
            setTradeProcess({
                coinInfo: ETradeStatus.SUCCESS,
                onChain: ETradeStatus.FAILED,
            })
            setTradeStatus(ETradeCardRoute.FAILED)
        }
    }

    const handleSignMessage = async () => {
        window.open(EXTENSION_MIDDLE_PAGE_URL)
    }

    if (tokenInfo.address && isOpen) {
        return (
            <ThemeProvider theme={theme}>
                <Draggable handle='header'>
                    <Stack
                        className="recommend-tesa-notifi"
                        sx={{
                            width: '360px',
                            background: 'white',
                            borderRadius: '24px',
                            top: '60vh',
                            right: '24px',

                            color: 'black',
                        }}
                    >
                        <header className='mx_w-full mx_flex mx_justify-between mx_relative mx_-mb-6 mx_cursor-move'>
                            <Header />
                            <Tesa className='mx_absolute mx_left-3 mx_origin-top-left mx_top-4' />
                            <div className='mx_w-8 mx_h-8 mx_absolute mx_top-5  mx_right-3 mx_cursor-pointer' onClick={() => setIsOpen(false)} />
                        </header>
                        <div className='mx_px-4 mx_pb-4'>
                            {tradeStatus == ETradeCardRoute.INIT && <article className='mx_text-black'>
                                <div >

                                    <div className=' mx_my-auto mx_font-bold mx_text-lg mx_flex mx_justify-start mx_gap-2'>
                                        <div>
                                            <div className='mx_flex mx_justify-start'>
                                                <p className='mx_flex mx_justify-start mx_font-semibold mx_text-base'>
                                                    {t?.header?.solWallet}
                                                </p>
                                                <p className=' mx_my-auto mx_text-sm mx_flex mx_ml-3 mx_text-[#8C8C8C] mx_justify-start mx_gap-2'>
                                                    {
                                                        userValue.address && formatSolAddress(userValue.address)
                                                    }
                                                </p>
                                            </div>
                                            <div className='mx_text-left mx_flex mx_font-semibold mx_text-sm'>
                                                <p>{t?.header?.balance} : <span className='mx_font-bold'>{formatNumberToUnits(formatToTwoDecimals(Number(userValue.balance))) || "-"}</span> SOL</p>
                                                <p className='mx_ml-3'>{t?.header?.value} : <span className='mx_font-bold'>{formatNumberToUnits(formatToTwoDecimals(Number(userValue.value) + Number(userValue.balance))) || "-"} SOL</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mx_p-2 mx_grid mx_grid-cols-5 mx_border mx_border-[#FFD494] mx_rounded-xl mx_bg-[#FFF3E2] mx_gap-2 mx_mt-4'>
                                    <div className='mx_col-span-1'>
                                        <img src={tokenInfo.logo} className='mx_object-cover mx_rounded-full mx_overflow-hidden mx_mx-auto mx_aspect-square' />
                                        <p className=' mx_font-semibold mx_text-center mx_text-base mx_mx-auto'>{tokenInfo.ticker}</p>
                                    </div>
                                    <div className='grid mx_col-span-4'>
                                        <div className='mx_flex mx_justify-between mx_p-1.5 mx_border mx_border-[#e4e4e4] mx_bg-white mx_rounded-xl'>
                                            <input placeholder='10 SOL' type="text" onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleBuyToken(buySolAmount.trim())
                                                }
                                            }} onChange={handleChangeBuySolAmount} className='focus:mx_outline-none active:mx_outline-none mx_bg-transparent focus:mx_ring-0 mx_flex-1 mx_text-black mx_font-bold placeholder:mx_text-[#A3A3A3]' />
                                            <Button onClick={() => handleBuyToken(buySolAmount)} disabled={!userInputValueIsLawful || !(Number(buySolAmount) > 0)} variant='contained'>{t?.dashboard?.buy}</Button>
                                        </div>
                                        <div className='mx_grid mx_grid-cols-2 mx_mt-2 mx_grid-rows-2 mx_gap-2'>
                                            {
                                                ["0.1", "0.5", "1", "5"].map((item, index) => {
                                                    return <Button key={item} disabled={Number(item) > Number(userValue.balance)} onClick={() => handleBuyToken(item)} className='!mx_rounded-xl' variant='contained'>{item} SOL</Button>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </article>}
                            {
                                (tradeProcess.onChain == ETradeStatus.PENDING || tradeProcess.coinInfo == ETradeStatus.PENDING) && <div className='mx_h-[200px] mx_flex mx_justify-center mx_flex-col'>
                                    <LoadingIcon />
                                    <p className='mx_text-center mx_mt-4 mx_text-base mx_font-semibold mx_text-primary mx_italic'>{isBuy ? t?.trade?.buying : t?.trade?.selling}</p>
                                    <div className='mx_w-full'>
                                        <TradeProgress tradeStatus={tradeProcess.coinInfo} text={{
                                            init: t?.trade?.tokenInfo + " " + t?.trade?.ongoing,
                                            loading: t?.trade?.tokenInfo + " " + t?.trade?.ongoing,
                                            success: t?.trade?.tokenInfo + " " + t?.trade?.retrieved,
                                            failed: t?.trade?.tokenInfo + " " + t?.trade?.failed
                                        }} />
                                        <TradeProgress tradeStatus={tradeProcess.onChain}
                                            text={{
                                                init: t?.trade?.transaction + " " + t?.trade?.ongoing + "...",
                                                loading: t?.trade?.transaction + " " + t?.trade?.ongoing + "...",
                                                success: t?.trade?.transaction + " " + t?.trade?.retrieved,
                                                failed: t?.trade?.transaction + " " + t?.trade?.failed
                                            }}
                                        />
                                    </div>
                                </div>
                            }
                            {
                                tradeStatus == ETradeCardRoute.FAILED && <div className='mx_h-[200px] mx_flex mx_justify-center mx_gap-4 mx_flex-col'>
                                    <FailIcon />
                                    <p className='mx_text-black mx_italic mx_mt-3 mx_text-center'>{t?.trade?.failed}</p>
                                    <Button className='!mx_mx-auto !mx_rounded-xl !mx_font-semibold !mx_my-2 mx_mt-4 !mx_w-40' size='small' onClick={() => handleBuyToken(buySolAmount)} variant='contained'>
                                        {t?.trade?.tryAgain}
                                    </Button>
                                </div>
                            }
                            {
                                (tradeProcess.onChain == ETradeStatus.SUCCESS && tradeStatus !== ETradeCardRoute.INIT) && <div className='mx_h-[250px] mx_flex mx_justify-start mx_flex-col'>
                                    <div className=' mx_flex mx_justify-center'>
                                        <div className='mx_w-12 mx_h-12 mx_scale-[0.25]'>
                                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="40" cy="40" r="40" fill="url(#paint0_radial_1215_1063)" />
                                                <path d="M50.1823 29.2612L35.6914 43.1494L28.3199 35.7083C27.7756 35.1582 26.8768 35.146 26.3169 35.6779L22.4321 39.3529C21.8692 39.8848 21.8536 40.7633 22.401 41.3135L34.5499 53.5785C35.0973 54.1318 35.9993 54.1409 36.5622 53.6028L58.5742 32.1459C59.1341 31.6109 59.1434 30.7324 58.5929 30.1853L54.8076 26.4161C54.2602 25.869 53.3613 25.8598 52.8015 26.3979L50.1823 29.2612Z" fill="white" />
                                                <defs>
                                                    <radialGradient id="paint0_radial_1215_1063" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40) rotate(90) scale(80)">
                                                        <stop stop-color="#30E214" />
                                                        <stop offset="1" stop-color="#7EED6C" />
                                                    </radialGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <p onClick={
                                            () => chrome.tabs.create({ url: `https://solscan.io/tx/${tradeTokenValue.txHash}` })
                                        } className=' mx_my-auto mx_cursor-pointer mx_text-[#0075FF] mx_w-fit mx_text-left mx_italic mx_underline mx_underline-offset-4 mx_font-bold mx_text-sm'>{t?.trade?.swapSuccessful}</p>
                                    </div>
                                    {
                                        loading.profit ?
                                            <div className='  hover:mx_bg-black/5 mx_rounded-xl'>
                                                <div className='mx_flex mx_justify-start'>
                                                    <div className='mx_flex mx_flex-col mx_text-center mx_justify-between'>
                                                        <div className='mx_relative mx_m-auto'>
                                                            <div className=' mx_skeleton mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full' />
                                                        </div>
                                                        <p className='mx_skeleton mx_w-full mx_h-2 mx_mt-2' />
                                                    </div>
                                                    <div className='mx_text-left mx_ml-6 mx_flex-1 mx_justify-between mx_h-full'>
                                                        <p className='mx_skeleton mx_w-3/4 mx_h-2 mx_my-2' />
                                                        <p className='mx_skeleton mx_w-3/4 mx_h-2 mx_my-2' />
                                                        <p className='mx_skeleton mx_w-3/4 mx_h-2 mx_my-2' />
                                                        <p className='mx_skeleton mx_w-3/4 mx_h-2 mx_my-2' />
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className='mx_flex mx_justify-start mx_gap-4 '>
                                                <div className=' mx_flex mx_justify-start mx_flex-col'>
                                                    <img src={tokenInfo.logo} className=' mx_rounded-full mx_w-16 mx_h-16 mx_overflow-hidden mx_mx-auto mx_object-cover' />
                                                    <p className=' mx_font-semibold mx_text-center mx_mx-auto mx_text-base'>{tokenInfo.ticker}</p>
                                                </div>
                                                <div className='mx_ml-4'>
                                                    <ul className='mx_list-none mx_text-sm mx_font-semibold mx_text-black mx_text-left'>
                                                        <li>
                                                            <span>{t?.dashboard?.profit} : </span>
                                                            <ProfitSpan profit={tradeTokenValue.profitPersent * 100}>
                                                                {formatNumberToUnits(formatToTwoDecimals(tradeTokenValue.profitPersent * 100))}%/{formatNumberToUnits(formatToTwoDecimals(tradeTokenValue.profitSolValue))}SOL
                                                            </ProfitSpan>
                                                        </li>
                                                        <li>
                                                            <span>{t?.dashboard?.value} : </span>
                                                            <span className="mx_ml-1">{formatToTwoDecimals(Number(tradeTokenValue.valueSol))}</span>
                                                            <span className='mx_text-[#a7a7a7] mx_ml-1'>{formatToTwoDecimals(Number(tradeTokenValue.valueUSD))}</span>
                                                        </li>
                                                        <li>
                                                            <span>{t?.dashboard?.mcap} : </span>
                                                            <span className="mx_ml-1">{formatNumberToUnits(Number(formatToTwoDecimals(Number(tradeTokenValue.Mcap))))}</span>
                                                            <span className='mx_text-[#a7a7a7] mx_ml-1'>${formatToTwoDecimals(Number(tradeTokenValue.tokenPrice))}</span>
                                                        </li>
                                                        <li>
                                                            <span>{t?.dashboard?.initial} : </span>
                                                            <span className="mx_ml-1">{formatToTwoDecimals(Number(tradeTokenValue.initialSol))}</span>
                                                            <span className='mx_text-[#a7a7a7] mx_ml-1'>${formatToTwoDecimals(Number(tradeTokenValue.initialUSD))}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                    }
                                    <div className=' mx_grid mx_grid-cols-7 mx_gap-1 mx_mt-2'>
                                        <div className='mx_col-span-5 mx_p-2 mx_rounded-xl mx_bg-[#FFF3E2] mx_flex mx_justify-start mx_border mx_border-[#FFD494]'>
                                            <span className='mx_uppercase mx_m-auto mx_text-xs mx_font-semibold mx_text-primary mx_mr-2'>{t?.dashboard?.sell}</span>
                                            <div className=' mx_grid mx_grid-cols-3 mx_gap-2'>
                                                {
                                                    //sell
                                                    ["25", "50", "100"].map((item, index) => {
                                                        return (
                                                            <Button key={index} variant='contained' size='small' className='mx_text-black !mx_text-xs !mx_min-w-0 !mx_w-fit !mx_font-semibold ' onClick={() => handleSellToken(item)}>{item}%</Button>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                        <div className=' mx_col-span-2 mx_p-2 mx_bg-[#FFF3E2] mx_flex mx_justify-start mx_rounded-xl mx_border mx_border-[#FFD494]'>
                                            <input onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    handleSellToken(sellTokenValue.trim())
                                                }
                                            }} onClick={(e) => e.stopPropagation()} value={sellTokenValue} onChange={(e) => {
                                                setSellTokenValue(e.target.value.trim())
                                            }} placeholder='X' className='focus:mx_outline-none active:mx_outline-none mx_bg-transparent focus:mx_ring-0 mx_w-4 mx_text-right placeholder:mx_text-right mx_text-[#A3A3A3] placeholder:mx_text-[#A3A3A3]' />
                                            <span className='mx_m-auto mx_mr-2 mx_text-[#A3A3A3]'>
                                                %
                                            </span>
                                            <Button variant='contained' size='small' className=' mx_text-black !mx_min-w-0 !mx_w-fit !mx_font-semibold mx_ml-1 !mx_text-xs' onClick={() => handleSellToken(sellTokenValue)}>{t?.dashboard?.sell}</Button>
                                        </div>
                                    </div>
                                    <div className='mx_w-full mx_flex mx_justify-center mx_mt-4'>
                                        <Button variant='contained' size='small' className='!mx_p-2 !mx_rounded-xl !mx_w-fit mx_m-auto mx_items-center !mx_text-sm !mx_font-semibold mx_mt-4' onClick={() => setTradeStatus(ETradeCardRoute.INIT)}>{t?.trade?.backToHome}</Button>
                                    </div>
                                </div>
                            }
                            {
                                tradeStatus == ETradeCardRoute.FAILED_SIGN && <div className='mx_h-[200px] mx_flex mx_justify-center mx_gap-4 mx_flex-col'>
                                    <FailIcon />
                                    <p className='mx_text-black mx_italic mx_mt-3 mx_text-center'>{t?.trade?.failed}</p>
                                    <Button className='!mx_mx-auto !mx_rounded-xl !mx_font-semibold !mx_my-2 mx_mt-4 !mx_w-40' size='small' onClick={handleSignMessage} variant='contained'>
                                        Sign Message
                                    </Button>
                                </div>
                            }
                        </div>

                    </Stack>
                </Draggable>

            </ThemeProvider>

        )
    }
    return <></>
}
