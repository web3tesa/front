import React, { HTMLAttributes } from 'react'


interface IProfitSpanProps extends HTMLAttributes<HTMLSpanElement> {
  profit: number
}

export default function ProfitSpan(props: IProfitSpanProps) {
  return (
    <span {...props} className={props.profit > 0 ? " mx_text-[#1DCE00] " : "mx_text-[#FF3D3D] " + props.className}>
      {props.children}
    </span>
  )
}
