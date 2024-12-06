import React, { Suspense, useEffect, useState } from 'react'
import SolanaIcon from '../../assets/solana.svg'


interface ITokenLogoProps {
    logo: string
    name: string
}

export default function TokenLogo(props: ITokenLogoProps) {

    const [imgIsLoad, setImgIsLoad] = useState<boolean>(false)
    useEffect(() => {
        loadImg(1)
    }, [props.logo])

    const loadImg = (retryNum: number) => {
        if (retryNum < 5) return
        setImgIsLoad(false)
        const img = new Image()
        img.src = props.logo
        img.onload = () => {
            setImgIsLoad(true)
        }
        img.onerror = () => {
            loadImg(retryNum + 1)
        }
    }


    return (
        <div className='mx_flex mx_flex-col mx_text-center mx_justify-between mx_w-20'>
            <div className='mx_relative mx_m-auto'>
                <Suspense fallback={<div className=' mx_skeleton mx_w-12 mx_h-12 mx_my-auto mx_overflow-hidden mx_rounded-full' />}>
                    {
                        imgIsLoad ?
                            <img src={props.logo} className='mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full mx_object-cover' />
                            : <div className=' mx_skeleton mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full' />
                    }
                </Suspense>
                <img src={SolanaIcon} className=' mx_absolute mx_-right-2 mx_w-6 mx_h-6 mx_-bottom-2 mx_bg-white mx_rounded-full mx_overflow-hidden' alt="" />
            </div>
            <p className=' mx_text-black mx_font-bold mx_text-base mx_line-clamp-1 mx_mx-auto mx_w-16'>
                {props.name}
            </p>
        </div>
    )
}
