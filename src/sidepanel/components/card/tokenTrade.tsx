import { Button } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useLanguage, useRouter } from '../../hooks'
import { ERouter } from '../../provider/router'

interface ITokenTradeProps {
    isBuy: boolean
    tokenValue: ITokenListItem
}

export default function TokenTrade({
    isBuy,
    tokenValue
}: ITokenTradeProps) {
    const [inputValue, setInputValue] = useState<string>("")
    const t = useLanguage()
    const { router } = useRouter()
    const tradeAmountInputRef = useRef<HTMLInputElement>(null)

    const handleTradeToken = (async (value: string) => {
        if (value == "") return
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
        <div className=' mx_grid mx_grid-cols-7 mx_gap-1 mx_mt-2'>
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
        </div>
    )
}
