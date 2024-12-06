import { Connection } from "@solana/web3.js"
import { PublicKey } from "@solana/web3.js";
import config from "../../constant/config";

const { SOL_RPC_URL } = config;



export const getConnection = (): Connection => {
    return new Connection(SOL_RPC_URL, 'confirmed');
}

// get solana address balance
export async function getSolAddressBalance(address: string) {
    const connection = getConnection()
    const publicKey = new PublicKey(address); // Convert the address string to a PublicKey object
    const balance = await connection.getBalance(publicKey);
    return balance;
}

export const getMinimumBalance = async () => {
    const connection = getConnection()
    const mini = await connection.getMinimumBalanceForRentExemption(165);
    return mini
}

export async function getTokenInfoWithSolana(tokenMintAddress: string): Promise<{ decimals: number; totalSupply: number; }> {
    try {
        const connection = getConnection()
        const mintPublicKey = new PublicKey(tokenMintAddress);
        const tokenAccountInfo = await connection.getAccountInfo(mintPublicKey);
        if (!tokenAccountInfo) {
            throw new Error(`can not get token value: ${tokenMintAddress}`);
        }

        // get token decimals and totalSupply
        const data = tokenAccountInfo.data;
        const decimals = data[44]; // decimals save at  45th byte
        const totalSupply = Number("0x" + data.slice(32, 40).toString("hex")); // totalSupply save at 33-40 bytes
        return { decimals, totalSupply };
    } catch (error) {
        throw error;
    }
}