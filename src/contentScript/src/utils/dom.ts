import { PublicKey } from "@solana/web3.js"
import { Platform_URL } from "../../../constant/platform"
import { isValidSolAddress } from "../../../utils"
import { getDomWithXPath } from "../../../utils/dom"
import { getConnection } from "../../../utils/sol/transaction"

export const getTokenAddress = (hostname: string) => {
    const platform = Platform_URL.find((item) => item.regex.test(hostname))
    if (platform?.xlinkXpath) {
        const tokenAddressDom = getDomWithXPath<HTMLSpanElement>(platform.xlinkXpath)
        return tokenAddressDom?.title || ""
    }
    return ""
}


export const getTokenValueForDexscreener = (location: Location) => {
    const platform = Platform_URL.find((item) => item.regex.test(location.hostname))
    let tokenValue = {
        pair: "",
        logo: "",
        ticker: ""
    }
    if (platform?.logoXpath) {
        const logoDom = getDomWithXPath<HTMLImageElement>(platform.logoXpath)
        tokenValue.logo = logoDom?.src || ""
    }
    if (platform?.tickerXpath) {
        const tickerDom = getDomWithXPath<HTMLSpanElement>(platform.tickerXpath)
        tokenValue.ticker = tickerDom?.textContent || ""
    }
    tokenValue.pair = getTokenAddressFromUrl(location.href)
    return tokenValue
}

export const getTokenAddressFromUrl = (url: string) => {
    const urlArr = url.split("/")
    if (isValidSolAddress(urlArr[urlArr.length - 1])) {
        return urlArr[urlArr.length - 1]
    }
    return ""
}


export async function getTokenInfoWithSolana(tokenMintAddress: string): Promise<{ decimals: number; totalSupply: number; }> {
    try {
        const connection = getConnection()
        const mintPublicKey = new PublicKey(tokenMintAddress);
        const tokenAccountInfo = await connection.getAccountInfo(mintPublicKey);
        if (!tokenAccountInfo) {
            throw new Error(`can not get token value: ${tokenMintAddress}`);
        }

        const data = tokenAccountInfo.data;
        const decimals = data[44];
        const totalSupply = Number("0x" + data.slice(32, 40).toString("hex"));
        return { decimals, totalSupply };
    } catch (error) {
        throw error;
    }
}