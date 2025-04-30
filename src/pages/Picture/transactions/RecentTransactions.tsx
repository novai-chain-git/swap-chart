import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TableComponent } from '../../../components/Table'
import { debounce, getFormatNumber } from '../../../utils/debounce'
import {  getTransactions } from '../../../requests'
import { SearchBar } from '../../../components/Explore/SearchBar'
import { Flex } from 'rebass/styled-components'


const FlexBox = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.bg9};

  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.border1};
  .renders {
    color: #21c95e;
  }
  .render {
    color: #ff5f52;
  }
  tr{
    
  }
  thead{
  //  border-top: 1px solid ${({ theme }) => theme.border1};
  tr{
    border: none;
    
  }
  }
`
const ChartSearchBar = styled(Flex)`
  margin: 10px 0;
`

const ChartTitle = styled.div`
  font-size: 16px;
  font-family: 'OrbitronMedium';
  padding: 0 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border1};
  @media (max-width: 768px) {
    font-size: 18px;
  }
`
const ChartBoxCom = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
`
const ChartBoxComItem = styled.div`
  flex: 1 1 0%;
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
  }
  .value {
    font-size: 24px;
    padding-top: 8px;
    font-family: 'OrbitronMedium';
  }

  @media (max-width: 768px) {
    min-width: 50%;
    flex: auto;

    .value {
      font-size: 16px;
      padding-top: 4px;
    }
  }
`

function formatNumber(value: any, language: string, priceDecimals = 1) {
  const num = typeof value == 'number' ? value : Number(value)

  if (language == 'zh') {
    if (num >= 1e8) {
      return getFormatNumber(num / 1e8, priceDecimals) + '万'
      return (num / 1e8).toFixed(priceDecimals) + '亿'
    } else if (num >= 1e4) {
      return getFormatNumber(num / 1e4, priceDecimals) + '万'
      return (num / 1e4).toFixed(priceDecimals) + '万'
    } else {
      return getFormatNumber(num, priceDecimals)
    }
  } else {
    if (num >= 1e9) {
      // 10亿及以上
      return getFormatNumber(num / 1e9, priceDecimals) + 'B'
      return (num / 1e9).toFixed(priceDecimals) + 'B'
    } else if (num >= 1e6) {
      // 100万及以上
      return getFormatNumber(num / 1e6, priceDecimals) + 'B'
      return (num / 1e6).toFixed(priceDecimals) + 'M'
    } else if (num >= 1e3) {
      // 1000及以上
      return getFormatNumber(num / 1e3, priceDecimals) + 'K'
      return (num / 1e3).toFixed(priceDecimals) + 'K'
    } else {
      // 小于1000的情况
      return getFormatNumber(num, priceDecimals)
    }
  }
}

function formatString(str: string) {
  if (str.length <= 8) {
    return str // 如果字符串长度小于等于 8，直接返回原字符串
  }
  const start = str.substring(0, 4)
  const end = str.substring(str.length - 4)
  return `${start}...${end}`
}
//获取时间戳到当前时间时间差
function getDateDiff(timestamp: number, t: any) {
  const now = new Date().getTime()
  const diff = (now - timestamp) / 1000
  const day = Math.floor(diff / 86400)
  const hour = Math.floor((diff % 86400) / 3600)
  const minute = Math.floor((diff % 3600) / 60)
  const second = Math.floor(diff % 60)
  if (day) return t('days ago', { num: day })
  if (hour) return t('hours ago', { num: hour })
  if (minute) return t('minutes ago', { num: minute })
  return t('seconds ago', { num: second })
  //return `${day}天 ${hour}小时 ${minute}分 ${second}秒`
}
export default function({ token, priceDecimals, address }: { token: string; priceDecimals: number, address: string }) {
  const { t, i18n } = useTranslation()
  const data = []
  const [isPage, setIsPage] = useState(true)
  const render = function({ row }: { row: any }) {
    return <div className={row.type == 1 ? 'renders' : 'render'}>{row.type == 1 ? t('TableBuy') : t('TableSell')}</div>
  }
  const columns = [
    {
      lable: t('TableTime'),
      dataIndex: 'createdAt',
      render: ({ row }: { row: any }) => getDateDiff(row.createdAt, t),

      style: {
        minWidth: '120px'
      }
    },
    {
      lable: t('TableType'),
      dataIndex: 'type',
      render: render,
      filters: [
        {
          lable: 'BUY',
          value: 1
        },
        {
          lable: 'Sell',
          value: 0
        }
      ],
      style: {
        minWidth: '120px'
      }
    },
    {
      lable: t('Table$title', { title: token }),
      dataIndex: 'amount',
      render: ({ row }: { row: any }) => getFormatNumber(row.amount, priceDecimals),
      style: {
        minWidth: '120px'
      }
    },
    {
      lable: 'NUSDT',
      dataIndex: 'priceAmount',
      // render: ({ row }: { row: any }) => getFormatNumber(row.priceAmount, priceDecimals),
      render: ({ row }: { row: any }) => getFormatNumber(row.priceAmount, priceDecimals),
      style: {
        minWidth: '120px'
      }
    },
    // {
    //   lable: t('TableUSD'),
    //   dataIndex: 'type',
    //   style: {
    //     minWidth: '120px'
    //   }
    // },
    {
      lable: t('TableWallet'),
      dataIndex: 'address',
      render: ({ row }: { row: any }) => formatString(row.address),
      style: {
        minWidth: '120px'
      }
    }
  ]


  
  const [lockedPositionType, setLockedPositionType] = useState(true)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  //获取交易数据
  const getRansactionsData = async (id?: any) => {
    try {
      let obj: {
        id?: any
        address?: any
        token: string
      } = {
        token: token?.toUpperCase()
      }
      if (address) {
        obj.address = address
      }
      if (id) {
        obj.id = id
      }
      setLoading(true)
      const res = await getTransactions(obj)
      console.log(res)
      if (res.code === 0) {
        if (res.data.length < 100) {
          setIsPage(false)
        } else {
          setIsPage(true)
        }
        setDataSource(prev => [...prev, ...res.data])
        // setDataSource(res.data)
        //let {} = res.data
        //setStat(res.data)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  const onReachBottom = () => {
    if (dataSource.length && isPage && !loading) {
      // console.log(,'dataSource[dataSource.length-1]')
      getRansactionsData((dataSource[dataSource.length - 1] as { id: any })?.id)
    }
  }




  useEffect(() => {
    if (!token) return
    setDataSource([])
    getRansactionsData()
    // debounce(()=>{

    // },300)
  }, [token, i18n,address])

  
  //console.log(i18n.language,'i18n.language')
  return (
    <>
   
      {/* <ChartSearchBar  justifyContent="flex-end">
        <SearchBar value={address} onBlur={onBlur} placeholder={t('tokens.table.search.placeholder.transactions')} />
      </ChartSearchBar> */}
      <FlexBox style={{ paddingBottom: '0px' }}>
        <TableComponent
          page={isPage}
          onReachBottom={onReachBottom}
          maxHeight="600px"
          dataSource={dataSource}
          columns={columns}
        />
      </FlexBox>
    </>
  )
}
