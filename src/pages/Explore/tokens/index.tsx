import React, { NamedExoticComponent, memo, useState, ReactNode } from 'react'
import { TableComponent, ColumnsType } from '../../../components/Table'
import { useTranslation, Trans } from 'react-i18next'
import { ReactComponent as ArrowDown } from '../../../assets/svg/ArrowDown.svg'
import styled from 'styled-components'
import { Box, Text, Flex, Card } from 'rebass/styled-components'

export const SearchIconCommit = styled(ArrowDown)`
  cursor: pointer;
`
export const FlexCommit = styled(Flex)`
  cursor: pointer;
`

export enum TokenSortMethod {
  FULLY_DILUTED_VALUATION = 'FDV',
  TOKEN_NAME = 'tokenName',
  PRICE = 'price',
  VOLUME = 'volume',
  ONE_DAY = 'oneDay',
  ONE_HOUR = 'oneHour'
}

const HEADER_TEXT: Record<TokenSortMethod, ReactNode> = {
  [TokenSortMethod.TOKEN_NAME]: <Trans i18nKey="common.tokenName" />,
  [TokenSortMethod.FULLY_DILUTED_VALUATION]: <Trans i18nKey="stats.fdv" />,
  [TokenSortMethod.PRICE]: <Trans i18nKey="common.price" />,
  [TokenSortMethod.VOLUME]: <Trans i18nKey="common.volume" />,
  [TokenSortMethod.ONE_HOUR]: <Trans i18nKey="common.oneHour" />,
  [TokenSortMethod.ONE_DAY]: <Trans i18nKey="common.oneDay" />
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
  const [category, setCategory] = useState<string>(TokenSortMethod.TOKEN_NAME)
  const columns: ColumnsType[] = [
    {
      lable: '#',
      dataIndex: 'index',
      render: ({ index }: { index: number }) => index + 1
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.TOKEN_NAME}
            isCurrentSortMethod={category == TokenSortMethod.TOKEN_NAME}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.PRICE}
            isCurrentSortMethod={category == TokenSortMethod.PRICE}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.ONE_HOUR}
            isCurrentSortMethod={category == TokenSortMethod.ONE_HOUR}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.ONE_DAY}
            isCurrentSortMethod={category == TokenSortMethod.ONE_DAY}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.FULLY_DILUTED_VALUATION}
            isCurrentSortMethod={category == TokenSortMethod.FULLY_DILUTED_VALUATION}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.VOLUME}
            isCurrentSortMethod={category == TokenSortMethod.VOLUME}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      lable: '',
      dataIndex: 'index'
    }
  ]
  const [dataSource, setDataSource] = useState([{}, {}])

  return <TableComponent dataSource={dataSource} columns={columns}></TableComponent>
}

export const TopTokensTable = memo(function TopTokensTable() {
  return <TableColumn></TableColumn>
})
