import { Dispatch, HTMLAttributes, SetStateAction, createContext, useEffect, useState } from "react";
import { useLoading } from "../hooks";
import { SOLPanelStorage } from "../schema/storage";
import { getSolAddressBalance } from "../../utils/sol/transaction";
import { lamportsToSol } from "../../utils/sol/token";
import { reqUserAddress } from "../../service/user";
import { reqTokenList } from "../../service/coin";


interface IUserValueContext {
    userValue: IUserValue,
    setUserValue: Dispatch<SetStateAction<IUserValue>>,
    userAddressList: IUserValue[],
    setUserAddressList: Dispatch<SetStateAction<IUserValue[]>>
    refreshUserBalance: () => void
    getUserValueLoading: boolean
}


const defaultUserValue: IUserValue = {
    address: "",
    balance: "",
    value: "",
    tokenValue: []
}


export const UserValueContext = createContext<IUserValueContext>({} as IUserValueContext)

export const UserValueProvider = (props: HTMLAttributes<HTMLDivElement>) => {
    const [userValue, setUserValue] = useState(defaultUserValue)
    const [userAddressList, setUserAddressList] = useState<IUserValue[]>([])
    const [getUserValueLoading, setGetUserLoadingValueLoding] = useState(true)
    const { setLoading } = useLoading()
    useEffect(() => {
        initUserValue()
    }, [])


    const initUserValue = async () => {
        // const userValue = await SOLPanelStorage.getItem("userValue")
        setGetUserLoadingValueLoding(true)
        try {

            const userValueList = await SOLPanelStorage.getItem("userAddressList")
            const userAddress = await getUserInfo()
            const _userValue = { ...userValue }
            setUserAddressList(userValueList || [])
            const balance = await getSolAddressBalance(userAddress)

            const { value } = await reqTokenList({
                pageNum: 1,
                pageSize: 1
            })
            setUserValue({
                ..._userValue,
                balance: lamportsToSol(balance),
                value,
                address: userAddress || userValue.address
            })
            setGetUserLoadingValueLoding(false)
        } catch (error) {
            setGetUserLoadingValueLoding(false)
        }
    }

    const getUserInfo = async () => {
        const _userValue = await reqUserAddress()
        return _userValue.address
    }
    const refreshUserBalance = async () => {
        if (!userValue.address) return
        const balance = await getSolAddressBalance(userValue?.address)

        const { value } = await reqTokenList({
            pageNum: 1,
            pageSize: 1
        })
        const _userValue = { ...userValue }

        if (balance > 0 || Number(value) > 0) {
            setUserValue({
                ..._userValue,
                balance: lamportsToSol(balance),
                value,
            })
        }
    }

    const saveUserValue = async (userValue: IUserValue) => {
        setLoading(true)
        await SOLPanelStorage.setItem("userValue", userValue)
        setLoading(false)
    }


    const saveUserAddressList = async (userAddressList: IUserValue[]) => {
        setLoading(true)
        await SOLPanelStorage.setItem("userAddressList", userAddressList)
        await SOLPanelStorage.setItem("userValue", userAddressList[0])
        setLoading(false)
    }

    const saveUserJWTToken = async (UserJWTToken: string) => {
        setLoading(true)
        await SOLPanelStorage.setItem("UserJWTToken", UserJWTToken)
        setLoading(false)
    }

    useEffect(() => {
        saveUserValue(userValue)
    }, [userValue])

    useEffect(() => {
        saveUserAddressList(userAddressList)
    }, [userAddressList])
    return <UserValueContext.Provider value={{
        userValue,
        setUserValue,
        userAddressList,
        setUserAddressList,
        refreshUserBalance,
        getUserValueLoading
    }}>
        {props.children}
    </UserValueContext.Provider>
}