import { EDexPlatform } from "../types/enum";

export const Platform_URL:IDexPlatformURL[] = [
    {
        name: EDexPlatform.DEXSCREENER,
        url: "dexscreener.com",
        regex: /dexscreener.com/,
        xlinkXpath:`//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[3]/div/div[1]/div[7]/span`,
        logoXpath:`//*[@id="root"]/div/main/div/div/div[1]/div/header/img`,
        tickerXpath:`//*[@id="root"]/div/main/div/div/div[1]/div/div[1]/div[1]/div[1]/div[1]/h2/span[1]/span`
    }
]