
import React from 'react'

export default function TokenCardSkeleton() {
    return <div className=' mx_my-4  hover:mx_bg-black/5 mx_rounded-xl'>
        <div className='mx_flex mx_justify-start'>
            <div className='mx_flex mx_flex-col mx_text-center mx_justify-between'>
                <div className='mx_relative mx_m-auto'>
                    <div className=' mx_skeleton mx_w-16 mx_h-16 mx_my-auto mx_overflow-hidden mx_rounded-full' />
                </div>
                <p className='mx_skeleton mx_w-full mx_h-5 mx_mt-2' />
            </div>
            <div className='mx_text-left mx_ml-6 mx_flex-1 mx_justify-between mx_h-full'>
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
                <p className='mx_skeleton mx_w-3/4 mx_h-3 mx_my-2' />
            </div>
        </div>
    </div>
}
