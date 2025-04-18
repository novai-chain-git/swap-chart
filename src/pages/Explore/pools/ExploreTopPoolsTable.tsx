import React, { NamedExoticComponent, memo, useState, ReactNode, useEffect } from 'react'
import { TableComponent, ColumnsType } from '../../../components/Table'
import { useTranslation, Trans } from 'react-i18next'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { ReactComponent as ArrowDown } from '../../../assets/svg/ArrowDown.svg'
import styled from 'styled-components'
import swapNaiAbi from '../../../constants/abis/swapNai.json'
import factoryAbi from '../../../constants/abis/factory.json'
import pairAbi from '../../../constants/abis/Pair.json'
import { getNaiRouterContract } from '../../../utils'
import { ChainId } from '@uniswap/sdk'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ROUTER_ADDRESS,NAI_ADDRESS, NAI_HEYUE_ADDRESS } from '../../../constants'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { getVol } from '../../../requests'
import { getFormatNumber } from '../../../utils/debounce'

// import factory from '../../constants/abis/factory.json'

export const SearchIconCommit = styled(ArrowDown)`
  cursor: pointer;
`
export const FlexCommit = styled(Flex)`
  cursor: pointer;
`
const CartText = styled.span`
  padding: 2px 5px;
  border-radius: 5px;
  background-color: #8e8e8e17;
  color: #7d7d7d;
  font-size: 12px;
  margin-left: 5px;
`

export enum TokenSortMethod {
  FEES = 'fees',
  PROTOCOL = 'protocol',
  POOLS = 'pools',
  TOTAL_VALUE_LOCKED = 'TOTAL_VALUE_LOCKED',
  APR = 'apr',
  VOLUME_1D = 'VOLUME',
  THIRTY_DAY = 'thirtyDay',
  VOL_OVER_TVL = 'VOL_OVER_TVL'
}

const HEADER_TEXT: Record<TokenSortMethod, ReactNode> = {
  [TokenSortMethod.PROTOCOL]: <Trans i18nKey="common.protocol" />,
  [TokenSortMethod.FEES]: <Trans i18nKey="common.fees" />,
  [TokenSortMethod.POOLS]: <Trans i18nKey="common.pools" />,
  [TokenSortMethod.TOTAL_VALUE_LOCKED]: <Trans i18nKey="common.totalValueLocked" />,
  [TokenSortMethod.APR]: <Trans i18nKey="pool.apr" />,
  [TokenSortMethod.VOLUME_1D]: <Trans i18nKey="stats.volume.1d" />,
  [TokenSortMethod.THIRTY_DAY]: <Trans i18nKey="pool.volume.thirtyDay" />,
  [TokenSortMethod.VOL_OVER_TVL]: <Trans i18nKey="pool.volOverTvl" />
}
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
  PRICE = 'PRICE'
}

function TokenTableHeader({
  category,
  isCurrentSortMethod,
  direction
}: {
  category: TokenSortMethod
  isCurrentSortMethod: boolean
  direction: OrderDirection
}) {
  return (
    <FlexCommit alignItems="center">
      {isCurrentSortMethod && (
        <SearchIconCommit
          fill={'#ffffff'}
          style={{ left: '12px', top: '10px' }}
          width={16}
          height={16}
          pointerEvents="none"
        />
      )}
      <Text color={isCurrentSortMethod ? '#ffffff' : ''}>{HEADER_TEXT[category]}</Text>
    </FlexCommit>
  )
}

