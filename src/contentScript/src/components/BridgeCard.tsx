import React, { useEffect, useState } from 'react'
import { getTokenAddress } from '../utils/dom'
import { useInterval } from 'ahooks'

export default function BridgeCard() {
    const [tokenAddress,setTokenAddress] = useState("")
    useInterval(() => {
        const _tokenAddress = getTokenAddress(location.hostname)
        if (_tokenAddress !== tokenAddress) {
            setTokenAddress(_tokenAddress)
        }
    },1000)
    useEffect(()=>{
        console.log("got new token address",tokenAddress);
    },[tokenAddress])
    return (
        <div></div>
    )
}
