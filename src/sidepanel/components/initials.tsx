import { Button, TextField } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { CopyButton } from '../../popup/components/CopyButton'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useUserAddress } from '../../hooks'
import { useRouter, useUserValue } from '../hooks'
import { reqImportPrivateKey, reqUserAddress, reqUserCreateAddress } from '../../service/user'
import { ERouter } from '../provider/router'
import { toast } from 'react-toastify'

enum EInitialsStatus {
    INITIALIZED,
    CREATE_ACCOUNT,
    IMPORT_ACCOUNT
}


export default function InitialsCard() {
    const [initialStatus, setInitialStatus] = React.useState<EInitialsStatus[]>([EInitialsStatus.INITIALIZED])
    const [initUserAccount, setInitUserAccount] = React.useState({
        publicKey: '',
        privateKey: ''
    })
    const { userValue, setUserValue } = useUserValue()
    const { router } = useRouter()
    const handleClickNextTab = (status: EInitialsStatus) => {
        const _initialStatus = [...initialStatus]
        _initialStatus.push(status)
        setInitialStatus([..._initialStatus])
    }


    const InitializationStatusCard = () => {
        const handleClickCreatAccount = async () => {
            try {
                const { address } = await reqUserCreateAddress()
                console.log(address);
                setInitUserAccount({
                    publicKey: address,
                    privateKey: ''
                })
                setUserValue({
                    ...userValue,
                    address: address || "",
                })
            } catch (error) {
                setUserValue({
                    ...userValue,
                    address: "",
                })
            }

            handleClickNextTab(EInitialsStatus.CREATE_ACCOUNT)
        }
        const handleClickImportAccount = async () => {
            handleClickNextTab(EInitialsStatus.IMPORT_ACCOUNT)
        }
        return <div className=' mx_flex mx_flex-col mx_h-full mx_gap-4 mx_justify-start mx_mt-4 mx_p-4'>
            <Button className='mx_w-full !mx_border !mx_rounded-xl' variant='outlined' size='large' onClick={handleClickCreatAccount}>1. Create a  SOL Account</Button>
            <Button className='mx_w-full !mx_rounded-xl' variant='outlined' size='large' onClick={handleClickImportAccount}>2. Input  a Private Key</Button>
        </div>
    }

    const CreateAccountCard = useCallback(() => {
        return <div className=' mx_flex mx_flex-col mx_justify-start mx_gap-4'>
            <div className='mx_w-full mx_text-black'>
                <p>Address:</p>
                <p>{userValue.address}</p>
            </div>
            <CopyToClipboard text={userValue.address} onCopy={() => {
                toast.success('Copy Address Success')
            }}>
                <Button variant='contained' className='mx_w-full' size='large'>Copy Address To Deposit</Button>
            </CopyToClipboard>
        </div>
    }, [initUserAccount])

    const ImportAccountCard = () => {
        // 0 init 1 right 2 false
        const [inputPrivateKeyStatus, setInputPrivateKeyStatus] = React.useState<number>(0)
        const [inputPrivateKey, setInputPrivateKey] = React.useState<string>('')
        const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false)


        const handleInputPrivateKey = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputPrivateKeyStatus(0)
            setInputPrivateKey(e.target.value.trim())
        }

        const confirmPrivateKey = async () => {
            setConfirmLoading(true)
            try {

                const { success } = await reqImportPrivateKey({ privateKey: inputPrivateKey })

                // await importAccount(inputPrivateKey)
                if (success) {
                    const { address } = await reqUserAddress()
                    setUserValue({
                        ...userValue,
                        address: address || ""
                    })
                    setInputPrivateKeyStatus(1)
                } else {
                    setInputPrivateKeyStatus(2)
                    return
                }
                setConfirmLoading(false)
                handleClickNextTab(EInitialsStatus.CREATE_ACCOUNT)
            } catch (error) {
                setInputPrivateKeyStatus(2)
            }
        }

        return <div className=' mx_flex mx_flex-col mx_justify-start mx_gap-4'>
            <p>
                Input Private Key
            </p>
            <TextField autoComplete='off' inputProps={{"aria-autocomplete":"none"}} error={inputPrivateKeyStatus == 2} label="Private Key" value={inputPrivateKey} onChange={handleInputPrivateKey} />
            <Button variant='contained' className='mx_w-full' size='large' onClick={confirmPrivateKey} disabled={confirmLoading}>Confirm</Button>

        </div>
    }


    const handleBack = () => {
        const _initialStatus = [...initialStatus]
        _initialStatus.pop()
        setInitialStatus([..._initialStatus])
    }

    return (
        <article className='mx_flex mx_justify-between mx_flex-col mx_h-full'>
            <div className='mx_flex mx_justify-between'>
                {!(userValue?.address) && <h3 className=' mx_text-lg mx_font-semibold mx_text-black mx_text-left'>
                    Initialization
                </h3>}
                {
                    initialStatus.length > 1 && <Button variant='contained' className='mx_w-fit' size='small' onClick={handleBack}>Back</Button>
                }
            </div>
            <div className='mx_flex-1'>
                {
                    initialStatus[initialStatus.length - 1] === EInitialsStatus.INITIALIZED && <InitializationStatusCard />
                }
                {
                    initialStatus[initialStatus.length - 1] === EInitialsStatus.CREATE_ACCOUNT && <CreateAccountCard />
                }
                {
                    initialStatus[initialStatus.length - 1] === EInitialsStatus.IMPORT_ACCOUNT && <ImportAccountCard />
                }
                {
                    initialStatus.length == 0 && <InitializationStatusCard />
                }
            </div>
        </article>
    )
}

