import { defineExtensionStorage } from "@webext-core/storage"
import browser from 'webextension-polyfill';

interface ISOlPanelStorageSchema {
    loading: boolean,
    userValue: IUserValue
    userAddressList: IUserValue[],
    UserJWTToken: string
}

export const SOLPanelStorage = defineExtensionStorage<ISOlPanelStorageSchema>(
    browser.storage.local,
);