import React, { HtmlHTMLAttributes, useEffect, useState } from 'react'
import CopyIcon from "../assets/copy.svg"
import { Button } from '@mui/material'
import { useLanguage, useRouter, useSolPrice } from '../hooks'
import { ERouter } from '../provider/router'
import HomeIcon from '../assets/home.svg'
import CopyToClipboard from 'react-copy-to-clipboard'
import { reqUserReferValue } from '../../service/user'
import config from "../../constant/config"
import Loading from './loading'
import { lamportsToSol, solToLamports } from '../../utils/sol/token'
import { formatNumberToUnits, formatToTwoDecimals } from '../../utils'
const { EXTENSION_MIDDLE_PAGE_URL } = config

interface IReferTitleProps extends HtmlHTMLAttributes<HTMLDivElement> {

}

const ReferTitle = (props: IReferTitleProps) => {
    return <div {...props} className={` mx_text-[#444444] mx_text-base mx_font-semibold mx_text-left mx_my-4 ` + props.className}>
        {
            props.children
        }
    </div>
}

export default function Refer() {
    const [loading, setLoading] = useState(true)
    const [referInfo, setReferInfo] = useState({
        link: "https://t.me/bonkbot_bot?start=ref_xhcgv",
        referrals: 59,
        referValue: 1.5,
        referValueUSD: 258.5
    })
    const t = useLanguage()
    const { getSolPrice } = useSolPrice()
    const getInfo = async () => {
        setLoading(true)
        const _solPrice = await getSolPrice()
        const { referCode, referEarn, referCount } = await reqUserReferValue()
        const referValue = Number(lamportsToSol(referEarn))
        setReferInfo({
            link: EXTENSION_MIDDLE_PAGE_URL + `?invite_code=` + referCode,
            referrals: referCount,
            referValue: referValue,
            referValueUSD: referValue * _solPrice
        })
        setLoading(false)
    }

    useEffect(() => {
        getInfo()
    }, [])

    const { router } = useRouter()
    if (loading) {
        return <Loading />
    }
    return (
        <div className=' mx_flex mx_justify-between mx_gap-4 mx_flex-col mx_text-black mx_mt-4'>
            <div className=' mx_flex mx_justify-between mx_gap-y-4 mx_mb-4'>
                <p className=' mx_my-auto mx_font-bold mx_text-xl'>{t?.refer?.referTitle}</p>
                <div className='mx_flex-1 mx_flex mx_justify-end mx_gap-2 mx_ml-6'>
                    <Button
                        className='!mx_min-w-8 !mx_px-1 !mx_w-12 !mx_rounded-xl !mx_text-xs' variant='contained'
                        onClick={() => router.to(ERouter.DASHBOARD)}
                    >
                        <img src={HomeIcon} alt="" className='mx_w-5 group-hover:mx_scale-105 group-active:mx_scale-95 mx_transition-all' />
                    </Button>
                </div>
            </div >

            <ReferTitle>
                {t?.refer?.referLink}:
            </ReferTitle>
            <CopyToClipboard text={referInfo.link}>
                <p className='mx_text-[#25BEFF] mx_text-sm mx_text-left mx_break-words mx_text-wrap mx_break-all'>
                    {referInfo.link}
                    <img src={CopyIcon} className=' mx_inline-block mx_ml-2 mx_h-3 mx_w-3 mx_my-auto  mx_cursor-pointer hover:mx_scale-110 mx_transition-all mx_duration-100 focus:mx_scale-90' alt="" />
                </p>
            </CopyToClipboard>
            <ReferTitle>
                {t?.refer?.referInvite}:  {referInfo.referrals}
            </ReferTitle>
            <ReferTitle>
                {t?.refer?.referReward}: {formatNumberToUnits(formatToTwoDecimals(referInfo.referValue))} SOL(${formatNumberToUnits(formatToTwoDecimals(referInfo.referValueUSD))})
            </ReferTitle>
            <p className='mx_text-sm mx_text-[#A7A7A7] mx_text-left mx_font-bold'>
                {t?.refer?.referDesc1}
                <br />
                {t?.refer?.referDesc2}
            </p>
        </div>
    )
}
