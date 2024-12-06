
import { SVGProps } from 'react'
const TopMask = (props: SVGProps<SVGSVGElement>) => (
    <div className="mx_absolute mx_top-0 mx_left-0 mx_z-0">
        <svg width="513" height="150" viewBox="0 0 513 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_20_257" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0"
                width="513" height="150">
                <rect width="513" height="150" rx="18" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_20_257)">
                <path
                    d="M420.533 -36.4236L328.22 54.1988L281.261 5.64469C277.793 2.0547 272.067 1.97536 268.5 5.44635L243.753 29.4259C240.167 32.8969 240.067 38.6289 243.555 42.2189L320.948 122.25C324.435 125.86 330.181 125.919 333.768 122.409L457.288 1.10266C460.854 -2.38816 460.913 -8.12023 457.406 -11.6904L433.293 -36.2848C429.806 -39.8549 424.079 -39.9144 420.513 -36.4038L420.533 -36.4236Z"
                    fill="url(#paint0_linear_20_257)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_20_257" x1="333.992" y1="118.946" x2="288.491"
                    y2="25.5046" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC672" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#FFA015" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    </div>
)
export default TopMask
