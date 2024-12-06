import React, { HTMLAttributes, useRef, useState } from 'react'
import LoadingIcon from '../../assets/loading.svg'
import { useInViewport } from 'ahooks'


interface IScrollPageProps extends HTMLAttributes<HTMLDivElement> {
    loading: boolean
    onNextPage?: () => void
}

export default function ScrollList(props: IScrollPageProps) {
    const scrollPageTag = useRef<HTMLParagraphElement>(null)
    // load more when scroll to bottom
    useInViewport(scrollPageTag, {
        callback: (entry) => {
            if (entry.isIntersecting) {
                if (props.onNextPage) {
                    props?.onNextPage()
                }
            }
        }
    })
    return (
        <div>
            {
                props.children
            }
            {
                (props.loading) && <img src={LoadingIcon} className=' mx_w-8 mx_h-8 mx_repeat-infinite mx_animate-spin mx_mx-auto' />
            }
            <p className=' mx_w-full mx_absolute mx_bottom-20 mx_h-4' ref={scrollPageTag} />
        </div>
    )
}
