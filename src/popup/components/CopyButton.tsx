import { SVGProps } from 'react'
export const CopyButton = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      fill="#fff"
      d="M11.768 18.23H3.6a1.58 1.58 0 0 1-1.633-1.633V8.43a1.58 1.58 0 0 1 1.633-1.633h3.267V3.531a1.58 1.58 0 0 1 1.633-1.634h8.167A1.58 1.58 0 0 1 18.3 3.531v8.166a1.58 1.58 0 0 1-1.633 1.633H13.4v3.267a1.58 1.58 0 0 1-1.633 1.633ZM3.6 8.43v8.167h8.167V13.33H8.5a1.58 1.58 0 0 1-1.633-1.633V8.43H3.601Zm4.9-4.9v8.167h8.167V3.53H8.5Z"
    />
  </svg>
)