const TableColumn = function() {
  const { t, i18n } = useTranslation()
  const [dataSource, setDataSource] = useState([
    {
      lable: 'NOVAI',
      title: 'NOVAI/nUSDT',
      address: '0x4aC2abdDF928C3D01a208e880E101a1423dB6C73',
      coin: 'USDT',
      protocol: 'v2',
      fees: '0.05%',
      trading24H: '',
      trading30D: '',
      day: 'NOVAI',
      thirty: 'NOVAI',
      dayTvl: 'NOVAI'
    },
    {
      lable: 'nAI',
      title: 'nAI/nUSDT',
      address: NAI_ADDRESS,
      coin: 'WNOVAI',
      protocol: 'v2',
      fees: '0.05%',
      trading24H: '',
      trading30D: '',
      day: '',
      thirty: '',
      dayTvl: ''
    }
    // {
    //   lable: 'NUSDT',
    //   title:"nUSDT/NOVAI",
    //   address:"0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37",
    //   coin: 'wNOVAI',
    //   protocol: 'v2',
    //   fees: '0.05%',
    //   tvl: '',
    //   year: '',
    //   day: '',
    //   thirty: '',
    //   dayTvl: ''
    // },

    // {
    //   lable: 'NUSDT',
    //   title:"WNOVAI/nUSDT",
    //   address:"0x2Ab2b37CfB556fE54f9d1B91A8dA8066d0fa3226",
    //   coin: 'WNOVAI',
    //   protocol: 'v2',
    //   fees: '0.05%',
    //   tvl: '',
    //   year: '',
    //   day: '',
    //   thirty: '',
    //   dayTvl: ''
    // },
    // {
    //   lable: 'NUSDT',
    //   title:"nUSDT/WNOVAI",
    //   address:"0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37",
    //   coin: 'WNOVAI',
    //   protocol: 'v2',
    //   fees: '0.05%',
    //   tvl: '',
    //   year: '',
    //   day: '',
    //   thirty: '',
    //   dayTvl: ''
    // },

    // {
    //   lable: 'NUSDT',
    //   title:"nUSDT/nAI",
    //   address:"0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37",
    //   coin: 'WNOVAI',
    //   protocol: 'v2',
    //   fees: '0.05%',
    //   tvl: '',
    //   year: '',
    //   day: '',
    //   thirty: '',
    //   dayTvl: ''
    // }
  ])
  //获取合约factory
  
  const getContractFactory = async (address:string):Promise<any> => {
    const nusdt = '0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37'
    const provider = new JsonRpcProvider('https://rpc.novaichain.com')
    const router = new Contract(NAI_HEYUE_ADDRESS, swapNaiAbi, provider)
  //  console.log('Uniswap V2 Factory 地址:', provider,NAI_HEYUE_ADDRESS,router)
    try{
      const factoryAddress = await router.factory()
      console.log('factoryAddress', factoryAddress)

      
      const pairContract = new Contract(factoryAddress, factoryAbi, provider)
      const pairAddress = await pairContract.getPair(address,nusdt)
      console.log('pairAddress', pairAddress)

      const reservesContract = new Contract(pairAddress, pairAbi, provider)
      //获取合约地址
      const token0 = await reservesContract.token0()
      const token1 = await reservesContract.token1()
      const [reserve0, reserve1] = await reservesContract.getReserves()
      console.log(reserve0,'reserve0',formatUnits(reserve0,18), 'reserve1', reserve1,formatUnits(reserve1,6))
      console.log(token0,token1,'token0')
      let num = 0
      if(token0 === address){
        num = parseFloat(formatUnits(reserve1,6))
      }else{
        num = parseFloat(formatUnits(reserve0,6))
      }
      console.log(num,'num')
      return (num * 2)
    }catch(e){
      console.log(e,'Uniswap V2 Factory 地址:')
    }
    

  
  }
  //novai
 // getContractFactory('0x4aC2abdDF928C3D01a208e880E101a1423dB6C73')

  useEffect(()=>{
    //novai
  //  getContractFactory('0x4aC2abdDF928C3D01a208e880E101a1423dB6C73')
    //nai
    // getContractFactory(NAI_ADDRESS)
    // setDataSource(prev =>
    //   prev.map(async(item, i) => {
    //     try{
    //       let res = await getContractFactory(String(item.address))
    //       console.log(res,'res')
    //      // item.tvl = res
    //       return {
    //         ...item,
    //         tvl: res
    //       }
    //     }finally{

    //     }
    //   })
    // )
    dataSource.map( async (item,key) => {
      try{
        //获取tvl
        let res = await getContractFactory(String(item.address))
        //获取交易量
        let {data} = await getVol(String(item.lable))
      //  let 
        console.log(data,'res')
        setDataSource(prev =>
          prev.map(items =>
            items.address === item.address ? { ...items, tvl: res,
              trading24H: data.trading24H,trading30D:data.trading30D
             } : items
          )
        )
       //  item.tvl = res
      }finally{

      }
      
      
    })
   // setDataSource(list)
    },[])
  const render = function({ row }: { row: any }) {
    return (
      <Flex justifyContent="center" alignItems="center">
        {row.title}
        <CartText>v2</CartText>
        <CartText>0.3%</CartText>
      </Flex>
    )
  }

  const TvlRender = function({ value }: { value: any }) {
    return (
      <Flex justifyContent="center" alignItems="center">
        {value && `$${getFormatNumber(value,1)}`}
      </Flex>
    )
  }
  const columns = [
    {
      lable: '#',
      dataIndex: 'index',
      render: ({ index }: { index: number }) => index + 1
    },
    {
      lable: t('common.pools'),
      dataIndex: 'title',
      render: render
    },
    // {
    //   lable: t('common.protocol'),
    //   dataIndex: 'protocol'
    // },
    // {
    //   lable: t('common.fees'),
    //   dataIndex: 'fees'
    // },
    {
      lable: t('common.totalValueLocked'),
      dataIndex: 'tvl',
      // render: tvlRender,
      render: function({ row }: { row: any }) {
        return <TvlRender value={row.tvl}/>
      }
    },
    // {
    //   lable: t('pool.apr'),
    //   dataIndex: 'year'
    // },
    {
      lable: t('stats.volume.1d'),
      dataIndex: 'trading24H',
      render: function({ row }: { row: any }) {
        return <TvlRender value={row.trading24H}/>
      }
    },
    {
      lable: t('pool.volume.thirtyDay'),
      dataIndex: 'trading30D',
      render: function({ row }: { row: any }) {
        return <TvlRender value={row.trading30D}/>
      }
    },
    {
      lable: t('pool.volOverTvl'),
      dataIndex: 'dayTvl',
      render: function({ row }: { row: any }) {
        //let num = 
        if(!row.trading24H || !row.tvl) return (<></>)
          let num:any = row.trading24H / row.tvl
        return (
          <Flex justifyContent="center" alignItems="center">
          {num < 0.01? '<0.01':getFormatNumber(num,2)}
        </Flex>
        )
      }
    }
  ]


  return (
    <div>
      <TableComponent dataSource={dataSource} columns={columns}></TableComponent>
    </div>
  )
}

export const ExploreTopPoolTable = memo(function ExploreTopPoolTable() {
  return (
    <div>
      <TableColumn></TableColumn>
    </div>
  )
})
