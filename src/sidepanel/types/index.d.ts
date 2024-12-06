interface ITokenListItem {
    name: string,
    logo: string,
    type: string,
    address: string,
    pair: string,
    profitValue: number,
    profitPersend: number,
    value: number,
    valueUsd: number,
    mcap: string,
    volume: string,
    tokenPrice: string,
    initialSol: number,
    initialUsd: number,
    five_min: number,
    one_hour: number,
    six_hour: number,
    holder: number
    pool?: string,
    decimals?: number,
    price?: string,
    totalSupply?: string,
    balance?: string,
    fromTokenSymbol?: string
    toTokenSymbol?: string
    period?: number
    transHx?: string
    tokenAmount?: number
    tradeSolAmount?: number
}

interface IUserValue {
    address: string,
    balance: string,
    value: string,
    tokenValue: ITokenListItem[]
}

interface ITradeHistoryListItem{
    profitPersent?:number,
    profitsol?:number,
    mcap?:string,
    price?:string,
    valueSol:string,
    valueUsd?:string,
    time:string,
    type:number,
    image?:string,
    name?:string
    txHash:string
}