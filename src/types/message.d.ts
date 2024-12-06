interface IMessageBase {
    type: EMessageType
}

interface IMessageWithAddress extends IMessageBase{
    type: EMessageType.ADDRESS,
    message: string
}

interface IMessageWithChainId extends IMessageBase{
    type: EMessageType.CHAINID,
    message:number
}

interface IMessageWithTransData extends IMessageBase{
    type: EMessageType.TRANSDATA,
    message: any
}

type IMessage = IMessageWithAddress | IMessageWithChainId | IMessageWithTransData