import { Autocomplete, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { useLanguage, useSolPrice, useUserValue } from '../hooks'
import { formatNumberToUnits, formatSolAddress, formatToTwoDecimals } from '../../utils'
import CopyIcon from "../assets/copy.svg"
import { CopyToClipboard } from "react-copy-to-clipboard"
import WalletDownIcon from "../assets/wallet-down.svg"
import { useInterval } from 'ahooks'
import { toast } from 'react-toastify'

export default function WalletCommad() {

    const { userValue, refreshUserBalance } = useUserValue()
    const t = useLanguage()

    useInterval(() => {
        refreshUserBalance()
    }, 10000)

    useEffect(() => {
        refreshUserBalance()
    }, [userValue.address])

    return (
        <div>
            <div className='mx_flex mx_justify-start'>
                <p className='mx_flex mx_justify-start mx_font-semibold mx_text-base'>
                    {t?.header?.solWallet}
                    <img src={WalletDownIcon} className='mx_ml-3 mx_my-auto' alt="" />
                </p>
                <p className=' mx_my-auto mx_text-xs mx_flex mx_ml-3 mx_text-[#8C8C8C] mx_justify-start mx_gap-2'>
                    {
                        userValue.address && formatSolAddress(userValue.address)
                    }
                    <CopyToClipboard text={userValue.address} onCopy={() => {
                        toast.success(t?.header?.copy + t?.header?.success)
                    }}>
                        <img src={CopyIcon} className=' mx_inline-block mx_mr-4 mx_h-4 mx_w-4 mx_my-auto  mx_cursor-pointer hover:mx_scale-110 mx_transition-all mx_duration-100 focus:mx_scale-90' alt="" />
                    </CopyToClipboard>
                </p>
            </div>
            <div className='mx_text-left mx_flex mx_font-semibold mx_text-xs mx_mt-1'>
                <p>{t?.header?.balance} : <span className='mx_font-bold'>{formatNumberToUnits(formatToTwoDecimals(Number(userValue.balance))) || "-"}</span> SOL</p>
                <p className='mx_ml-1'>{t?.header?.value} : <span className='mx_font-bold'>{formatNumberToUnits(formatToTwoDecimals(Number(userValue.value) + Number(userValue.balance))) || "-"} SOL</span></p>
            </div>
        </div>
    )
}
