import React from 'react'
import LoadingIcon from '../../contentScript/src/assets/loading'

export default function Loading() {
    return (
        <div className=' mx_w-full mx_h-full mx_flex'>
            <div className='mx_w-fit mx_h-fit mx_m-auto'>
                <LoadingIcon />
            </div>
        </div>
    )
}
