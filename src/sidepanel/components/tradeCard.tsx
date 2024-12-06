import React, { useMemo } from 'react'
import MxBgImg from "../assets/mx/mx_bg.png"
import MxWinImg from "../assets/mx/mx_win.png"
import MxLoseImg from "../assets/mx/mx_lose.png"

import MxTimeImg from "../assets/mx/time.png"

import ImgWin1 from "../assets/mx/win_1.png"
import ImgWin2 from "../assets/mx/win_2.png"
import ImgWin3 from "../assets/mx/win_3.png"
import ImgWin4 from "../assets/mx/win_4.png"
import ImgWin5 from "../assets/mx/win_5.png"

import ImgLose1 from "../assets/mx/lose_1.png"
import ImgLose2 from "../assets/mx/lose_2.png"
import ImgLose3 from "../assets/mx/lose_3.png"
import ImgLose4 from "../assets/mx/lose_4.png"
import ImgLose5 from "../assets/mx/lose_5.png"
import { formatToTwoDecimals } from '../../utils'
import ProfitSpan from '../../components/ProfitSpan'
import { TimeToDayTime } from '../../utils/canvas'

interface ITradeCard {
    pair: string
    profit: number
    holdTime: number
}

export default function TradeCard(props: ITradeCard) {
    const cardImg = useMemo(() => {
        const persent = props.profit
        if (persent >= 0 && persent <= 0.2) {
            return ImgWin1
        } else if (persent > 0.2 && persent <= 0.5) {
            return ImgWin2
        } else if (persent > 0.5 && persent <= 1) {
            return ImgWin3
        } else if (persent > 1 && persent <= 2) {
            return ImgWin4
        } else if (persent > 2) {
            return ImgWin5
        } else if (persent < 0 && persent >= -0.2) {
            return ImgLose1
        } else if (persent < -0.2 && persent >= -0.4) {
            return ImgLose2
        } else if (persent < -0.4 && persent >= -0.6) {
            return ImgLose3
        } else if (persent < -0.6 && persent >= -0.8) {
            return ImgLose4
        } else if (persent < -0.8) {
            return ImgLose5
        }
    }, [props.profit])
    return (
        <div className=' mx_relative mx_w-full mx_h-[195px]'>
            <img src={MxBgImg} className='mx_w-full mx_h-full mx_absolute mx_top-0 mx_left-0' alt="" />
            <img src={cardImg} className=' mx_absolute mx_w-[108px] mx_h-[108px] mx_top-[75.8px] mx_left-[11.7px]' alt="" />
            <div className='mx_absolute mx_right-[18px] mx_top-[18px] mx_font-semibold mx_text-black mx_text-right mx_w-fit'>
                <p className='mx_text-sm mx_text-right'>{props.pair}</p>
                <ProfitSpan profit={props.profit} className=' mx_text-xl mx_font-semibold mx_text-right mx_w-fit mx_mt-6'>
                    {formatToTwoDecimals(props.profit * 100)}%
                </ProfitSpan>
                <div className='mx_flex mx_justify-end mx_gap-2 mx_text-[#8C8C8C]'>
                    <img src={MxTimeImg} className='mx_w-3 mx_h-3 mx_mt-1' alt="" />
                    <p>
                        {TimeToDayTime(props.holdTime)}
                    </p>
                </div>
            </div>
        </div>
    )
}
