import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { reqUserTradeList, reqUserWithdrawHistory } from '../../service/user'
import { useLanguage, useSolPrice } from '../hooks'
import { useInViewport, useResetState } from 'ahooks'
import { TokenCardSkeleton } from './card/token'
import tokenList from './tokenList'
import SolanaIcon from '../assets/solana.svg'
import ProfitSpan from '../../components/ProfitSpan'
import { formatNumberToUnits, formatTimestamp, formatToTwoDecimals, formatUtcTimeToTimestamp } from '../../utils'
import LoadingIcon from '../assets/loading.svg'
import { lamportsToSol, tokenForLamportsToDecimals } from '../../utils/sol/token'
import BuyIcon from "../assets/buyicon.svg"
import SellIcon from "../assets/sellicon.svg"
import InIcon from '../assets/inicon.svg'
import OutIcon from '../assets/outicon.svg'
import TokenBadge from "../assets/tokenBadge.svg"

interface ITabItem {
    key: ETAB,
    type: number,
    name: string
    disabled: boolean
}

enum ETAB {
    BUY = 2,
    SELL = 3,
    DEPOSIT = 4,
    WITHDRAW = 5
}

const PAGE_SIZE = 10




const TabBar = ({
    value,
    onChange
}: {
    value: ETAB,
    onChange: (e: ITabItem) => void
}) => {
    const t = useLanguage()
    const TAB_LIST: ITabItem[] = [
        {
            key: ETAB.BUY,
            type: ETAB.BUY,
            name: t?.order.buy,
            disabled: false
        },
        {
            key: ETAB.SELL,
            type: ETAB.SELL,
            name: t?.order.sell,
            disabled: false
        },
        {
            key: ETAB.DEPOSIT,
            type: ETAB.DEPOSIT,
            name: t?.order.deposit,
            disabled: false
        },
        {
            key: ETAB.WITHDRAW,
            type: ETAB.WITHDRAW,
            name: t?.order.withdraw,
            disabled: false
        }
    ]
    return <ul className='mx_border mx_rounded-xl mx_border-primary mx_w-full mx_overflow-hidden mx_grid mx_grid-cols-8 mx_my-4'>
        {
            TAB_LIST.map((tab, index) => {
                return <li
                    onClick={() => !tab.disabled && onChange(tab)}
                    key={tab.key}
                    className={`${value == tab.type ? "mx_bg-primary mx_text-white" : "mx_bg-white mx_text-primary"}  mx_col-span-2 ${!tab.disabled ? "mx_cursor-pointer" : "mx_cursor-not-allowed"}  mx_text-center mx_font-bold mx_py-2 mx_border-r last:mx_border-none mx_border-primary `}>
                    {tab.name}
                </li>
            })
        }
    </ul>
}




