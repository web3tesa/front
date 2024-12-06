import { VITE_DEV_MODE } from "../constant/env";
import { RequestMethod } from "../types/enum";
import { getUserJWTToken, removeJWTToken } from "./message/jwtToken";
import { toast } from 'react-toastify'

import config, { BASE_URL } from "../constant/config";

const baseURL = BASE_URL;


type RequestMethodType = <T, D extends Record<string, unknown>>(
    url: string,
    params: D,
    base?: string,
    config?: RequestInit
) => Promise<T>;

function generateTraceId() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const requestHandler = async <T, D extends Record<string, unknown>>(
    method: RequestMethod,
    url: string,
    params: D,
    base?: string,
    config: RequestInit = {}
): Promise<T> => {
    const lang = "en";
    let jwtToken = await getUserJWTToken();
    const traceId = generateTraceId();
    let headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (jwtToken && url !== "/api/v1/auth") {
        (headers as any)["Authorization"] = `Bearer ${jwtToken}`;
    }
    headers['trace-id'] = traceId;

    let options: RequestInit = {
        method,
        headers,
        ...config,
    };


    if (method === "get" || method === "delete") {
        const queryParams = new URLSearchParams(params as Record<string, string>).toString();
        url = base || `${baseURL}${url}${queryParams ? "?" + queryParams : ""}`;
    } else {
        options.body = JSON.stringify(params);
        url = base || `${baseURL}${url}`;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        if (response.status === 403) {
            removeJWTToken();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (base) {
        return data
    }
    if (data.code !== 0) {
        if (data.code == -2) {
            // removeJWTToken();
        } else if (data.code == -21 || data.code == -50) {
            return Promise.reject();
        } else if (data.code == -9999 && VITE_DEV_MODE == "development") {
            toast.error("just test:\n" + traceId, {
                autoClose: false
            });
            return Promise.reject();
        }
        console.log(`error:${data.msg}`);
        throw data;
    } else {
        return data.data;
    }
};

export const request: Record<RequestMethod, RequestMethodType> = {
    get: async <T, D extends Record<string, unknown>>(url: string, params: D, base?: string, config?: RequestInit) =>
        await requestHandler<T, D>(RequestMethod.GET, url, params, base, config),
    post: async <T, D extends Record<string, unknown>>(url: string, params: D, base?: string, config?: RequestInit) =>
        await requestHandler<T, D>(RequestMethod.POST, url, params, base, config),
    put: async <T, D extends Record<string, unknown>>(url: string, params: D, base?: string, config?: RequestInit) =>
        await requestHandler<T, D>(RequestMethod.PUT, url, params, base, config),
    delete: async <T, D extends Record<string, unknown>>(url: string, params: D, base?: string, config?: RequestInit) =>
        await requestHandler<T, D>(RequestMethod.DELETE, url, params, base, config),
};
