import { request } from "../utils/request"

export const reqTokenList = async ({ pageNum, pageSize }: { pageNum: number, pageSize: number }): Promise<ITokenCoinListRes> => {
    return await request.get('/api/v1/query/coin/list', {
        pageNum,
        pageSize
    })
}

export const reqTokenBuy = async (params: { coin: string, pool: string, amount: string, decimal: number }): Promise<ITokenBuyRes> => {
    return await request.post('/api/v1/buy', {
        ...params
    })
}

export const reqTokenSell = async (params: { coin: string, pool: string, amount: string, decimal: number }): Promise<ITokenSellRes> => {
    return await request.post('/api/v1/sell', {
        ...params
    })
}

export const reqTransInfo = async (params: { txSignature: string }): Promise<ITokenTxInfoRes> => {
    return await request.get('/api/v1/query/tx/info', {
        txSignature: params.txSignature
    })
}


export const reqTokenInfo = async (params: { coin: string }): Promise<ICoinInfoRes> => {
    return await request.get('/api/v1/query/coin/info', {
        coin: params.coin
    })
}

export const reqTokenSimpleInfo = async (params: { coin: string }): Promise<ITokenSimpleInfoRes> => {
    return await request.get('/api/v1/query/coin/simple_info', {
        coin: params.coin
    })
}

export const reqTokenInfoWithName = async (params: { coin: string }): Promise<ICoinInfoRes> => {
    return await request.get('/api/v1/query/coin/info2', {
        coin: params.coin
    })
}

export const reqTokenProfit = async (params: { coin: string }): Promise<ITokenCoinProfitRes> => {
    return await request.get('/api/v1/query/coin/profit', {
        coin: params.coin
    })
}


export const reqTokenProfitList = async ({ coinAddresses }: { coinAddresses: string }): Promise<ITokenCoinProfitListRes> => {
    return await request.get('/api/v1/query/profit/list', {
        coins: coinAddresses
    })
}


export const reqSmartMoneyList = async ({ pageNum, pageSize }: { pageNum: number, pageSize: number }): Promise<IReqList<IReqSmCoinInfo>> => {
    return new Promise((res, rej) => {
        res({
            total: 1,
            list: [{
                address: "H5pgAdccVBEebdKKVFwi2gTc86GZVjSefiuxHRA8a9gA",
                pair: "eepmkkb5kgche14yilwv9o5zmb7siiahxnxj6tzzrbe",
                name: "WDOG",
                image: "https://witcherdog.xyz/wp-content/uploads/2024/08/p2.png",
                kolNum: 20,
                kolCurrentNum: 15,
                kolNames: "cas,casgod,cas_daddy",
                kolTotalBuy: 1000,
                kolTotalSell: 100,
                netBuy: 900,
                avgProfit: 0.05,
                totalSupply: 999999998.3620212,
                decimal: 9
            }]
        })
    })
}