const TradeList = ({ tradeType }: { tradeType: ETAB }) => {
    const [loading, setLoading] = useState({
        initLoading: true,
        nextPageLoading: false
    })
    const [tradeList, setTradeList] = useState<ITradeHistoryListItem[]>([])
    const [pageNum, setPageNum, resetPageNum] = useResetState(0)
    const [totalCount, setTotalCount, resetTotalCount] = useResetState(0)
    const { getSolPrice } = useSolPrice()

    const scrollPageTag = useRef<HTMLParagraphElement>(null)
    let total = totalCount
    const getList = async (_pageNum: number) => {
        const isNextPage = _pageNum > 1
        if (isNextPage) {
            setLoading({
                ...loading,
                nextPageLoading: true
            })
        } else {
            setLoading({
                ...loading,
                initLoading: true
            })
        }
        let _tradeList = isNextPage ? [...tradeList] : []
        if (tradeType == ETAB.BUY || tradeType == ETAB.SELL) {
            const {
                list,
                total: _total
            } = await reqUserTradeList({
                action: tradeType,
                pageNum: _pageNum,
                pageSize: PAGE_SIZE
            })
            total = _total

            const solPrice = await getSolPrice()

            list.forEach((item, index) => {
                _tradeList.push({
                    profitPersent: item.profit,
                    profitsol: item.profit * Number(item.value) * solPrice / 100,
                    mcap: String(Number(item.price) * solPrice * Number(tokenForLamportsToDecimals(Number(item.total_supply), item.decimal))),
                    price: String(Number(item.price) * solPrice),
                    valueSol: item.value,
                    valueUsd: String(Number(item.value) * solPrice),
                    time: formatTimestamp(item.time),
                    type: item.Action,
                    image: item.image,
                    name: item.name,
                    txHash: item.hash
                })
            })
        } else if (tradeType == ETAB.DEPOSIT || tradeType == ETAB.WITHDRAW) {
            const res = await reqUserWithdrawHistory({
                pageNum: _pageNum,
                pageSize: PAGE_SIZE,
                action: tradeType == ETAB.DEPOSIT ? 1 : 2,
            })
            res.list.forEach((item, index) => {
                _tradeList.push({
                    time: formatUtcTimeToTimestamp(item.time),
                    type: tradeType,
                    txHash: item.tx_hash,
                    valueSol: lamportsToSol(item.amount),
                    name: "SOL"
                })
            })
            total = res.total
        }
        setTradeList(_tradeList)
        setTotalCount(total)
        if (_pageNum == 1) {
            setLoading({
                initLoading: false,
                nextPageLoading: false
            })
        }
        setPageNum(pageNum + 1)
    }

    const handleLoadingNextPage = async () => {
        if ((pageNum * PAGE_SIZE >= totalCount && pageNum !== 0) || loading.nextPageLoading || loading.initLoading) return
        let _pageNum = pageNum + 1
        if (_pageNum === 1) setLoading({ ...loading, nextPageLoading: false })
        else setLoading({ initLoading: false, nextPageLoading: true })
        await getList(_pageNum)
        setLoading({
            initLoading: false,
            nextPageLoading: false
        })
    }

    useEffect(() => {
        resetPageNum()
        resetTotalCount()
        getList(1)
    }, [tradeType])

    // load next page
    useInViewport(scrollPageTag, {
        callback: (entry) => {
            if (entry.isIntersecting) {
                if (pageNum > 0 && !loading.nextPageLoading && !loading.initLoading) {
                    handleLoadingNextPage()
                }
            }
        }
    })

    return <div className='mx_relative'>
        {
            (tokenList.length == 0 && loading.initLoading) &&
            new Array(10).fill(0).map(() => {
                return <TokenCardSkeleton />
            })
        }
        {
            !loading.initLoading &&
            tradeList.map((item, index) => {
                return <TradeHistoryCard key={index} cardValue={item} />
            })
        }
        {
            (loading.nextPageLoading) && <img src={LoadingIcon} className=' mx_w-8 mx_h-8 mx_repeat-infinite mx_animate-spin mx_mx-auto' />
        }
        <p className=' mx_w-full mx_absolute mx_bottom-20 mx_h-4' ref={scrollPageTag} />
    </div>
}


export default function OrderHistory() {
    const [tab, setTab] = useState<ETAB>(ETAB.BUY)
    const t = useLanguage()

    const handleTabChange = async (tab: ITabItem) => {
        setTab(tab.type)
    }

    return (
        <div className='mx_py-4'>
            <h3 className={'mx_font-bold mx_text-base mx_text-black mx_uppercase'}>
                {t?.order.tradingHistory}
            </h3>
            <TabBar value={tab} onChange={handleTabChange} />

            <TradeList tradeType={tab} />
        </div>
    )
}


