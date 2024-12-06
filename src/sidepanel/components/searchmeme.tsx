import React, { useEffect, useRef, useState } from 'react'
import { isValidSolAddress } from '../../utils'
import TokenCard from './card/token'
import { Button, TextareaAutosize } from '@mui/material'
import Loading from '../../components/Loading'
import FailIcon from '../../contentScript/src/assets/Fail'
import { useLanguage, useTokenInfo } from '../hooks'
import { useBackendReq } from '../../hooks'
import { BASE_TOKEN_INFO } from '../../constant/nsp'

export default function SearchMemePage() {
    // 0 init 1 success 2 failed 3 loading
    const [searchStatus, setSearchStatus] = React.useState(0)
    const [transStatus, setTransStatus] = React.useState(0)
    const [searchAddress, setSearchAddress] = React.useState('')
    const searchTextareaRef = useRef<HTMLTextAreaElement>(null)
    const [tokenInfo, setTokenInfo] = useState<ITokenListItem>(BASE_TOKEN_INFO)

    const { sendReq } = useBackendReq()

    const { getTokenInfo } = useTokenInfo()

    const t = useLanguage()

    const handleInputAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchAddress(e.target.value.trim())
        isValidSolAddress(e.target.value.trim()) && searchMeme(e.target.value.trim())
    }



    const searchMeme = async (address?: string) => {
        let _searchAddress = address || searchAddress
        console.log("got search address", _searchAddress);
        
        setSearchStatus(3)
        try {
            const _tokenInfo = await getTokenInfo(_searchAddress, true)
            if (_tokenInfo?.address == _searchAddress) {
                setTokenInfo({
                    ...tokenInfo,
                    ..._tokenInfo
                })
            }else{
                setTokenInfo({
                    ...BASE_TOKEN_INFO
                })
            }

            setSearchStatus(1)

            if (_tokenInfo?.address == _searchAddress) {
                setSearchStatus(1)
            } else {
                setSearchStatus(2)
            }
        } catch (error) {

            setTokenInfo({
                ...tokenInfo
            })
            setSearchStatus(2)
        }
    }




    useEffect(() => {
        searchTextareaRef.current?.focus()
    }, [])

    const handleRetrySearch = () => {
        setSearchStatus(0)
        setTransStatus(0)
        setSearchAddress('')
        searchTextareaRef.current?.focus()
    }

    return (
        <div>
            {
                transStatus === 0 && <div>
                    <TextareaAutosize value={searchAddress} ref={searchTextareaRef} onChange={handleInputAddress} aria-label="search meme" minRows={3} placeholder={t?.search?.searchPlaceholder} className=' mx_w-full mx_border mx_bg-white mx_border-black/20 mx_rounded-xl mx_p-3 mx_mt-4' />
                    <div className='mx_flex mx_justify-center mx_mt-8'>
                        {
                            searchStatus == 0 && <Button className='mx_block mx_text-center  mx_w-3/4 mx_mx-auto' size='small' variant='contained' onClick={() => searchMeme()}>{t?.search?.search}</Button>
                        }
                    </div>
                </div>
            }
            {
                searchStatus == 2 && <div className=' mx_flex mx_justify-start mx_gap-8 mx_flex-col'>
                    <FailIcon />
                    <p className='mx_text-black mx_italic mx_mt-3 mx_text-center'>{t?.trade?.failed}</p>
                    <Button className='!mx_mx-auto !mx_rounded-xl !mx_font-semibold !mx_my-2 mx_mt-4 !mx_w-40' size='small' onClick={handleRetrySearch} variant='contained'>
                        {t?.trade?.tryAgain}
                    </Button>
                </div>
            }
            {
                searchStatus == 3 && <div className=' mx_flex mx_justify-start mx_gap-8 mx_flex-col'>
                    <Loading />
                </div>
            }
            {
                searchStatus == 1 && <TokenCard isBuy={true} tokenValue={tokenInfo} />
            }
        </div>
    )
}
