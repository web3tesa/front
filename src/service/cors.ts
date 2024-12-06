import { request } from "../utils/request"

// export const reqcoinDexScreenerProfit = ({ coin }: { coin: string }) => {
//     return request.get('', {
//         coin
//     }, `https://api.dexscreener.com/latest/dex/tokens/${coin}`)
// }
export const reqcoinDexScreenerCoin = ({ coin }: { coin: string }): Promise<IDexScreenerTokenInfoRes> => {
    return request.get('', {
        coin
    },
        `https://api.dexscreener.com/latest/dex/tokens/${coin}`
    )
}