const TradeHistoryCard = ({
    cardValue
}: {
    cardValue: ITradeHistoryListItem
}) => {
    const [imgIsLoad, setImgIsLoad] = useState(false)
    const t = useLanguage()
    const isSolHistroy = useMemo(() => {
        return cardValue.type == ETAB.DEPOSIT || cardValue.type == ETAB.WITHDRAW
    }, [cardValue.type])
    const handleClickCard = () => {
        chrome.tabs.create({ url: `https://solscan.io/tx/${cardValue.txHash}` })
    }
    useEffect(() => {
        loadImg()
    }, [cardValue.image])
    const loadImg = () => {
        setImgIsLoad(false)
        const img = new Image()
        img.src = cardValue.image || ""
        img.onload = () => {
            setImgIsLoad(true)
        }
    }

    return <div className='mx_my-4  hover:mx_bg-black/5 mx_rounded-xl'>
        <div className='mx_flex mx_justify-start mx_cursor-pointer' onClick={handleClickCard}>
            <div className='mx_flex mx_flex-col mx_text-center mx_justify-between mx_w-20'>
                <div className='mx_relative mx_m-auto'>
                    <Suspense fallback={<div className=' mx_skeleton mx_w-12 mx_h-12 mx_my-auto mx_overflow-hidden mx_rounded-full' />}>
                        {
                            isSolHistroy ? <img src={SolanaIcon} className='mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full mx_object-cover' /> :
                                imgIsLoad ?
                                    <img src={cardValue.image} className='mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full mx_object-cover' />
                                    : <div className=' mx_skeleton mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full' />
                        }
                    </Suspense>
                    <img src={TokenBadge} className=' mx_absolute mx_-right-2 mx_w-6 mx_h-6 mx_-bottom-2 mx_bg-white mx_rounded-full mx_overflow-hidden' alt="" />
                </div>
                <p className=' mx_text-black mx_font-bold mx_text-base mx_line-clamp-1 mx_mx-auto mx_w-16'>
                    {cardValue.name}
                </p>
            </div>
            <div className='mx_text-left mx_ml-6 mx_justify-center mx_my-auto'>
                {
                    cardValue.type == 2 && <p className='mx_text-sm mx_font-semibold '>
                        {t?.dashboard?.profit}:
                        <ProfitSpan profit={cardValue?.profitPersent || 0}>
                            {((cardValue?.profitPersent || 0) * 100).toFixed(2)}%
                            <span className='mx_mx-1'>/</span>
                            {formatNumberToUnits(formatToTwoDecimals(cardValue?.profitsol || 0))} SOL
                        </ProfitSpan>
                    </p>
                }
                {
                    !isSolHistroy &&
                    <p className='mx_text-sm mx_my-1 mx_font-semibold '>
                        {t?.dashboard?.mcap}:
                        ${formatNumberToUnits(Number(cardValue.mcap))}
                    </p>
                }
                {
                    isSolHistroy ?
                        <p className='mx_text-sm mx_my-1 mx_font-semibold '>
                            {t?.dashboard?.amount}:
                            {formatToTwoDecimals(Number(cardValue.valueSol))} SOL
                        </p> :
                        <p className='mx_font-semibold mx_text-sm'>
                            {t?.dashboard?.value}: <span className='mx_ml-1'>
                                {formatToTwoDecimals(Number(cardValue.valueSol))} SOL
                                <span className='mx_text-sm mx_ml-1 mx_text-[#a7a7a7] mx_font-normal'>
                                    ${formatNumberToUnits(formatToTwoDecimals(Number(cardValue.valueUsd)))}
                                </span>
                            </span>
                        </p>
                }
                <p className='mx_text-sm mx_my-1 mx_font-semibold '>
                    {t?.order?.time}:
                    {
                        cardValue.time
                    }
                </p>
            </div>
            <div className=' mx_flex mx_h-full mx_flex-col mx_justify-center mx_my-auto'>
                {
                    (() => {
                        switch (cardValue.type) {
                            case 1:
                                return <img src={BuyIcon} className='mx_my-auto' />
                            case 2:
                                return <img src={SellIcon} className='mx_my-auto' />
                            case ETAB.DEPOSIT:
                                return <img src={InIcon} className='mx_my-auto' />
                            case ETAB.WITHDRAW:
                                return <img src={OutIcon} className='mx_my-auto' />
                            default:
                                return <div className='mx_w-20 mx_h-20 mx_bg-red mx_text-white mx_text-center mx_my-auto mx_rounded-xl'>
                                    {t?.dashboard?.sell}
                                </div>
                        }
                    })()
                }
            </div>
        </div>
    </div>
}