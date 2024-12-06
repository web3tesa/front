import { useInterval } from 'ahooks'
import React, { useEffect } from 'react'
import { getUserJWTToken, openUserSignMessagePage } from '../../utils/message/jwtToken'
import { Button } from '@mui/material'

export default function SignPage() {
    useInterval(() => {
        getUserJWTToken()
    }, 2000)

    return (
        <div className=' mx_flex mx_flex-col mx_h-full mx_justify-center mx_gap-8 mx_text-center mx_font-bold mx_text-lg'>
            Please Sign With your Wallet First
            <Button className=' mx_mx-auto' variant='contained' onClick={openUserSignMessagePage}>
                Sign
            </Button>
        </div>
    )
}
