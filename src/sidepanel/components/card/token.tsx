import { Button } from '@mui/material'
import React, { HTMLAttributes, Suspense, useEffect, useRef, useState } from 'react'
import { useLanguage, useRouter, useTokenInfo } from '../../hooks'
import { ERouter } from '../../provider/router'
import SolanaIcon from '../assets/solana.svg'
import { formatNumberToUnits, formatToTwoDecimals } from '../../../utils'
import ProfitSpan from '../../../components/ProfitSpan'
import { useFavicon, useInViewport } from 'ahooks'
import TokenLogo from './tokenLogo'

interface ITokenCard extends HTMLAttributes<HTMLDivElement> {
    tokenValue: ITokenListItem,
    isBuy?: boolean,
    isSold?: boolean,
    onCardIsView?: (address: string, inView: boolean) => void
}

export default function TokenCard({
    tokenValue,
    isBuy = false,
    isSold = false,
    onCardIsView,
    ...props
}: ITokenCard) {
    const { router } = useRouter()
    const t = useLanguage()
    const [inputValue, setInputValue] = React.useState("")
    const tokenCardRef = useRef<HTMLDivElement>(null)
    const [inViewport] = useInViewport(tokenCardRef);
    const [imgIsLoad, setImgIsLoad] = useState(false)
    const tradeAmountInputRef = useRef<HTMLInputElement>(null)
    const handleClickCard = () => {
        chrome.tabs.create({ url: `https://dexscreener.com/solana/${tokenValue.address}` })
    }
    useEffect(() => {
        if (onCardIsView) {
            onCardIsView(tokenValue.address, inViewport || false)
        }
    }, [inViewport])


    useEffect(() => {
        loadImg()
    }, [tokenValue.logo])

    const loadImg = () => {
        setImgIsLoad(false)
        const img = new Image()
        img.src = tokenValue.logo
        img.onload = () => {
            setImgIsLoad(true)
        }
    }

    const handleTradeToken = (async (value: string) => {
        if (value == "") return
        console.log("got token value is", tokenValue);

        const tradeValue = isBuy ?
            value
            : Number(tokenValue?.balance) * (Number(value) / 100)
        router.to(ERouter.TRADE, {
            isBuy,
            tokenValue: {
                ...tokenValue,
                decimals: tokenValue.decimals,
                pool: tokenValue.pool,
            },
            inputValue: tradeValue
        })
    })


    return (
        <div {...props} className=' mx_my-4  hover:mx_bg-black/5 mx_rounded-xl' ref={tokenCardRef} >
            <div className='mx_flex mx_justify-start mx_cursor-pointer' onClick={handleClickCard}>
                <TokenLogo logo={tokenValue.logo} name={tokenValue.name} />
                {
                    isSold ? <div className='mx_text-left mx_ml-6'>
                        <p className='mx_text-sm mx_font-semibold'>
                            Sold <span className='mx_text-primary'> {formatNumberToUnits(formatToTwoDecimals(Number(tokenValue.tokenAmount)))}</span> {tokenValue.fromTokenSymbol} for <span className=' mx_text-primary'>{formatNumberToUnits(formatToTwoDecimals(tokenValue.tradeSolAmount || 0))}</span> SOL
                        </p>
                        <p className='mx_text-sm mx_my-1 mx_font-semibold '>
                            {t?.dashboard?.mcap}:
                            ${formatNumberToUnits(Number(tokenValue.mcap))}
                        </p>
                        <p className='mx_text-sm mx_font-semibold '>
                            {t?.dashboard?.profit}:
                            <ProfitSpan profit={tokenValue.profitPersend}>
                                {(tokenValue.profitPersend * 100).toFixed(2)}%
                                <span className='mx_mx-1'>/</span>
                                {formatNumberToUnits(formatToTwoDecimals(tokenValue.profitValue))} SOL
                            </ProfitSpan>
                        </p>
                    </div>
                        :
                        <div className='mx_text-left mx_ml-6'>
                            {isBuy ?
                                <p className='mx_text-sm'>
                                    <span className=' mx_font-semibold'>{t?.search?.price}:</span> ${formatToTwoDecimals(Number(tokenValue.tokenPrice))}
                                </p>
                                : <p className=' mx_font-semibold mx_text-sm'>
                                    {t?.dashboard?.profit}: <ProfitSpan profit={tokenValue.profitPersend}>
                                        {(tokenValue.profitPersend * 100).toFixed(2)}%
                                        <span className='mx_mx-1'>/</span>
                                        {formatNumberToUnits(formatToTwoDecimals(tokenValue.profitValue))} SOL
                                    </ProfitSpan>
                                </p>}
                            {
                                isBuy ?
                                    <p className='mx_font-semibold mx_text-sm'>
                                        5m: <ProfitSpan profit={tokenValue.five_min}>{formatNumberToUnits(formatToTwoDecimals(tokenValue.five_min))}%,</ProfitSpan>
                                        1h: <ProfitSpan profit={tokenValue.one_hour}>{formatNumberToUnits(formatToTwoDecimals(tokenValue.one_hour))}%, </ProfitSpan>
                                        6h: <ProfitSpan profit={tokenValue.six_hour}>{formatNumberToUnits(formatToTwoDecimals(tokenValue.six_hour))}%</ProfitSpan>
                                    </p>
                                    : <p className='mx_font-semibold mx_text-sm'>
                                        {t?.dashboard?.value}: <span className='mx_ml-1'>
                                            {formatToTwoDecimals(tokenValue.value)} SOL
                                            <TokenPriceSpan>
                                                ${formatNumberToUnits(formatToTwoDecimals(tokenValue.valueUsd))}
                                            </TokenPriceSpan>
                                        </span>
                                    </p>
                            }
                            {
                                isBuy ?
                                    <p className='mx_font-semibold mx_text-sm'>
                                        {t?.dashboard?.holder}:{formatNumberToUnits(tokenValue.holder)}
                                    </p> :
                                    <p className='mx_font-semibold mx_text-sm'>
                                        {t?.dashboard?.initial}: <span >
                                            ${formatNumberToUnits(formatToTwoDecimals(tokenValue.initialSol))} SOL
                                        </span>
                                        <TokenPriceSpan>
                                            ${formatNumberToUnits(formatToTwoDecimals(tokenValue.initialUsd))}
                                        </TokenPriceSpan>
                                    </p>
                            }
                            <p className='mx_font-semibold mx_text-sm'>
                                {t?.dashboard?.mcap}: <span >
                                    ${formatNumberToUnits(Number(tokenValue.mcap))}
                                    {
                                        !isBuy &&
                                        <span>@
                                            <TokenPriceSpan>
                                                ${formatNumberToUnits(formatToTwoDecimals(Number(tokenValue.tokenPrice)))}
                                            </TokenPriceSpan>
                                        </span>
                                    }
                                </span>
                            </p>
                        </div>
                }
            </div>
            {!isSold && <div className=' mx_grid mx_grid-cols-7 mx_gap-1 mx_mt-2'>
                <div className='mx_col-span-5 mx_p-2 mx_rounded-xl mx_bg-[#FFF3E2] mx_flex mx_justify-start mx_border mx_border-[#FFD494]'>
                    <span className='mx_uppercase mx_m-auto mx_text-xs mx_font-semibold mx_text-primary mx_mr-2'>{isBuy ? t?.dashboard?.buy : t?.dashboard?.sell}</span>
                    <div className=' mx_grid mx_grid-cols-3 mx_gap-2'>
                        {
                            isBuy ?
                                //buy
                                ["0.1", "0.5", "1"].map((item, index) => {
                                    return (
                                        <Button key={index} variant='contained' size='small' className='mx_text-black !mx_text-xs !mx_min-w-0 !mx_w-fit !mx_font-semibold' onClick={() => handleTradeToken(item)}>{item}{" "}<span className="mx_ml-1 mx_mt-1 !mx_text-[8px]"> SOL</span></Button>
                                    )
                                })
                                :
                                //sell
                                ["25", "50", "100"].map((item, index) => {
                                    return (
                                        <Button key={index} variant='contained' size='small' className=' mx_text-black !mx_min-w-0 !mx_text-xs !mx_w-fit !mx_font-semibold ' onClick={() => handleTradeToken(item)}>{item}%</Button>
                                    )
                                })
                        }
                    </div>
                </div>
                <div className=' mx_col-span-2 mx_p-2 mx_bg-[#FFF3E2] mx_flex mx_justify-start mx_rounded-xl mx_border mx_border-[#FFD494]'>
                    <input onKeyDown={e => {
                        if (e.key === "Enter") {
                            handleTradeToken(inputValue)
                        }
                    }} onClick={(e) => e.stopPropagation()} ref={tradeAmountInputRef} value={inputValue} onChange={(e) => {
                        setInputValue(e.target.value.trim())
                    }} placeholder='X' className='focus:mx_outline-none active:mx_outline-none mx_bg-transparent focus:mx_ring-0 mx_w-5 mx_text-right placeholder:mx_text-right mx_text-black placeholder:mx_text-[#A3A3A3]' />
                    <span className={`mx_m-auto mx_mr-1 ${inputValue ? "mx_text-black" : "mx_text-[#A3A3A3]"} `} onClick={() => tradeAmountInputRef.current?.focus()}>
                        {isBuy ? "sol" : "%"}
                    </span>
                    <Button variant='contained' size='small' className=' mx_text-black !mx_min-w-0 !mx_w-fit !mx_font-semibold mx_ml-1 !mx_text-xs' onClick={() => handleTradeToken(inputValue)}>{isBuy ? t?.dashboard?.buy : t?.dashboard?.sell}</Button>
                </div>
            </div>}
            <div className='h-1 mx_border-b mx_mt-4 mx_border-[#e4e4e4]' />
        </div >
    )
}


export const TokenCardSkeleton = () => {
    return <div className=' mx_my-4  hover:mx_bg-black/5 mx_rounded-xl'>
        <div className='mx_flex mx_justify-start'>
            <div className='mx_flex mx_flex-col mx_text-center mx_justify-between'>
                <div className='mx_relative mx_m-auto'>
                    <div className=' mx_skeleton mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full' />
                </div>
                <p className='mx_skeleton mx_w-full mx_h-5 mx_mt-2' />
            </div>
            <div className='mx_text-left mx_ml-6 mx_flex-1 mx_justify-between mx_h-full'>
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
            </div>
        </div>
    </div>
}

const TokenPriceSpan = (props: HTMLAttributes<HTMLSpanElement>) => {
    return <span {...props} className='mx_text-sm mx_ml-1 mx_text-[#a7a7a7] mx_font-normal'>
        {props.children}
    </span>
}