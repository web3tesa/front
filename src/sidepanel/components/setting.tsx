import React, { HTMLAttributes, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useConfig, useLanguage, useRouter, useUserValue } from '../hooks'
import { Button } from '@mui/material'
import { ERouter } from '../provider/router'
import { reqExportPrivateKey, reqGetUserSetting, reqSetPriority, reqSetSlippage, reqUserSetAntiMev, reqUserWithdrawSol } from '../../service/user'
import FastIcon from "../assets/fast.svg"
import TurboIcon from "../assets/turbo.svg"
import FastFocusIcon from "../assets/fast_focus.svg"
import TurboFocusIcon from "../assets/turbo_focus.svg"
import HomeIcon from '../assets/home.svg'
import MEVIcon from "../assets/mev.svg"
import MEVFocusIcon from "../assets/mev_focus.svg"
import CopyIcon from "../assets/copy.svg"
import CopyToClipboard from 'react-copy-to-clipboard'
import EditIcon from "../assets/edit.svg"
import { formatNumberToUnits, formatToTwoDecimals, isValidSolWalletAddress } from '../../utils'
import { lamportsToSol, solToLamports } from '../../utils/sol/token'
import Loading from '../../components/Loading'
import Success from '../../components/success'
import { toast } from 'react-toastify'
import { ELanguage } from '../../types/enum'
import { LanguageContext } from '../provider/language'
import { getMinimumBalance } from '../../utils/sol/transaction'

enum ESettingPageRoute {
    SETTING_PAGE,
    WALLET_SETTING,
    LOADING_PAGE,
    FAILED_PAGE,
    WITHDRAW_PAGE
}


const SettingPageTitle = (props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <h3 {...props} className={'mx_font-bold mx_text-base mx_text-black ' + props.children}>
            {props.children}
        </h3>
    )
}

