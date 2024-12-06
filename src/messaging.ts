import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  getStringLength(data: string): number;
  setJWTToken(data: string): boolean
  newCashback(data: {
    Platform: string;
    Amount: number
    CreateTime: string
  }): boolean
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();


export const getUserSignMessage = async (data: any) => {
  
}