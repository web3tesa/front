import React, { useEffect, useState } from 'react'
import { reqSmartMoneyList } from '../../service/coin'
import { useCounter } from 'ahooks'
import { getTokenInfoForDexScreener } from '../../utils/sol/token'
import EmptyTokenListIcon from '../assets/empty_token_list.svg'
import KolCard from './card/kol'
import ScrollList from './scroll/list'
import { useLanguage } from '../hooks'

const PAGE_SIZE = 10

export default function SmartKols() {
    const [kolsList, setKolList] = useState<IKolListInfo[]>([])
    const [pageNum, {
        inc: NextPage,
        dec: PrevPage,
        set: ChangePage,
        reset: ResetPage
    }] = useCounter(1)
    const [totalNum, setTotalNum] = useState(0)
    const [loading, setLoading] = useState({
        initLoading: false,
        nextPageLoading: false
    })
    const t = useLanguage()


    useEffect(() => {
        getList()
    }, [])

    const getList = async () => {
        setLoading({
            ...loading,
            initLoading: true
        })
        const _kolList = [...kolsList]
        const { list, total } = await reqSmartMoneyList({
            pageNum: pageNum,
            pageSize: PAGE_SIZE
        })
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            const { five_min, one_hour, six_hour, tokenPrice } = await getTokenInfoForDexScreener(item.address)
            _kolList.push({
                ...item,
                price: Number(tokenPrice),
                mcap: item.kolTotalBuy * Number(tokenPrice),
                priceChange: {
                    five_min,
                    one_hour,
                    six_hour
                }
            })

        }
        console.log(_kolList, total);

        setKolList(_kolList)
        setTotalNum(total)
        setLoading({
            ...loading,
            initLoading: false
        })
    }
    const handleNextPage = () => {

    }
    return (
        <div>
            {
                kolsList.length > 0 &&
                <ScrollList loading={loading.nextPageLoading} onNextPage={handleNextPage}>
                    {
                        kolsList.map((item, index) => {
                            return <KolCard kolInfo={item} key={index} />
                        })
                    }
                </ScrollList>
            }
            {
                totalNum == 0 && !loading.initLoading && <div className='mx_mt-4'>
                    <img src={EmptyTokenListIcon} className='mx_w-16 mx_h-16 mx_mx-auto' />
                    <p className='mx_text-center mx_text-base mx_italic mx_font-semibold mx_my-4'>{t?.search?.noToken}</p>
                </div>
            }
        </div>
    )
}