export default function Setting() {

    const [settingPageRouteHistory, setSettingPageRouteHistory] = useState<ESettingPageRoute[]>([ESettingPageRoute.SETTING_PAGE])
    const { userValue } = useUserValue()
    const { router } = useRouter()




    const SettingPage = useCallback(() => {
        switch (settingPageRouteHistory[settingPageRouteHistory.length - 1]) {
            case ESettingPageRoute.SETTING_PAGE:
                return <SettingPageContent />
            case ESettingPageRoute.WALLET_SETTING:
                return <WalletSettingContent />
            default:
                return <SettingPageContent />
        }
    }, [settingPageRouteHistory])



    const settingPageTo = (route: ESettingPageRoute) => {
        let _settingPageRouteHistory = [...settingPageRouteHistory]
        _settingPageRouteHistory.push(route)
        setSettingPageRouteHistory(_settingPageRouteHistory)
    }

    const settingPageBack = () => {
        let _settingPageRouteHistory = [...settingPageRouteHistory]
        if (_settingPageRouteHistory.length > 1) {
            _settingPageRouteHistory.pop()
            setSettingPageRouteHistory(_settingPageRouteHistory)
        }
    }




    const SettingPageHead = () => {
        const t = useLanguage()
        return <div>

            <div className=' mx_flex mx_justify-between mx_gap-y-4'>
                <p className=' mx_my-auto mx_font-bold mx_text-xl'>{settingPageRouteHistory[settingPageRouteHistory.length - 1] == ESettingPageRoute.SETTING_PAGE ? t?.setting?.botSetting : t?.setting?.walletSetting}</p>
                <div className='mx_flex-1 mx_flex mx_justify-end mx_gap-2 mx_ml-6'>
                    <Button
                        className='!mx_min-w-8 !mx_px-1 !mx_w-12 !mx_rounded-xl !mx_text-xs' variant='contained'
                        onClick={() => router.to(ERouter.DASHBOARD)}
                    >
                        <img src={HomeIcon} alt="" className='mx_w-5 group-hover:mx_scale-105 group-active:mx_scale-95 mx_transition-all' />
                    </Button>
                    {
                        settingPageRouteHistory[settingPageRouteHistory.length - 1] !== ESettingPageRoute.SETTING_PAGE &&
                        <Button className='!mx_min-w-8 !mx_px-1 !mx_w-12 !mx_rounded-xl !mx_text-xs' variant='contained' onClick={() => {
                            if (settingPageRouteHistory[settingPageRouteHistory.length - 1] == ESettingPageRoute.SETTING_PAGE) {
                                router.to(ERouter.DASHBOARD)
                            } else {
                                settingPageBack()
                            }
                        }}>{t?.setting?.back}</Button>
                    }
                </div>
            </div >
            <div className='h-1 mx_border-b mx_-mx-4 mx_my-4 mx_border-[#e4e4e4]' />
        </div>
    }

    const SettingPageContent = () => {
        const [transMode, setTransMode] = useState<string>("fast")
        const [loading, setLoading] = useState({
            transModeLoading: false,
            initLoading: false,
            mevLoading: false
        })

        const { language, setLanguage } = useContext(LanguageContext)

        const mevRef = useRef<HTMLImageElement>(null)


        const [isMevCheck, setIsMevCheck] = useState(false)

        const [slip, setSlip] = useState({
            buy: 0,
            sell: 0
        })

        const buyInputRef = useRef<HTMLInputElement>(null)
        const sellInputRef = useRef<HTMLInputElement>(null)

        const t = useLanguage()
        useEffect(() => {
            getUserSetting()
        }, [])
        const getUserSetting = async () => {
            setLoading({
                ...loading,
                initLoading: true
            })
            const { buySlippage, sellSlippage, priority, antiMEV } = await reqGetUserSetting()
            setSlip({
                buy: buySlippage,
                sell: sellSlippage
            })
            setTransMode(priority == 1 ? "fast" : "turbo")
            setIsMevCheck(antiMEV == 2)
            setLoading({
                ...loading,
                initLoading: false
            })
        }

        const handleTransModeChange = async (transMode: "fast" | "turbo") => {
            setLoading({
                ...loading,
                transModeLoading: true
            })

            try {
                await reqSetPriority({ type: transMode == "fast" ? 1 : 2 })
                setTransMode(transMode)
                setLoading({
                    ...loading,
                    transModeLoading: false
                })
            } catch (error) {
                setLoading({
                    ...loading,
                    transModeLoading: false
                })
            }
        }
        const changeSlip = async (type: 1 | 2) => {
            await reqSetSlippage({ type, value: type == 1 ? slip.buy : slip.sell })
        }

        const handleMevSwitchChange = async (check: boolean) => {
            setLoading({
                ...loading,
                mevLoading: true
            })
            try {
                const mevReulst = await reqUserSetAntiMev({
                    type: check ? 1 : 2
                })
                setIsMevCheck(!isMevCheck)
                setLoading({
                    ...loading,
                    mevLoading: false
                })
            } catch (error) {

            }
        }

        const handleChangeLanguage = (langauge: ELanguage) => {
            setLanguage(langauge)
        }

        return <div className=' mx_flex mx_justify-between mx_gap-4 mx_flex-col mx_text-black mx_px-4'>
            <SettingPageTitle>
                {t?.setting?.walletSetting}
            </SettingPageTitle>
            <Button className='mx_w-full !mx_rounded-xl' variant='contained' onClick={() => { settingPageTo(ESettingPageRoute.WALLET_SETTING) }}>
                {t?.setting?.walletSetting}
            </Button>
            <SettingPageTitle>{t?.setting?.slippageConfig}</SettingPageTitle>
            <div className='mx_flex mx_justify-between mx_gap-4'>
                <div className='mx_w-full mx_px-4 mx_text-lg mx_p-2 mx_bg-[#FFF3E2] mx_flex mx_justify-between mx_rounded-xl mx_cursor-text' onClick={() => {
                    buyInputRef.current?.focus()
                }}>
                    <p className=' mx_font-bold mx_text-sm mx_my-auto mx_uppercase mx_text-black'>{t?.setting?.buy}:</p>
                    <div className='mx_flex'>
                        <input
                            type="text"
                            placeholder='X'
                            className='focus:mx_outline-none mx_text-sm active:mx_outline-none mx_bg-transparent focus:mx_ring-0 mx_text-right placeholder:mx_text-right mx_text-black placeholder:mx_text-[#A3A3A3] mx_w-8 mx_my-auto'
                            value={slip.buy}
                            onBlur={() => changeSlip(1)}
                            ref={buyInputRef}
                            onChange={(e) => {
                                setSlip({
                                    ...slip,
                                    buy: Number(e.target.value.trim())
                                })
                            }}
                        />
                        <span className={`${slip.buy ? "mx_text-black" : "mx_text-[#A3A3A3]"} mx_text-sm mx_my-auto`}
                        >
                            %
                        </span>
                    </div>
                    <img className='mx_w-5 mx_flex mx_h-6 mx_my-0' src={EditIcon} />
                </div>
                <div className='mx_w-full mx_text-lg mx_px-4 mx_p-2 mx_bg-[#FFF3E2] mx_flex mx_justify-between mx_rounded-xl mx_cursor-text' onClick={() => {
                    sellInputRef.current?.focus()
                }}>
                    <p className=' mx_font-bold mx_text-sm mx_my-auto mx_uppercase mx_text-black'>{t?.setting?.sell}:</p>
                    <div className='mx_flex'>
                        <input
                            type="text"
                            placeholder='X'
                            className='focus:mx_outline-none mx_text-sm active:mx_outline-none mx_bg-transparent focus:mx_ring-0 mx_text-right placeholder:mx_text-right placeholder:mx_text-[#A3A3A3] mx_w-8 mx_text-black'
                            value={slip.sell}
                            onBlur={() => changeSlip(2)}
                            ref={sellInputRef}
                            onChange={(e) => {
                                setSlip({
                                    ...slip,
                                    sell: Number(e.target.value.trim())
                                })
                            }}
                        />
                        <span className={`${slip.sell ? "mx_text-black" : "mx_text-[#A3A3A3]"} mx_text-sm mx_my-auto`} >
                            %
                        </span>
                    </div>
                    <img className='mx_w-5 mx_flex mx_h-6 mx_my-0' src={EditIcon} />
                </div>
            </div>
            <SettingPageTitle>
                {t?.setting?.transactionPriority}
            </SettingPageTitle>
            <div className=' mx_flex mx_justify-between mx_gap-4'>
                <Button className='mx_w-full !mx_rounded-xl !mx_py-2 !mx_text-xs mx_group' onClick={() => handleTransModeChange("fast")} variant={transMode == "fast" ? "contained" : "outlined"}>
                    <img src={transMode == "fast" ? FastFocusIcon : FastIcon} className='mx_w-4 mx_h-4 mx_mr-4 mx_text-white group-hover:mx_hidden mx_block' alt="" />
                    <img src={FastFocusIcon} className='mx_w-4 mx_h-4 mx_mr-4 group-hover:mx_block mx_hidden mx_text-white' alt="" />
                    {t?.setting?.fast}
                </Button>
                <Button className='mx_w-full !mx_rounded-xl !mx_py-2 !mx_text-xs mx_group' onClick={() => handleTransModeChange("turbo")} variant={transMode == "turbo" ? "contained" : "outlined"}>
                    <img src={transMode == "turbo" ? TurboFocusIcon : TurboIcon} className='mx_w-4 mx_h-4 mx_mr-4 mx_text-white group-hover:mx_hidden mx_block' alt="" />
                    <img src={TurboFocusIcon} className='mx_w-4 mx_h-4 mx_mr-4 group-hover:mx_block mx_hidden mx_text-white' alt="" />
                    {t?.setting?.turbo}
                </Button>
            </div>
            <SettingPageTitle>
                {t?.setting?.mev}
            </SettingPageTitle>
            <div className=' mx_flex mx_justify-between mx_gap-4 '>
                <Button className='mx_w-full !mx_rounded-xl !mx_text-xs !mx_py-2 mx_group' onClick={() => handleMevSwitchChange(false)} variant={isMevCheck ? "contained" : "outlined"}>
                    <img src={isMevCheck ? TurboFocusIcon : TurboIcon} className='mx_w-4 mx_h-4 mx_mr-1 mx_text-white group-hover:mx_hidden mx_block' alt="" />
                    <img src={TurboFocusIcon} className='mx_w-4 mx_h-4 mx_mr-1 group-hover:mx_block mx_hidden mx_text-white' alt="" />
                    {t?.setting?.mevSpeedFirst}
                </Button>
                <Button className='mx_w-full !mx_rounded-xl !mx_text-xs !mx_py-2 mx_group' onClick={() => handleMevSwitchChange(true)} variant={!isMevCheck ? "contained" : "outlined"}>
                    <img src={!isMevCheck ? MEVFocusIcon : MEVIcon} className='mx_w-4 mx_scale-125 mx_h-4 mx_mr-1 group-hover:mx_hidden mx_block mx_text-white' alt="" />
                    <img src={MEVFocusIcon} className='mx_w-4 mx_h-4 mx_mr-1 mx_scale-125 group-hover:mx_block mx_hidden mx_text-white' alt="" />
                    {t?.setting?.mevFirst}
                </Button>
            </div>
            <SettingPageTitle>
                {t?.setting?.language}
            </SettingPageTitle>
            <div className=' mx_flex mx_justify-between mx_gap-4'>
                <Button className='mx_w-full !mx_rounded-xl !mx_text-xs !mx_py-2' onClick={() => { handleChangeLanguage(ELanguage.EN) }} variant={language == ELanguage.EN ? "contained" : "outlined"}>English</Button>
                <Button className='mx_w-full !mx_rounded-xl !mx_text-xs !mx_py-2' onClick={() => { handleChangeLanguage(ELanguage.ZH) }} variant={language == ELanguage.ZH ? "contained" : "outlined"}>中文</Button>
            </div>

        </div>
    }


    const WalletSettingContent = () => {
        const [exportPrivateKey, setExportPrivateKey] = useState<boolean>(false)
        const [inputError, setInputError] = useState({
            withDrawValue: false,
            withDrawAddress: false
        })
        const t = useLanguage()
        // 0 init 1 loading 2 right 3 false
        const [withDrawStaus, setWithDrawStatus] = useState<0 | 1 | 2 | 3>(0)
        const { refreshUserBalance } = useUserValue()
        const [withDrawValue, setWithDrawValue] = useState<string>("")
        const [withDrawAddress, setWithDrawAddress] = useState<string>("")
        const [txSignature, setTxSignature] = useState<string>("")
        const [privateKey, setInputPrivateKey] = useState("")
        const handleExportPrivateKey = async () => {
            const { privateKey } = await reqExportPrivateKey()
            setInputPrivateKey(privateKey)
            setExportPrivateKey(true)
        }
        const [miniBalance, setMiniBalance] = useState(0)

        useEffect(() => {
            getMinimumBalance().then(res => {
                setMiniBalance(res > 0.0025 ? res : 0.0025)
            })
        }, [])

        const handleWithdraw = async () => {
            setInputError({
                withDrawValue: Number(withDrawValue) > Number(userValue.balance) || !Number(withDrawValue),
                withDrawAddress: !isValidSolWalletAddress(withDrawAddress) || withDrawAddress !== userValue.address
            })

            if (withDrawAddress.length == 0 || withDrawValue.length == 0) return
            try {
                setWithDrawStatus(1)
                const { txSignature } = await reqUserWithdrawSol({
                    amount: solToLamports(Number(withDrawValue)),
                    address: withDrawAddress
                })
                try {
                    await refreshUserBalance()
                } catch (error) {

                }
                if (txSignature) {
                    setWithDrawStatus(2)
                    setTxSignature(txSignature)
                } else {
                    throw Error("Transaction Error")
                }
            } catch (error) {
                setWithDrawStatus(3)
            }
        }

        const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputError({
                ...inputError,
                withDrawValue: false
            })
            setWithDrawValue(e.target.value.trim())
        }

        const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputError({
                ...inputError,
                withDrawAddress: false
            })
            setWithDrawAddress(e.target.value.trim())
        }

        if (withDrawStaus == 0) {

            return <div className=' mx_flex mx_justify-between mx_gap-4 mx_flex-col mx_text-black mx_mt-4'>
                <CopyToClipboard text={userValue.address} onCopy={() => {
                    toast.success(t?.header?.copy + t?.setting?.address + t?.header?.success)
                }}>
                    <div className=' mx_flex-wrap mx_text-wrap mx_overflow-hidden mx_break-all mx_text-sm mx_text-[#A7A7A7] mx_cursor-pointer'>
                        {t?.setting?.address}:{userValue.address} <img src={CopyIcon} className='mx_ml-1 mx_inline-block mx_cursor-pointer mx_w-3 mx_h-3' alt="" />
                    </div>
                </CopyToClipboard>
                <SettingPageTitle>
                    {t?.setting?.balance}: {formatNumberToUnits(formatToTwoDecimals(Number(userValue.balance), 4))} SOL
                </SettingPageTitle>
                <SettingPageTitle>
                    {t?.setting?.withdraw} Sol
                </SettingPageTitle>
                <div className='mx_flex mx_flex-col mx_gap-4 mx_justify-between'>
                    <div className={`rounded-full mx_w-full mx_border mx_flex mx_justify-between mx_items-center  mx_rounded-full mx_p-2 mx_relative ${inputError.withDrawValue ? " mx_border-red-600" : " mx_border-black/40"}`}>
                        <input type="text" value={withDrawValue} placeholder={inputError.withDrawValue ? t?.setting?.insufficient : t?.setting?.withdraw + ' X SOL'} className={`focus:mx_outline-none active:mx_outline-none mx_bg-transparent focus:mx_ring-0 mx_w-full mx_text-center mx_mx-auto mx_text-base placeholder:mx_text-base mx_ml-4 mx_bg-white mx_text-black ${inputError.withDrawValue ? "placeholder:mx_text-[#FF3D3D]" : "placeholder:mx_text-[#A7A7A7]"}`} onChange={handleValueChange} />
                        <p className='mx_absolute mx_top-3 mx_right-6 mx_cursor-pointer mx_text-primary mx_font-extrabold' onClick={() => {
                            setWithDrawValue(String(Number(userValue.balance) - Number(lamportsToSol(miniBalance))))
                        }}>{t?.setting?.all}</p>
                    </div>
                    <div className={`  mx_w-full mx_border mx_flex mx_justify-between mx_items-center mx_rounded-full mx_p-2 ${inputError.withDrawAddress ? "mx_border-red-600" : "mx_border-black/40"}`}>
                        <input type="text" value={withDrawAddress} placeholder={inputError.withDrawAddress ? t?.setting?.address + " " + t?.header?.error : t?.setting?.inputAddress} className={`focus:mx_outline-none active:mx_outline-none mx_bg-transparent focus:mx_ring-0 mx_w-full mx_text-center mx_mx-auto mx_text-base placeholder:mx_text-base mx_ml-4 mx_bg-white mx_text-black  ${inputError.withDrawAddress ? "placeholder:mx_text-[#FF3D3D]" : "placeholder:mx_text-[#A7A7A7]"}`} onChange={handleAddressChange} />
                    </div>
                    <Button className=' mx_w-full !mx_rounded-xl' variant='contained' onClick={handleWithdraw}>
                        {t?.setting?.withdraw}
                    </Button>
                </div>
                <div className='mx_mt-8'>
                    <SettingPageTitle >
                        {t?.setting?.exportPrivateKey}
                    </SettingPageTitle>
                    {!exportPrivateKey && <Button className='!mx_mt-4 mx_w-full !mx_rounded-xl' variant='contained' onClick={handleExportPrivateKey}>
                        {t?.setting?.exportPrivateKey}
                    </Button>}
                </div>
                {
                    exportPrivateKey && <CopyToClipboard text={privateKey} onCopy={() => {
                        toast.success(t?.header?.copy + t?.setting?.privateKey + t?.header?.success)
                    }}>
                        <p className="mx_text-black mx_flex-wrap mx_text-left mx_break-all mx_cursor-pointer">
                            {privateKey} <img src={CopyIcon} className='mx_ml-1 mx_inline-block mx_cursor-pointer mx_w-3 mx_h-3' alt="" />
                        </p>
                    </CopyToClipboard>
                }
            </div>
        } else if (withDrawStaus == 1) {
            return <div className=' mx_flex mx_justify-start mx_flex-col mx_p-8 mx_mt-4'>
                <Loading />
                <p className='mx_text-center mx_mt-6 mx_text-base mx_font-semibold mx_text-primary mx_italic'>{t?.trade?.confirming}</p>
            </div>
        } else if (withDrawStaus == 2) {
            return <div className='mx_mt-4'>
                <Success />
                <p onClick={
                    () => chrome.tabs.create({ url: `https://solscan.io/tx/${txSignature}` })
                } className=' mx_cursor-pointer mx_text-[#0075FF] mx_italic mx_underline mx_underline-offset-4 mx_text-center mx_mt-6 mx_font-bold mx_text-lg'>{t?.trade?.confirmed}</p>
            </div>
        } else if (withDrawStaus == 3) {
            return <div className='mx_mt-4 mx_flex mx_justify-start mx_flex-col mx_p-8'>
                <div className='mx_mx-auto'>
                    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.4">
                            <path d="M62.5108 19.4545C64.7417 23.8186 66 28.7623 66 34C66 51.6731 51.6731 66 34 66C16.3269 66 2 51.6731 2 34C2 16.3269 16.3269 2 34 2C38.2436 2 42.2943 2.82603 46 4.32607C47.6485 4.99336 49.2287 5.79402 50.7273 6.71469" stroke="#444444" stroke-width="4" stroke-linecap="round" />
                            <path d="M23.0001 23L44.8183 44.8182" stroke="#444444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M44.8185 23L23.0003 44.8182" stroke="#444444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>
                </div>
                <p className='mx_text-black mx_italic mx_mt-3 mx_text-center'>{t?.trade?.failed}</p>
            </div>
        }
    }



    return (
        <article>
            <SettingPageHead />
            <SettingPage />
        </article>
    )
}
