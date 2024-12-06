import { VITE_DEV_MODE } from "../constant/env";

export const regexValidString = (currentString: string, regex: RegExp): boolean => {
    return regex.test(currentString);
}

export function formatNumber(num?: number): string {
    if (!num) return "0"
    if (typeof num !== "number") return num;

    const formatted = num?.toFixed(6) || "";

    return parseFloat(formatted).toString();
}

export function DeepCloneObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// check if the string is a valid solana address
export function isValidSolAddress(address: string): boolean {
    return regexValidString(address, /^([A-Za-z0-9]{44})$/) || regexValidString(address, /^([A-Za-z0-9]{43})$/);
}

// check if the string is a valid solana wallet address
export function isValidSolWalletAddress(address: string): boolean {
    return regexValidString(address, /^([A-Za-z0-9]{58})$/);
}

// change the address to a format that is easier to read
export function formatSolAddress(address: string): string {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function formatNumberToUnits(number: number): string {
    if (isNaN(number)) {
        return 'Invalid number';
    }

    const units = ['B', 'M', 'K'];
    const divisors = [1e9, 1e6, 1e3];

    for (let i = 0; i < units.length; i++) {
        if (number >= divisors[i]) {
            return (number / divisors[i]).toFixed(2) + units[i];
        }
    }

    return number.toString();
}


export function formatToTwoDecimals(number: number, digits?: number): number {
    if (number === 0) return 0; // avoid -0
    const significantDigits = digits ? digits : 2;
    const multiplier = Math.pow(10, significantDigits - Math.floor(Math.log10(Math.abs(number))) - 1);
    return Math.round(number * multiplier) / multiplier;
}


export function formatTimestamp(timestamp: number) {
    const milliseconds = timestamp * 1000;
    const date = new Date(milliseconds);
    const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${month} ${day}  ${hours}:${minutes}:${seconds}`;
}

// format the utc time to a timestamp
export function formatUtcTimeToTimestamp(utcTime: number): string {
    const date = new Date(utcTime);
    return formatTimestamp(date.getTime() / 1000);
}



export function getIsDevMode(): boolean {
    return VITE_DEV_MODE == "development";
}