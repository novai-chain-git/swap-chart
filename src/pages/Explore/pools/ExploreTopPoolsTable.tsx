import React, { NamedExoticComponent, memo, useState, ReactNode } from 'react'
import { TableComponent, ColumnsType } from '../../../components/Table'
import { useTranslation, Trans } from 'react-i18next'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { ReactComponent as ArrowDown } from '../../../assets/svg/ArrowDown.svg'
import styled from 'styled-components'

export const SearchIconCommit = styled(ArrowDown)`
  cursor: pointer;
`
export const FlexCommit = styled(Flex)`
  cursor: pointer;
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
  const columns: ColumnsType[] = [
    {
      lable: '#',
      dataIndex: 'index',
      render: ({ index }: { index: number }) => index + 1
    },
    {
      dataIndex: 'title',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.POOLS}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'protocol',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.PROTOCOL}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'fees',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.FEES}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'tvl',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.TOTAL_VALUE_LOCKED}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'year',
      header: function TokenHeader() {
        return (
          <TokenTableHeader category={TokenSortMethod.APR} isCurrentSortMethod={false} direction={OrderDirection.Asc} />
        )
      }
    },
    {
      dataIndex: 'day',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.VOLUME_1D}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'thirty',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.THIRTY_DAY}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'dayTvl',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.VOL_OVER_TVL}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    }
  ]
  const [dataSource, setDataSource] = useState([
    {
      lable: 'NOVAI',
      title:"NOVAI/nUSDT",
      address:"0x4aC2abdDF928C3D01a208e880E101a1423dB6C73",
      coin: 'USDT',
      protocol: 'v2',
      fees: '0.05%',
      tvl: 'NOVAI',
      year: 'NOVAI',
      day: 'NOVAI',
      thirty: 'NOVAI',
      dayTvl: 'NOVAI'
    },
    {
      lable: 'NOVAI',
      title:"NOVAI/WNOVAI",
      address:"0x4aC2abdDF928C3D01a208e880E101a1423dB6C73",
      coin: 'USDT',
      protocol: 'v2',
      fees: '0.05%',
      tvl: 'NOVAI',
      year: 'NOVAI',
      day: 'NOVAI',
      thirty: 'NOVAI',
      dayTvl: 'NOVAI'
    },
    {
      lable: 'NUSDT',
      title:"nUSDT/NOVAI",
      address:"0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37",
      coin: 'wNOVAI',
      protocol: 'v2',
      fees: '0.05%',
      tvl: '',
      year: '',
      day: '',
      thirty: '',
      dayTvl: ''
    },
    {
      lable: 'NUSDT',
      title:"nUSDT/WNOVAI",
      address:"0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37",
      coin: 'WNOVAI',
      protocol: 'v2',
      fees: '0.05%',
      tvl: '',
      year: '',
      day: '',
      thirty: '',
      dayTvl: ''
    },
    {
      lable: 'NUSDT',
      title:"WNOVAI/nUSDT",
      address:"0x2Ab2b37CfB556fE54f9d1B91A8dA8066d0fa3226",
      coin: 'WNOVAI',
      protocol: 'v2',
      fees: '0.05%',
      tvl: '',
      year: '',
      day: '',
      thirty: '',
      dayTvl: ''
    },
    {
      lable: 'NUSDT',
      title:"WNOVAI/NOVAI",
      address:"0x2Ab2b37CfB556fE54f9d1B91A8dA8066d0fa3226",
      coin: 'WNOVAI',
      protocol: 'v2',
      fees: '0.05%',
      tvl: '',
      year: '',
      day: '',
      thirty: '',
      dayTvl: ''
    },
    {
      lable: 'NUSDT',
      title:"nAI/nUSDT",
      address:"0xFC864E04D1c05bFf255e8790aaEd5Fe8c1749ad7",
      coin: 'WNOVAI',
      protocol: 'v2',
      fees: '0.05%',
      tvl: '',
      year: '',
      day: '',
      thirty: '',
      dayTvl: ''
    },
    {
      lable: 'NUSDT',
      title:"nUSDT/nAI",
      address:"0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37",
      coin: 'WNOVAI',
      protocol: 'v2',
      fees: '0.05%',
      tvl: '',
      year: '',
      day: '',
      thirty: '',
      dayTvl: ''
    }
  ])

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
