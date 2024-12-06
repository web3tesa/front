import React, { ReactNode } from 'react'

interface IMxCard extends React.HTMLAttributes<HTMLDivElement> {
    orider?: number
}

export default function MxCard(props: IMxCard): ReactNode {
    const orderColorList = ["#FF6B00", "#FFA015", "#FFCC15", "#fcf150"]
    return (
        <div {...props} className={`mx_bg-mx_card_bg mx_border-mx_primary/50 mx_shadow-sm mx_shadow-mx_primary/20 mx_border mx_relative mx_w-full mx_p-4 mx_rounded-xl ${props.className}`}>
            {
                props?.orider && <div className={`mx_rounded-tl-xl mx_py-0.5 mx_rounded-br-xl mx_absolute mx_-top-1 mx_-left-1 mx_italic mx_text-white mx_font-extrabold mx_text-lg mx_px-2 mx_shadow-sm`}
                    style={{
                        backgroundColor: props.orider > 3 ? orderColorList[orderColorList.length - 1] : orderColorList[props?.orider - 1]
                    }}
                >
                    {props?.orider}
                </div>
            }
            {props.children}
        </div>
    )
}
