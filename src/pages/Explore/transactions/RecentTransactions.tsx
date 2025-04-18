import React, { useState, useEffect, memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TableComponent } from '../../../components/Table'
import { debounce, getFormatNumber } from '../../../utils/debounce'
import { getStat, getTransactions } from '../../../requests'
import { Flex} from 'rebass/styled-components'

const FlexBox = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.bg9};
  padding: 14px 0 20px 0;
  margin-top: 20px;
 border: 1px solid ${({ theme }) => theme.border1};
  .renders{
  color: #21c95e;}
  .render{
  color: #ff5f52;}
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
const Box = styled.div`
 th{
  position: sticky;
  top: 0;
  background: #131315;
 }
`
const currDataList = [
  {
    name: 'NOVAI',
    value: 'novai',
    lineColor: '#006bff',
    areaColor: '#009bff',
    img: '/images/token/novai.svg',
    imgb: '/images/token/novai.svg'
  },
  {
    name: 'nUSDT',
    value: 'nusdt',
    lineColor: '#006bff',
    areaColor: '#009bff',
    img: '/images/token/nusd.png',
    imgb: '/images/token/nusd.png'
  },
  {
    name: 'WNOVAI',
    value: 'wnovai',
    lineColor: '#006bff',
    areaColor: '#009bff',
    img: '/images/token/novai.svg',
    imgb: '/images/token/novai.svg'
  },
  {
    name: 'nAI',
    value: 'nai',
    lineColor: '#006bff',
    areaColor: '#009bff',
    img: '/images/token/nai.png',
    imgb: '/images/token/nai.png'
  }
]
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
export const TableColumn = function({ address, token = 'nAI', priceDecimals = 3 }: { address?: string; token?: string; priceDecimals?: number }) {
  const { t, i18n } = useTranslation()
  const data = []

  const render = function({ row }: { row: any }) {
    const itemImg = currDataList.find(item => item.value === row.token.toLowerCase())
    return <Flex justifyContent="center" flexDirection={row.type == 1?'row':'row-reverse'}>
      <Flex alignItems='center' >
        {itemImg?.img && <img style={{ width: '20px', height: '20px',marginRight: '5px' }} src={itemImg.img} alt="" />}
        {row.token}
      </Flex>
      <div style={{padding: '0px 5px'}}>{t("swap")}</div>
      <Flex alignItems='center'>
      <img  style={{ width: '20px', height: '20px',marginRight: '5px' }} src='/images/token/nusd.png' alt="" />
        NUSDT
      </Flex>
    </Flex>
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
      lable: 'NUSDT',
      dataIndex: 'priceAmount',
      // render: ({ row }: { row: any }) => getFormatNumber(row.priceAmount, priceDecimals),
      render: ({ row }: { row: any }) => getFormatNumber(row.priceAmount, priceDecimals),
      style: {
        minWidth: '120px'
      }
    },
    {
      lable: t('common.tokenAmount'),
      dataIndex: 'amount',
      render: ({ row }: { row: any }) => getFormatNumber(row.type == 1 ? row.amount : row.priceAmount, priceDecimals),
      style: {
        minWidth: '120px'
      }
    },
    {
      lable: t('common.tokenAmount'),
      dataIndex: 'priceAmount',
      // render: ({ row }: { row: any }) => getFormatNumber(row.priceAmount, priceDecimals),
      render: ({ row }: { row: any }) => getFormatNumber(row.type == 1 ? row.priceAmount : row.amount, priceDecimals),
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


  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [ isPage, setIsPage] = useState(true)
  //获取统计数据


  //获取交易数据
  const getRansactionsData = async (id?: any) => {
    try {
    //  const res = await getTransactions({ token: token?.toUpperCase() })


    let obj:{
      id?:any,
      address?:any
    } = {
      
    }
    if(address){
      obj.address = address
    }
    if(id){
      obj.id = id
    }
    
    setLoading(true)
      const res = await getTransactions(obj)
      if (res.code === 0) {
        if(res.data.length < 100){
          setIsPage(false)
        }else{
          setIsPage(true)
        }
        setDataSource(prev => [...prev,...res.data])

        //let {} = res.data
        //setStat(res.data)
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }
  const onReachBottom = () =>{
    if(dataSource.length && isPage && !loading){
     // console.log(,'dataSource[dataSource.length-1]')
      getRansactionsData((dataSource[dataSource.length-1] as { id: any })?.id)
    }
  }
  useEffect(() => {
    console.log(token, 'tokentoken')
    if (!token) return
    setLoading(false)
    setDataSource([])
    getRansactionsData()
    // debounce(()=>{

    // },300)
  }, [token, i18n,address])


  //console.log(i18n.language,'i18n.language')
  return (
    <Box>

      <TableComponent page={isPage} onReachBottom={onReachBottom} maxHeight="600px" dataSource={dataSource} columns={columns} />
    </Box>
  )
}

// export const RecentTransactions = memo(function RecentTransactions(address: string) {
//   return <TableColumn address={address}></TableColumn>
// })
