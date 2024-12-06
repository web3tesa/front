import { BASE_TOKEN_INFO } from "../../constant/nsp";
import { reqTokenInfo } from "../../service/coin";
import { reqcoinDexScreenerCoin } from "../../service/cors";






export const solToLamports = (sol: number): string => {
    return String(Math.floor(sol * 1000000000));
}

export const tokenForDecimalsToLamports = (num: number, decimals: number): string => {
    return String(Math.floor(num * Math.pow(10, decimals)));
}

export const tokenForLamportsToDecimals = (num: number, decimals: number): number => {
    return num / Math.pow(10, decimals)
}

export const lamportsToSol = (lamports: number): string => {
    return String(lamports / 1000000000);
}


export const getTokenPriceChange = async (tokenAddress: string) => {
    const tokenPriceReq = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`, {
        method: "GET"
    })
    const tokenPriceData = await tokenPriceReq.json()
    const tokenPriceChange = {
        m5: tokenPriceData.pairs[0].priceChange.m5,
        h1: tokenPriceData.pairs[0].priceChange.h1,
        h6: tokenPriceData.pairs[0].priceChange.h6,
        h24: tokenPriceData.pairs[0].priceChange.h24,
        tokenName: tokenPriceData.pairs[0].baseToken.symbol,
        tokenImage: tokenPriceData.pairs[0].info.imageUrl,
    }
    return tokenPriceChange
}

export const getTokenInfoForDexScreener = async (tokenAddress: string): Promise<ITokenListItem> => {
    const result = BASE_TOKEN_INFO
    const { pairs } = await reqcoinDexScreenerCoin({ coin: tokenAddress })
    let tokenInfo = {} as IResTokenInfoForDexscreenerListItem
    pairs.forEach((item, index) => {
        if (item.dexId == "raydium" && item.chainId == "solana" && !item?.label?.includes("cpmm")) {
            if (!tokenInfo?.liquidity?.base || item.liquidity.base > tokenInfo?.liquidity?.base) {
                tokenInfo = { ...item }
            }
        }
    })
    console.log("token info is", tokenInfo);

    result.name = tokenInfo.baseToken.symbol
    result.logo = tokenInfo.info.imageUrl
    result.type = ""
    result.address = tokenInfo.baseToken.address
    result.pair = tokenInfo.pairAddress
    result.pool = tokenInfo.pairAddress
    result.price = tokenInfo.priceNative
    result.tokenPrice = tokenInfo.priceUsd
    result.five_min = tokenInfo.priceChange.m5
    result.one_hour = tokenInfo.priceChange.h1
    result.six_hour = tokenInfo.priceChange.h6
    const endGetTokenTime = new Date().getTime()
    
    return result
}

