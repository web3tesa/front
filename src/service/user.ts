import { request } from "../utils/request"

export const reqUserJWTToken = async (params: { sign: string, publicKey: string, msg: string }): Promise<IResUserJWTTOken> => {
    return await request.post("/api/v1/auth", params)
}

export const reqUserAddress = async (): Promise<IReqUserAddress> => {
    return await request.get("/api/v1/pubkey", {})
}


export const reqUserCreateAddress = async (): Promise<IReqUserAddress> => {
    return await request.post("/api/v1/prikey/create", {})
}

export const reqImportPrivateKey = async (params: { privateKey: string }): Promise<IImportPrivateKey> => {
    return await request.post("/api/v1/prikey/import", params)
}


export const reqExportPrivateKey = async (): Promise<IExportPrivateKey> => {
    return await request.get("/api/v1/prikey/export", {})
}

export const reqDepositToken = async (params: { amount: number }): Promise<IDepositToken> => {
    return {
        txSignature: "txSignature",
    }
}

export const reqWithdrawToken = async (params: { amount: number }): Promise<IWithdrawToken> => {
    return {
        txSignature: "txSignature",
    }
}

export const reqSetSlippage = async (params: { value: number, type: 1 | 2 }): Promise<ISlippageRes> => {
    return await request.post("/api/v1/set/slippage", { ...params })
}


export const reqSetPriority = async (params: { type: number }): Promise<IPriorityRes> => {
    return await request.post("/api/v1/set/priority", {
        ...params
    })
}

export const reqGetUserSetting = async (): Promise<IGetUserSetting> => {
    return await request.get("/api/v1/query/setting", {})
}

export const reqUserWithdrawSol = async ({ amount, address }: Record<string, string>): Promise<{
    txSignature: string
}> => {
    return await request.post("/api/v1/withdraw", {
        amount,
        address
    })
}

export const reqUserSetAntiMev = async ({ type }: { type: number }) => {
    return await request.post("/api/v1/set/anti_mev", {
        type
    })
}

export const reqUserTradeList = async ({ action, pageNum, pageSize }: { action: number, pageNum: number, pageSize: number }): Promise<ITradeHistoryListRes> => {
    return await request.get("/api/v1/query/trade/history", {
        action,
        pageNum,
        pageSize
    })
}


export const reqUserReferValue = async (): Promise<IReqUserReferValue> => {
    return await request.get("/api/v1/refer", {})
}

export const reqUserWithdrawHistory = async (props: {
    pageNum: number,
    pageSize: number,
    action: 1|2
}):Promise<IReqUserWithdrawHistoryRes> => {
    return await request.get("/api/v1/query/dw/history", {
        ...props
    })
}