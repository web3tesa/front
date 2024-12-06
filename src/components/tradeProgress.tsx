import React, { HTMLAttributes, useEffect, useState } from 'react'
import { ETradeStatus } from '../types/enum'

interface ITradeProgress extends HTMLAttributes<HTMLDivElement> {
    tradeStatus: ETradeStatus
    color?: string
    text?: {
        init?: string,
        success?: string,
        failed?: string,
        loading?: string
    }
    isFakeLoading?: boolean
}


export default function TradeProgress(props: ITradeProgress) {
    const [isFakeHalf, setIsFakeHalf] = useState(false)
    useEffect(() => {
        if (props.isFakeLoading) {
            setTimeout(() => {
                setIsFakeHalf(true)
            }, 1500)
        }
    }, [props.isFakeLoading])
    return (
        <div {...props} className={'mx_flex mx_w-72 mx_justify-start mx_gap-2 mx_mx-auto' + props.className} >
            <div className='mx_h-2 mx_bg-gray-600 mx_rounded-full mx_w-32 mx_my-auto'>
                <div className={`
                ${props.tradeStatus == ETradeStatus.SUCCESS ? "mx_w-full" : isFakeHalf ? "mx_w-[50%]" : "mx_w-0"} 
                ${props.tradeStatus == ETradeStatus.SUCCESS ? "mx_bg-primary" : props.tradeStatus !== ETradeStatus.FAILED ? "mx_bg-[#FFD494]" : "mx_bg-red-600"}
                mx_h-full mx_rounded-full mx_duration-300 mx_my-auto `} />
            </div>
            <p className='mx_text-left mx_text-xs mx_my-auto'>
                {
                    props.tradeStatus == ETradeStatus.INIT && (props.text?.init || "Init")
                }
                {
                    props.tradeStatus == ETradeStatus.SUCCESS && (props.text?.success || "Success")
                }
                {
                    props.tradeStatus == ETradeStatus.FAILED && (props.text?.failed || "Failed")
                }
                {
                    props.tradeStatus == ETradeStatus.PENDING && (props.text?.loading || "Loading")
                }
            </p>
        </div>
    )
}
