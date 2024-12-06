import React, { HTMLAttributes } from 'react'
import LoadingIcon from "../assets/loading.png"


interface ILoadingProps extends HTMLAttributes<HTMLDivElement> { }
export default function Loading(props: ILoadingProps) {
    return (
        <div {...props} className={"mx_w-full mx_flex " + props.className}>
            <img src={LoadingIcon} className='mx_w-16 mx_mx-auto mx_animate-spin' />
        </div>
    )
}
