import { HTMLAttributes, useEffect, useMemo } from 'react'

import SettingIcon from "../assets/setting.svg"
import HomeIcon from "../assets/home.svg"
import WalletCommad from './walletCommad'
import { useRouter, useUserIsLogin, useUserValue } from '../hooks'
import { ERouter, WITHOUT_USER_ROUTER } from '../provider/router'
import CheckImg from "../assets/check.png"
import BgImg from "../assets/bg.png"
import ReferIcon from "../assets/refer.svg"
import OrderHistoryIcon from "../assets/order_history.svg"
import { toast } from 'react-toastify'
import { VITE_DEV_MODE } from '../../constant/env'

// without header's router
const WITHOUT_HEADER_ROUTER: ERouter[] = [ERouter.SETTING, ERouter.INIT, ERouter.SIGN_MESSAGE, ERouter.REFER]

interface ISidePanelLayoutProps extends HTMLAttributes<HTMLDivElement> {
}

export default function SidePanelLayout(props: ISidePanelLayoutProps) {
    const { router } = useRouter()
    const { userValue } = useUserValue()
    const { isLogin } = useUserIsLogin()
    // const [refreshTokenListLoading, setRefreshTokenListLoading] = useState(false)
    // const { setIsRefreshTokenList } = useRefreshTokenList()

    const isWithoutHeader = useMemo(() => {
        return WITHOUT_HEADER_ROUTER.includes(router.path)
    }, [router.path])
    const handleLayoutRouterChange = (route: ERouter) => {
        if (isLogin || WITHOUT_USER_ROUTER.includes(route)) {
            router.to(route)
        } else {
            toast.error("Please Login First")
        }
    }

    const HeaderIconBar = () => {
        const iconClass = 'mx_w-5 hover:mx_scale-105 active:mx_scale-95 mx_cursor-pointer mx_transition-all mx_my-auto'
        return <div className=' mx_flex mx_justify-start mx_gap-4  '>
            <img src={HomeIcon} alt="" className={iconClass} onClick={() => handleLayoutRouterChange(ERouter.DASHBOARD)} />
            <img src={SettingIcon} className={iconClass} onClick={() => handleLayoutRouterChange(ERouter.SETTING)} />
            <img src={OrderHistoryIcon} className={iconClass} alt="" onClick={() => handleLayoutRouterChange(ERouter.ORDER_HISTORY)} />
            {
                VITE_DEV_MODE == "development" &&
                <p className='mx_text-white mx_text-xl mx_my-auto mx_cursor-pointer' onClick={() => {
                    handleLayoutRouterChange(ERouter.SMART_KOLS)
                }}>
                    P
                </p>
            }
        </div>
    }

    return (
        <div>
            {
                isWithoutHeader ?
                    <div className='mx_bg-white mx_w-full mx_h-screen mx_flex mx_flex-col mx_text-black mx_relative'>
                        <header className='mx_w-full mx_flex mx_justify-between mx_relative'>
                            <img src={BgImg} className='mx_w-full  mx_my-auto' />
                            <img src={CheckImg} className='mx_w-[130px] mx_left-[102px] mx_top-0 mx_my-auto mx_absolute' />
                            <div className='mx_w-full mx_absolute mx_left-0 mx_top-0 mx_flex mx_justify-between mx_h-2/3 mx_px-4'>
                                <HeaderIconBar />
                                <div className=' mx_flex mx_gap-1 mx_my-auto hover:mx_scale-105 active:mx_scale-95 mx_cursor-pointer mx_transition-all' onClick={() => handleLayoutRouterChange(ERouter.REFER)}>
                                    <img src={ReferIcon} className='mx_w-5   mx_my-auto' />
                                    <p className=' mx_text-xs mx_text-white mx_font-semibold'>
                                        Refer
                                    </p>
                                </div>
                            </div>
                        </header>
                        <article className=' mx_absolute mx_top-10 mx_border mx_w-full mx_flex-1 mx_overflow-scroll mx_rounded-xl mx_p-4  mx_bg-white mx_h-[calc(100%-2.5rem)]'>
                            {props.children}
                        </article>
                    </div>
                    :
                    <div className='mx_bg-white mx_w-full mx_h-screen mx_flex mx_flex-col mx_text-black mx_relative'>
                        <header className='mx_w-full mx_flex mx_justify-between mx_relative'>
                            <img src={BgImg} className='mx_w-full  mx_my-auto' />
                            <img src={CheckImg} className='mx_w-[130px] mx_left-[102px] mx_top-0 mx_my-auto mx_absolute' />
                            <div className='mx_w-full mx_absolute mx_left-0 mx_top-0 mx_flex mx_justify-between mx_h-2/3 mx_px-4'>
                                <HeaderIconBar />
                                <div className=' mx_flex mx_gap-1 mx_my-auto hover:mx_scale-105 active:mx_scale-95 mx_cursor-pointer mx_transition-all' onClick={() => handleLayoutRouterChange(ERouter.REFER)}>
                                    <img src={ReferIcon} className='mx_w-5   mx_my-auto' />
                                    <p className=' mx_text-xs mx_text-white mx_font-semibold'>
                                        Refer
                                    </p>
                                </div>
                            </div>
                        </header>
                        <article className=' mx_absolute mx_top-10 mx_border mx_w-full mx_flex-1 mx_overflow-scroll mx_rounded-xl  mx_bg-white mx_h-[calc(100%-2.5rem)]'>
                            <div className='mx_h-full mx_flex mx_flex-col mx_p-4'>
                                {userValue?.address && <div className=''>
                                    <div className='mx_flex mx_justify-between'>
                                        <div className=''>
                                            <WalletCommad />
                                        </div>
                                    </div>
                                </div>}
                                <div className='h-1 mx_border-b mx_-mx-4 mx_mt-4 mx_border-[#e4e4e4]' />
                                <div className=' mx_overflow-scroll mx_flex-1 mx_relative'>
                                    {props.children}
                                </div>
                                {/* {userValue?.address && <div className='mx_py-4 mx_grid-cols-4 mx_gap-2 mx_grid'>
                                    <Button variant='contained' size='small' className='mx_text-white mx_min-w-0 !mx_text-[10px] !mx_py-2 !mx_font-semibold !mx_leading-3 mx_text-wrap'>Trading Bot</Button>
                                    <Button variant='contained' size='small' className='mx_text-white mx_min-w-0 !mx_text-[10px] !mx_py-2 !mx_font-semibold !mx_leading-3'>Bridge Swap</Button>
                                    <Button variant='contained' size='small' className='mx_text-white mx_min-w-0 !mx_text-[10px] !mx_py-2 !mx_font-semibold !mx_leading-3'>...</Button>
                                    <Button variant='contained' size='small' className='mx_text-white mx_min-w-0 !mx_text-[10px] !mx_py-2 !mx_font-semibold !mx_leading-3' onClick={handleSetting}>Setting</Button>
                                </div>} */}
                            </div>
                        </article>
                    </div>}
        </div>
    )
}


