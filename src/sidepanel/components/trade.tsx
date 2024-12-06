import React, { startTransition, useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useLanguage, useRouter, useSolPrice, useTokenInfo, useUserValue } from '../hooks'
import { ERouter } from '../provider/router'
import { reqTokenBuy, reqTokenProfit, reqTokenSell, reqTransInfo } from '../../service/coin'
import { solToLamports, tokenForDecimalsToLamports } from '../../utils/sol/token'
import Loading from '../../components/Loading'
import LoadingSvg from "../assets/loading.svg"
import successSvg from "../assets/success.svg"
import Success from '../../components/success'
import { formatNumberToUnits, formatToTwoDecimals } from '../../utils'
import DownloadIcon from "../assets/download.svg"
import CopyIcon from "../assets/copy.svg"
import FailIcon from '../../contentScript/src/assets/Fail'
import { drawSellCanvas } from '../../utils/canvas'
import TradeCard from './tradeCard'
import { useInterval, useResetState } from 'ahooks'
import TokenCard, { TokenCardSkeleton } from './card/token'
import { ETradeStatus } from '../../types/enum'
import TradeProgress from '../../components/tradeProgress'


export default function TradePage() {
    const { getSolPrice } = useSolPrice()
    const [tradeStatus, setTradeStatus] = React.useState<ETradeStatus>(ETradeStatus.PENDING)
    const [counterTime, setCounterTime] = useState(-1)

    // 0 init 1 pending 2success 3 failed
    const [tradeProcess, setTradeProcess] = useState({
        coinInfo: ETradeStatus.INIT,
        onChain: ETradeStatus.INIT,
    })

    const [loading, setLoading] = useState({
        profit: true
    })

    const [txHash, setTxHash] = useState<string>("")

    // 0 init 1 pending 2success 3 failed
    const [canvasDrawLoading, setCanvasDrawLoading, resetCanvasDrawLoading] = useResetState({
        download: 0,
        copy: 0
    })

    const { getTokenInfo } = useTokenInfo()

    const [tradeValue, setTradeValue] = React.useState<ITokenListItem>({
        // fromTokenAmount: 0,
        // toTokenAmount: 0,
        fromTokenSymbol: "",
        toTokenSymbol: "",
        name: '',
        address: '',
        logo: '',
        mcap: "0",
        profitPersend: 0,
        profitValue: 0,
        value: 0,
        valueUsd: 0,
        transHx: "",
        type: "0",
        initialSol: 0,
        initialUsd: 0,
        tokenPrice: "0",
        balance: "0",
        period: 0,
        pair: "", // Add this property
        volume: "", // Add this property
        five_min: 0, // Add this property
        one_hour: 0, // Add this property
        six_hour: 0,
        holder: 0,
        tokenAmount: 0,
        tradeSolAmount: 0
    })


    const { router } = useRouter()
    const { refreshUserBalance } = useUserValue()
    const t = useLanguage()

    // back home count down
    useInterval(() => {
        if (counterTime > 0 && !loading.profit && canvasDrawLoading.download !== 1 && canvasDrawLoading.copy !== 1) {
            setCounterTime(counterTime - 1)
        }
        // get profit
        if (tradeProcess.onChain == ETradeStatus.SUCCESS && loading.profit) {
            getTransInfo()
        }

    }, 1000)

    // stop count down when trade success
    useEffect(() => {
        if (tradeStatus !== ETradeStatus.SUCCESS) {
            setCounterTime(-1)
        }
    }, [tradeStatus])

    useEffect(() => {
        // back home when count down is 0
        if (counterTime == 0) {
            handleBackHome()
        }
    }, [counterTime])


    const getTransInfo = async () => {
        if (!loading.profit) return
        try {
            const routerValue = router.value.tokenValue
            const _tradeValue = { ...tradeValue }
            const txData = await getTransValue(tradeValue?.transHx || "")
            const tokenProfit = await reqTokenProfit({ coin: routerValue.address })
            let solPrice = 0
            try {
                solPrice = await getSolPrice()
            } catch (error) {

            }
            if (tradeValue.type == "1") {
                const tokenPrice = Number(tokenProfit.price) * solPrice
                _tradeValue.tradeSolAmount = Number(txData.inAmount)
                _tradeValue.tokenAmount = Number(txData.outAmount)
                _tradeValue.value = Number(txData.outAmount) * tokenPrice / Number(solPrice)
                _tradeValue.valueUsd = Number(txData.outAmount) * tokenPrice
                _tradeValue.profitPersend = tokenProfit.profit
                _tradeValue.profitValue = tokenProfit.profit * Number(router.value.inputValue)
                _tradeValue.toTokenSymbol = txData.inName
                _tradeValue.mcap = String(tokenPrice * Number(tokenProfit.total_supply))
                _tradeValue.initialSol = Number(tokenProfit.initial)
                _tradeValue.initialUsd = Number(tokenProfit.initial) * solPrice
                _tradeValue.balance = tokenProfit.balance
                _tradeValue.logo = tokenProfit.image
                _tradeValue.price = String(tokenPrice)
                _tradeValue.tokenPrice = String(tokenPrice)
                _tradeValue.fromTokenSymbol = txData.outName
                _tradeValue.period = tokenProfit.period
            } else if (tradeValue.type == "2") {
                const tokenPrice = Number(tokenProfit.price) * solPrice
                _tradeValue.tradeSolAmount = Number(txData.outAmount)
                _tradeValue.tokenAmount = Number(txData.inAmount)
                _tradeValue.fromTokenSymbol = txData.inName
                _tradeValue.toTokenSymbol = txData.outName
                _tradeValue.value = Number(tokenProfit.value)
                _tradeValue.valueUsd = Number(tokenProfit.value) * solPrice
                _tradeValue.logo = tokenProfit.image
                _tradeValue.mcap = String(tokenPrice * Number(tokenProfit.total_supply))
                _tradeValue.profitPersend = formatToTwoDecimals(Number(tokenProfit.profit))
                _tradeValue.profitValue = formatToTwoDecimals(Number(txData.outAmount) / (1 - Number(tokenProfit.profit)) - Number(txData.outAmount))
                _tradeValue.period = tokenProfit.period
                _tradeValue.initialSol = Number(tokenProfit.initial)
                _tradeValue.initialUsd = Number(tokenProfit.initial) * solPrice
                _tradeValue.price = String(Number(tokenProfit.price) * solPrice)
                _tradeValue.tokenPrice = String(tokenPrice)
            }
            console.log({
                _tradeValue
            });

            setTradeValue(_tradeValue)
            setLoading({
                ...loading,
                profit: false
            })
            await refreshUserBalance()
            setCounterTime(10)
        } catch (error) {

        }
    }


    const getTransRes = async () => {
        setTradeStatus(ETradeStatus.PENDING)
        resetCanvasDrawLoading()
        setTradeProcess({
            coinInfo: ETradeStatus.PENDING,
            onChain: ETradeStatus.INIT,
        })

        try {
            const routerValue = router.value
            const tokenValue = routerValue.tokenValue
            let _tradeValue = {
                ...tradeValue
            }
            if (!tokenValue.decimals || !tokenValue.pool) {
                const tokeninfo = await getTokenInfo(tokenValue.address)
                tokenValue.decimals = tokeninfo.decimals
                tokenValue.pool = tokeninfo.pair
            }
            setTradeProcess({
                coinInfo: ETradeStatus.SUCCESS,
                onChain: ETradeStatus.PENDING,
            })
            if (routerValue.isBuy) {
                const { txSignature } = await reqTokenBuy({
                    coin: tokenValue.address,
                    pool: tokenValue.pool || "",
                    amount: solToLamports(Number(routerValue.inputValue)),
                    decimal: tokenValue.decimals || 0
                })
                setTradeProcess({
                    coinInfo: ETradeStatus.SUCCESS,
                    onChain: ETradeStatus.SUCCESS,
                })
                setTxHash(txSignature)
                _tradeValue.address = tokenValue.address
                _tradeValue.type = "1"
                _tradeValue.transHx = txSignature
            } else {
                const { txSignature } = await reqTokenSell({
                    coin: tokenValue.address,
                    pool: tokenValue.pool || "",
                    amount: tokenForDecimalsToLamports(Number(routerValue.inputValue), tokenValue.decimals || 0),
                    decimal: tokenValue.decimals || 0
                })
                setTradeProcess({
                    coinInfo: ETradeStatus.SUCCESS,
                    onChain: ETradeStatus.SUCCESS,
                })
                _tradeValue.type = "2"
                _tradeValue.transHx = txSignature
            }

            setTradeValue(_tradeValue)
            setTradeProcess({
                coinInfo: ETradeStatus.SUCCESS,
                onChain: ETradeStatus.SUCCESS,
            })
            setTradeStatus(ETradeStatus.SUCCESS)
        } catch (error) {
            if (!tradeValue.transHx) {
                setTradeStatus(ETradeStatus.FAILED)
            }
        }
    }


    const getTransValue = async (txSignature: string) => {
        const txData = await reqTransInfo({ txSignature })
        return txData
    }


    const drawTradeCanvas = async (isCopy: boolean) => {
        await drawSellCanvas({
            tokenPair: tradeValue.fromTokenSymbol + "/" + tradeValue.toTokenSymbol,
            persent: tradeValue.profitPersend,
            holdTime: tradeValue?.period || 0,
            isDownload: !isCopy,
            isCopy
        })
    }

    const handleDownload = async () => {
        if (canvasDrawLoading.download == 1) return
        setCanvasDrawLoading({
            ...canvasDrawLoading,
            download: 1
        })
        try {

            await drawTradeCanvas(false)
            setCanvasDrawLoading({
                ...canvasDrawLoading,
                download: 2,
            })
        } catch (error) {
            setCanvasDrawLoading({
                ...canvasDrawLoading,
                download: 3,
            })
        }
    }

    const handleCopyImg = async () => {
        if (canvasDrawLoading.copy == 1) return
        setCanvasDrawLoading({
            ...canvasDrawLoading,
            copy: 1
        })
        try {
            await drawTradeCanvas(true)
            setCanvasDrawLoading({
                ...canvasDrawLoading,
                copy: 2
            })
        } catch (error) {
            setCanvasDrawLoading({
                ...canvasDrawLoading,
                copy: 3
            })
        }
    }

    useEffect(() => {
        getTransRes()
    }, [router.value])

    const handleSwapScan = () => {
        chrome.tabs.create({ url: `https://solscan.io/tx/${tradeValue.transHx}` })
    }
    const handleBackHome = () => {
        router.to(ERouter.DASHBOARD)
    }

    return (
        <div className='mx_h-full'>
            <div className='mx_h-full mx_flex mx_justify-start mx_flex-col'>
                <div>
                    {
                        tradeStatus == ETradeStatus.PENDING && <div className=' mx_flex mx_justify-start mx_flex-col mx_p-8'>
                            <Loading />
                            <p className='mx_text-center mx_mt-6 mx_text-base mx_font-semibold mx_text-primary mx_italic mx_mb-4'>{t?.trade?.confirming}</p>
                            <TradeProgress tradeStatus={tradeProcess.coinInfo} text={{
                                init: t?.trade?.tokenInfo + " " + t?.trade?.ongoing,
                                loading: t?.trade?.tokenInfo + " " + t?.trade?.ongoing,
                                success: t?.trade?.tokenInfo + " " + t?.trade?.retrieved,
                                failed: t?.trade?.tokenInfo + " " + t?.trade?.failed
                            }} />
                            <TradeProgress tradeStatus={tradeProcess.onChain}
                                isFakeLoading
                                text={{
                                    init: t?.trade?.transaction + " " + t?.trade?.ongoing + "...",
                                    loading: t?.trade?.transaction + " " + t?.trade?.ongoing + "...",
                                    success: t?.trade?.transaction + " " + t?.trade?.retrieved,
                                    failed: t?.trade?.transaction + " " + t?.trade?.failed
                                }}
                            />
                        </div>
                    }
                    {
                        tradeStatus == ETradeStatus.SUCCESS &&
                        <div className='mx_flex mx_justify-start mx_flex-col '>
                            <div className=' mx_font-medium'>
                                <div className='mx_mt-4'>
                                    <Success />
                                    <p className='mx_cursor-pointer mx_text-center  mx_mt-4 mx_text-[#0075FF] mx_underline mx_underline-offset-4 mx_text-sm mx_italic mx_font-semibold' onClick={handleSwapScan}>{t?.trade?.swapSuccessful}</p>
                                </div>
                                {
                                    loading.profit ?
                                        <TokenCardSkeleton />
                                        :
                                        <div className=' mx_flex mx_justify-start mx_gap-4 mx_mt-4'>
                                            <TokenCard tokenValue={tradeValue} isBuy={false} isSold={!router.value.isBuy} />
                                        </div>
                                }
                            </div>
                            {
                                !router.value.isBuy && !loading.profit &&
                                <div className='mx_w-full mx_my-6'>
                                    <TradeCard pair={tradeValue.fromTokenSymbol + "/" + (tradeValue.toTokenSymbol || "SOL")} profit={tradeValue.profitPersend} holdTime={tradeValue.period || 0} />
                                </div>
                            }
                            <div className='mx_mt-4 mx_flex mx_justify-between mx_gap-2'>
                                <Button size='small' className=' !mx_mx-auto  mx_w-fit mx_col-span-2 mx_my-auto' variant='contained' onClick={handleBackHome}>{t?.trade?.backToHome} {counterTime >= 0 && ("(" + counterTime + ")")}</Button>
                                {
                                    !router.value.isBuy && !loading.profit &&
                                    <div className='mx_cursor-pointer mx_group mx_w-fit mx_h-fit mx_m-auto mx_bg-[#f2f2f2] mx_p-2 mx_rounded-xl' onClick={handleDownload}>
                                        <img
                                            src={canvasDrawLoading.download == 0 ? DownloadIcon : canvasDrawLoading.download == 1 ? LoadingSvg : canvasDrawLoading.download == 2 ? successSvg : DownloadIcon}
                                            className={`${canvasDrawLoading.download == 1 ? "mx_animate-spin" : ""} mx_repeat-infinite mx_transition-all mx_cursor-pointer mx_w-4 mx_h-4 group-hover:mx_scale-105 group-active:mx_scale-95`} />
                                    </div>
                                }
                                {
                                    !router.value.isBuy && !loading.profit &&
                                    <div className='mx_cursor-pointer mx_group mx_w-fit mx_h-fit mx_m-auto mx_bg-[#f2f2f2] mx_p-2 mx_rounded-xl' onClick={handleCopyImg}>
                                        <img
                                            src={canvasDrawLoading.copy == 0 ? CopyIcon : canvasDrawLoading.copy == 1 ? LoadingSvg : canvasDrawLoading.copy == 2 ? successSvg : CopyIcon}
                                            className={`${canvasDrawLoading.copy == 1 ? "mx_animate-spin" : ""} mx_repeat-infinite mx_transition-all mx_cursor-pointer mx_w-4 mx_h-4 group-hover:mx_scale-105 group-active:mx_scale-95`} />
                                    </div>
                                }
                            </div>

                        </div>
                    }
                    {
                        tradeStatus == ETradeStatus.FAILED && <div className='mx_flex mx_justify-start mx_flex-col mx_p-8'>
                            <FailIcon />
                            <p className='mx_text-black mx_italic mx_mt-3 mx_text-center'>{t?.trade?.failed}</p>
                            <Button className='!mx_mx-auto !mx_rounded-xl !mx_font-semibold !mx_my-2 mx_mt-4 !mx_w-40' size='small' onClick={getTransRes} variant='contained'>
                                {t?.trade?.tryAgain}
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
