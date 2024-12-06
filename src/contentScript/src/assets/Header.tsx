import React from 'react'

export default function Header() {
    return (
        <div className=' mx_scale-[0.7826] mx_origin-top-left'>
            <svg width="460" height="92" viewBox="0 0 460 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12C0 5.37259 5.37258 0 12 0H448C454.627 0 460 5.37258 460 12V80C460 86.6274 454.627 92 448 92H12C5.3726 92 0 86.6274 0 80V12Z" fill="#FD9A09" />
                <mask id="mask0_1173_2699" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="460" height="82">
                    <path d="M0 10C0 4.47715 4.47715 0 10 0H450C455.523 0 460 4.47715 460 10V82H0V10Z" fill="#FD9A09" />
                </mask>
                <mask id="mask1_1173_2699" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="119" y="0" width="220" height="72">
                    <rect x="119" width="220" height="72" rx="18" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask1_1173_2699)">
                    <path d="M302.148 -16.2405L239.341 45.648L207.392 12.4891C205.033 10.0374 201.137 9.98323 198.71 12.3537L181.873 28.7299C179.433 31.1003 179.366 35.0149 181.738 37.4666L234.394 92.1219C236.766 94.5871 240.676 94.6277 243.116 92.2302L338.52 -3.38585C340.947 -5.76982 340.987 -9.68441 338.601 -12.1226L322.195 -28.9187C319.822 -31.3569 315.927 -31.3975 313.5 -29L302.148 -16.2405Z" fill="url(#paint0_linear_1173_2699)" />
                </g>
                <path d="M0 85C0 77.8203 5.8203 72 13 72H447C454.18 72 460 77.8203 460 85V92H0V85Z" fill="white" />
                <g filter="url(#filter1_d_1173_2699)">
                    <path d="M418.012 28C417.756 28 417.488 28.086 417.293 28.281C416.902 28.672 416.902 29.328 417.293 29.719L423.574 36L417.293 42.281C416.902 42.672 416.902 43.328 417.293 43.719C417.683 44.109 418.34 44.109 418.73 43.719L425.012 37.438L431.293 43.719C431.683 44.109 432.34 44.109 432.73 43.719C433.121 43.328 433.121 42.672 432.73 42.281L426.449 36L432.73 29.719C433.121 29.328 433.121 28.672 432.73 28.281C432.535 28.086 432.267 28 432.012 28C431.756 28 431.488 28.086 431.293 28.281L425.012 34.562L418.73 28.281C418.535 28.086 418.268 28 418.012 28Z" fill="white" />
                </g>
                <defs>
                    <filter id="filter0_f_1173_2699" x="111.078" y="-186" width="478.716" height="357" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_1173_2699" />
                    </filter>
                    <filter id="filter1_d_1173_2699" x="413" y="26" width="24.0234" height="24.0117" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.982568 0 0 0 0 0.597903 0 0 0 0 0 0 0 0 0.5 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1173_2699" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1173_2699" result="shape" />
                    </filter>
                    <linearGradient id="paint0_linear_1173_2699" x1="243" y1="75" x2="234.765" y2="-1.97482" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white" stop-opacity="0.2" />
                        <stop offset="1" stop-color="white" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>

        </div>
    )
}
