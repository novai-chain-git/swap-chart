import React, { NamedExoticComponent, memo, useState, ReactNode, useEffect } from 'react'
import { TableComponent, ColumnsType } from '../../../components/Table'
import { useTranslation, Trans } from 'react-i18next'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { ReactComponent as ArrowDown } from '../../../assets/svg/ArrowDown.svg'
import styled from 'styled-components'

import { getVol } from '../../../requests'
import { getFormatNumber } from '../../../utils/debounce'
import { getContractFactory, coinList } from './utils'

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
  const [dataSource, setDataSource] = useState(coinList)
 
  


  useEffect(()=>{

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
            items.address === item.address ? { ...items, tvl: res * 2,
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
    <TableComponent dataSource={dataSource} columns={columns}></TableComponent>
  )
}

export const ExploreTopPoolTable = memo(function ExploreTopPoolTable() {
  return (
    <TableColumn></TableColumn>
  )
})
