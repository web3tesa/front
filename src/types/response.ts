interface IEmptyResponse {

}

interface ISignatureRes {
    txSignature: string;
}

interface IResUserJWTTOken {
    token: string;
}

interface IImportPrivateKey {
    success: boolean;
}


interface IReqUserAddress {
    address: string
}

interface IExportPrivateKey {
    privateKey: string;
}

interface IDepositToken extends ISignatureRes { }

interface IWithdrawToken extends ISignatureRes { }

interface ISlippageRes extends IEmptyResponse { }

interface IPriorityRes extends IEmptyResponse { }

interface ITokenBuyRes extends ISignatureRes { }

interface ITokenSellRes extends ISignatureRes { }

interface ITokenTxInfoRes {
    inAmount: string;
    inName: string;
    outAmount: string;
    outName: string;
    type: 1 | 2;
}

interface ICoinInfoRes {
    pool: string
    decimal: number
    price: string
    totalSupply: string
    name: string
    image: string
    holders: number
}



interface ITokenCoinProfitRes {
    balance: string
    buyAmount: string
    initial: string
    price: string
    sellAmount: string
    total_supply: string
    value: string
    profit: number
    name: string
    coin: string
    image: string
    pool: string
    period: number
    decimals: number
}

interface ITokenSimpleInfoRes {
    pool: string
    decimal: number
    totalSupply: string
}

interface ITokenCoinProfitListRes {
    list: ITokenProfitListItemRes[]
}


interface ITokenProfitListItemRes {
    profit: number
    coin: string
    price: string
    value: string
}


interface ITokenCoinListRes {
    list: ITokenCoinProfitRes[]
    value: string
    total: number
}

interface ITokenInfoRes extends ICoinInfoRes {
    profit: string
    initail: string
    balance: string
}


interface IGetUserSetting {
    buySlippage: number
    sellSlippage: number
    priority: number
    antiMEV: number
}

interface ITradeHistoryListRes extends IReqList<IGetUserTradeListItem> { }


interface IReqList<T> {
    list: T[]
    total: number
    value?: string
}

interface IGetUserTradeListItem {
    profit: number,
    name: string,
    image: string,
    total_supply: string,
    price: string,
    value: string,
    time: number,
    Action: number,
    hash: string,
    decimal: number
}
interface IReqUserReferValue {
    referCode: string,
    referCount: number,
    referEarn: number
}


interface IDexScreenerTokenInfoRes {
    pairs: IResTokenInfoForDexscreenerListItem[]
    schemaVersion: string
}

interface IReqUserWithdrawHistoryRes {
    list: {
        action: number,
        amount: number,
        tx_hash: string
        time: number
    }[]
    total: number
    value: string
}

interface IResTokenInfoForDexscreenerListItem {
    chainId: string
    dexId: string
    url: string
    label?: string[]
    pairAddress: string
    baseToken: {
        address: string
        name: string
        symbol: string
    }
    quoteToken: {
        address: string
        name: string
        symbol: string
    }
    priceNative: string
    priceUsd: string
    txns: {
        m5: {
            buys: number
            sells: number
        }
        h1: {
            buys: number
            sells: number
        }
        h6: {
            buys: number
            sells: number
        }
        h24: {
            buys: number
            sells: number
        }
    }
    volume: {
        h24: number
        h6: number
        h1: number
        m5: number
    }
    priceChange: {
        m5: number
        h1: number
        h6: number
        h24: number
    }
    liquidity: {
        usd: number
        base: number
        quote: number
    }
    fdv: number
    pairCreatedAt: number
    info: {
        imageUrl: string
        websites: {
            label: string
            url: string
        }[]
        socials: {
            type: string
            url: string
        }[]
    }
}

interface IReqSmCoinInfo {
    address: string
    pair: string
    name: string
    image: string
    kolNum: number
    kolCurrentNum: number
    kolNames: string
    kolTotalBuy: number
    kolTotalSell: number
    netBuy: number
    avgProfit: number
    totalSupply: number
    decimal: number
}

interface IKolListInfo extends IReqSmCoinInfo {
    mcap: number
    price: number
    priceChange: {
        five_min: number
        one_hour: number
        six_hour: number
    }
}