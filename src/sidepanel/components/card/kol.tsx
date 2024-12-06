import React, { Suspense } from 'react'
import SolanaIcon from '../assets/solana.svg'
import TokenLogo from './tokenLogo'
import ProfitSpan from '../../../components/ProfitSpan'
import { formatNumberToUnits, formatToTwoDecimals } from '../../../utils'
import TokenTrade from './tokenTrade'

export default function KolCard({ kolInfo }: { kolInfo: IKolListInfo }) {
    return (
        <div>
            <div className=' mx_flex mx_justify-start'>
                <div className='mx_flex mx_justify-start mx_cursor-pointer'>
                    <TokenLogo logo={kolInfo.image} name={kolInfo.name} />
                </div>
                <div className=' mx_flex mx_justify-start mx_flex-col mx_text-left mx_text-sm mx_text-black mx_font-semibold mx_ml-6'>
                    <div className='mx_w-full mx_justify-between mx_flex'>
                        <p className=''>KOLs:{kolInfo.kolCurrentNum}/{kolInfo.kolNum}</p>
                        <p className='mx_text-[#A7A7A7]'>{kolInfo.kolNames}</p>
                    </div>
                    <p>SELL/BUY:<ProfitSpan profit={kolInfo.kolTotalSell / kolInfo.kolTotalBuy}>
                        {formatNumberToUnits(formatToTwoDecimals(kolInfo.kolTotalSell))}/{formatNumberToUnits(formatToTwoDecimals(kolInfo.kolTotalBuy))}= {formatToTwoDecimals(kolInfo.kolTotalSell / kolInfo.kolTotalBuy * 100)}%
                    </ProfitSpan></p>
                    <p>
                        Net Buys: <ProfitSpan profit={kolInfo.netBuy}>
                            + {formatNumberToUnits(formatToTwoDecimals(kolInfo.netBuy))} SOL
                        </ProfitSpan>
                    </p>
                    <p>
                        Avg Profit: <ProfitSpan profit={kolInfo.avgProfit}>
                            {formatToTwoDecimals(kolInfo.avgProfit * 100)}%
                        </ProfitSpan>
                    </p>
                    <p>
                        Mcap:{formatNumberToUnits(formatToTwoDecimals(kolInfo.mcap))} @
                        <span className='mx_text-[#A7A7A7]'>
                            ${
                                formatNumberToUnits(formatToTwoDecimals(kolInfo.price))
                            }
                        </span>
                    </p>
                    <p>
                        5M: <ProfitSpan profit={kolInfo.priceChange.five_min}>
                            {formatToTwoDecimals(kolInfo.priceChange.five_min)}%
                        </ProfitSpan>
                        1H: <ProfitSpan profit={kolInfo.priceChange.one_hour}>
                            {formatToTwoDecimals(kolInfo.priceChange.one_hour)}%
                        </ProfitSpan>
                        6H: <ProfitSpan profit={kolInfo.priceChange.six_hour}>
                            {formatToTwoDecimals(kolInfo.priceChange.six_hour)}%
                        </ProfitSpan>
                    </p>
                </div>
            </div>
            <TokenTrade
                isBuy
                tokenValue={{
                    fromTokenSymbol: 'SOL',
                    pool: kolInfo.pair,
                    address: kolInfo.address,
                    name: kolInfo.name,
                    logo: kolInfo.image,
                    profitPersend: 0,
                    profitValue: 0,
                    value: 0,
                    valueUsd: 0,
                    mcap: String(kolInfo.mcap),
                    volume: "0",
                    tokenPrice: String(kolInfo.price),
                    initialSol: 0,
                    initialUsd: 0,
                    balance: "0",
                    five_min: kolInfo.priceChange.five_min,
                    one_hour: kolInfo.priceChange.one_hour,
                    six_hour: kolInfo.priceChange.six_hour,
                    type: "",
                    decimals: kolInfo.decimal,
                    pair: kolInfo.pair,
                    holder: 0,
                }}
            />
        </div>

    )
}
