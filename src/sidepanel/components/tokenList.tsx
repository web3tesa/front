import { useEffect, useRef, useState } from 'react'
import { useLanguage, useRefreshTokenList, useRouter, useSolPrice, useUserValue } from '../hooks'
import { ERouter } from '../provider/router'
import TokenCard, { TokenCardSkeleton } from './card/token'
import { useCounter, useInViewport, useInterval } from 'ahooks'
import LoadingIcon from '../assets/loading.svg'
import { reqTokenList, reqTokenProfitList } from '../../service/coin'
import EmptyTokenListIcon from '../assets/empty_token_list.svg'
import { GetMessageContentToSidePannelToRefreshTokenList } from '../../utils/message/inject-content'


const PAGE_SIZE = 10

const COUNTER_DOWN_TIME = 20

let _onBordAddresses: string[] = []


let _tokenList: ITokenListItem[] = []

export default function TokenList() {

    const { router } = useRouter()

    const [loading, setLoading] = useState({
        initLoading: true,
        nextPageLoading: false,
        tokenInterval: false,
        profitInterval: false,
        messageTokenRefresh: false
    })
    const [totalCount, setTotalCount] = useState(0)
    const { isRefreshTokenList, setIsRefreshTokenList } = useRefreshTokenList()
    const { getSolPrice } = useSolPrice()
    const [currentCounterTime, { dec: decCounter, reset: resetCounterTime }] = useCounter(COUNTER_DOWN_TIME, { min: 0, max: COUNTER_DOWN_TIME })
    const scrollPageTag = useRef<HTMLParagraphElement>(null)
    const [tokenList, setTokenList] = useState<ITokenListItem[]>([])


    const { userValue } = useUserValue()
    const t = useLanguage()


    // load next page
    useInViewport(scrollPageTag, {
        callback: (entry) => {
            if (entry.isIntersecting) {
                if (pageNum > 0 && !loading) {
                    handleLoadingNextPage()
                }
            }
        }
    })
    const [pageNum, {
        inc: nextPageNum,
        reset: resetPageNum
    }] = useCounter(0, {
        min: 0,
    })

    // internal counter
    useInterval(() => {
        if (loading) return
        if (currentCounterTime === 0) {
            resetCounterTime()
            trainingTokenList()
            return
        }
        decCounter()
    }, 1000)

    const saveTokenList = (tokenListParams: ITokenListItem[]) => {
        _tokenList = tokenListParams
        setTokenList(_tokenList)
    }

    const trainingTokenList = async () => {
        let _tokenList: ITokenListItem[] = []
        for (let i = 1; i <= pageNum; i++) {
            const __tokenList = await getTokenList(i, _tokenList)

            if (__tokenList) {
                _tokenList = __tokenList
            }
        }
        if (_tokenList.length > 0) {
            saveTokenList(_tokenList)
        }
    }


    const getTokenList = async (_pageNum: number, _tokenList: ITokenListItem[], page_size = PAGE_SIZE): Promise<ITokenListItem[]> => {

        if (!userValue.address) return []
        const _solPrice = await getSolPrice()
        if (_pageNum * page_size >= totalCount && _pageNum > 1) return []
        const { list, total } = await reqTokenList({
            pageNum: _pageNum,
            pageSize: page_size
        })

        setTotalCount(total)
        // let _tokenList = [...tokenList]
        list.forEach((item) => {
            _tokenList.push({
                name: item.name,
                logo: item.image,
                type: "",
                address: item.coin,
                pair: item.pool,
                profitPersend: item.profit,
                profitValue: Number(item.initial) * Number(item.profit),
                value: Number(item.value),
                valueUsd: Number(item.value) * _solPrice,
                mcap: String(Number(item.price) * _solPrice * Number(item.total_supply)),
                volume: "0",
                tokenPrice: String(Number(item.price) * _solPrice),
                initialSol: Number(item.initial),
                initialUsd: Number(item.initial) * _solPrice,
                five_min: 0,
                one_hour: 0,
                six_hour: 0,
                balance: item.balance,
                holder: 0
            })
            console.log("price is ", String(Number(item.price) * _solPrice), " mcap is :", String(Number(item.price) * _solPrice * Number(item.total_supply)));

        })

        return _tokenList
    }




    const handleClickSearchMeme = () => {
        router.to(ERouter.SEARCH_MEME)
    }

    useEffect(() => {
        if (isRefreshTokenList) {
            handleRefreshCoinProfit(_onBordAddresses)
            setIsRefreshTokenList(false)
        }
    }, [isRefreshTokenList])

    useEffect(() => {
        if (!userValue.address) return
        initLoadingList()
    }, [userValue.address])

    useEffect(() => {
        GetMessageContentToSidePannelToRefreshTokenList(() => {
            handleTradeNewTokenFreshTokenLost()
        })
    }, [])

    // refresh token list with new token
    const handleTradeNewTokenFreshTokenLost = async () => {
        console.log("got new token fresh", loading.initLoading);
        setLoading({
            ...loading,
            messageTokenRefresh: true
        })
        console.log("start get new token");

        let _totalCount = totalCount
        const _tokenList = await getTokenList(1, [], (_totalCount + 1))
        console.log("handleTradeNewTokenFreshTokenLost", _tokenList);

        if (_tokenList) {
            saveTokenList(_tokenList)
        }
        setLoading({
            ...loading,
            messageTokenRefresh: false,
            initLoading: false,
            nextPageLoading: false,
            tokenInterval: false
        })
    }


    const handleLoadingNextPage = async () => {
        if (pageNum * PAGE_SIZE >= totalCount && pageNum !== 0) return
        let _pageNum = pageNum + 1
        if (pageNum === 1) setLoading({ ...loading, nextPageLoading: false })
        else setLoading({ initLoading: false, nextPageLoading: true, tokenInterval: false, profitInterval: false, messageTokenRefresh: false })
        const _tokenList = await getTokenList(_pageNum, tokenList)

        if (_tokenList) {
            saveTokenList(_tokenList)
        }
        setLoading({
            initLoading: false,
            nextPageLoading: false,
            tokenInterval: false,
            profitInterval: false,
            messageTokenRefresh: false
        })
        nextPageNum()
    }


    const initLoadingList = async () => {
        setLoading({
            ...loading,
            initLoading: true,
            nextPageLoading: false,
            tokenInterval: false,
            profitInterval: false
        })
        resetPageNum()
        const _tokenList = await getTokenList(1, [])

        if (_tokenList) {
            saveTokenList(_tokenList)
        }
        setLoading({
            initLoading: false,
            nextPageLoading: false,
            tokenInterval: false,
            profitInterval: false,
            messageTokenRefresh: false
        })
    }

    const intervalGetList = async () => {
        const _loading = { ...loading }
        if (loading.initLoading || loading.nextPageLoading || loading.tokenInterval || loading.messageTokenRefresh) return
        setLoading({
            ..._loading,
            tokenInterval: true
        })

        const _tokenList = await getTokenList(1, [], totalCount + 1)
        const tokenStateListLength = tokenList.length
        if (_tokenList?.length >= tokenStateListLength && !loading.messageTokenRefresh) {
            saveTokenList(_tokenList)
        }
        setLoading({
            initLoading: false,
            nextPageLoading: false,
            tokenInterval: false,
            profitInterval: false,
            messageTokenRefresh: false
        })
    }


    // if use state , when multiple callback functions call together, there will be a problem of state data synchronization
    const handleCardViewChange = (tokenAddress: string, inViewPort: boolean) => {
        if (inViewPort == true && _onBordAddresses.indexOf(tokenAddress) == -1) {
            _onBordAddresses.push(tokenAddress)
        } else if (inViewPort == false && _onBordAddresses.indexOf(tokenAddress) != -1) {
            _onBordAddresses.splice(_onBordAddresses.indexOf(tokenAddress), 1)
        }
    }

    const handleRefreshCoinProfit = async (onboardAddresses: string[]) => {
        if (loading.initLoading || loading.nextPageLoading || loading.profitInterval || loading.tokenInterval) return
        setLoading({
            ...loading,
            profitInterval: true
        })
        try {
            const _solPrice = await getSolPrice()
            const coinAddresses = onboardAddresses.join(",")
            if (!coinAddresses) return
            const { list: profitList } = await reqTokenProfitList({ coinAddresses })
            for (let i = 0; i < profitList.length; i++) {
                let currentIndex = 0
                const tokenItem = _tokenList.find((tokenItem, tokenIndex) => {
                    currentIndex = tokenIndex
                    return tokenItem.address == profitList[i].coin
                })
                if (tokenItem) {
                    tokenItem.profitPersend = Number(profitList[i].profit)
                    tokenItem.profitValue = Number(tokenItem.initialSol) * Number(profitList[i].profit)
                    tokenItem.value = Number(profitList[i].value)
                    tokenItem.valueUsd = Number(tokenItem.value) * _solPrice
                    _tokenList[currentIndex] = tokenItem
                }
            }
            if (loading.initLoading || loading.nextPageLoading || loading.profitInterval || loading.tokenInterval || loading.messageTokenRefresh) {
                setLoading({
                    ...loading,
                    profitInterval: false
                })
                return
            }
            saveTokenList(_tokenList)
            setLoading({
                ...loading,
                profitInterval: false
            })
        } catch (error) {
            setLoading({
                ...loading,
                profitInterval: false
            })
        }
    }

    useInterval(() => {
        handleRefreshCoinProfit(_onBordAddresses)
    }, 2000)


    useInterval(() => {
        intervalGetList()
    }, 10000)


    return (
        <div className='mx_relative'>
            <div className='mx_pb-20 mx_relative'>
                {
                    (tokenList.length == 0 && loading.initLoading) &&
                    new Array(10).fill(0).map(() => {
                        return <TokenCardSkeleton />
                    })
                }
                {
                    tokenList.length !== 0 && tokenList.map((item, index) => {
                        return <TokenCard onCardIsView={handleCardViewChange} tokenValue={item} key={index} isBuy={false} />
                    })
                }
                {
                    tokenList.length == 0 && !loading.initLoading && <div className='mx_mt-4'>
                        <img src={EmptyTokenListIcon} className='mx_w-16 mx_h-16 mx_mx-auto' />
                        <p className='mx_text-center mx_text-base mx_italic mx_font-semibold mx_my-4'>{t?.search?.noToken}</p>
                    </div>
                }
                {
                    (loading.nextPageLoading) && <img src={LoadingIcon} className=' mx_w-8 mx_h-8 mx_repeat-infinite mx_animate-spin mx_mx-auto' />
                }
                <p className=' mx_w-full mx_absolute mx_bottom-20 mx_h-4' ref={scrollPageTag} />
            </div>
            <div className=' mx_left-0 mx_fixed mx_w-full mx_bottom-4 mx_px-4 mx_h-28' onClick={handleClickSearchMeme}>
                <div className='mx_w-full mx_h-full mx_bg-white mx_border mx_border-[#FFD494] mx_rounded-2xl mx_flex mx_p-4'>
                    <p className='mx_my-auto mx_text-black/40 mx_text-center mx_w-full mx_font-semibold'>
                        {t?.search?.searchPlaceholder}
                    </p>
                </div>

            </div>
        </div>
    )
}