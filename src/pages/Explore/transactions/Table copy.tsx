import React, { NamedExoticComponent, memo, useState, ReactNode, useEffect, useRef } from 'react'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { TableComponent, ColumnsType } from '../../../components/Table'
import { useTranslation, Trans } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as DropdownIcon } from '../../../assets/svg/DropdownIcon.svg'
import choose from '../../../assets/svg/choose.svg'
import { getStat, getTransactions } from '../../../requests'

export const DropdownIconCommit = styled(DropdownIcon)`
  cursor: pointer;
`
const LangLiImg = styled.img<{ active?: boolean }>`
  display: ${props => (props.active ? 'block' : 'none')};
  width: 12px;
  margin-left: auto;
`

export const FlexCommit = styled(Flex)`
  cursor: pointer;
  position: relative;
`

export const Drpdown = styled.div<{ active?: boolean }>`
  display: ${props => (props.active ? 'block' : 'none')};
  position: absolute;
  background: linear-gradient(180deg, #5ac27c 0%, #b2e235 100%);
  top: 100%;
  left: 0;
  border-radius: 10px;
  padding: 1px;
  width: 240px;
`
export const DrpdownMain = styled.div`
  background: #131315;
  border-radius: 10px;
  padding: 10px;
  color: #ffffff;
`
export enum TokenSortMethod {
  TIME = 'TIME',
  LABEL = 'LABEL',
  TOKEN_AMOUNT = 'TOKEN_AMOUNT',
  WAELLET_LABEL = 'WAELLET_LABEL'
}

const HEADER_TEXT: Record<TokenSortMethod, ReactNode> = {
  [TokenSortMethod.TIME]: <Trans i18nKey="common.time" />,
  [TokenSortMethod.LABEL]: <Trans i18nKey="common.type.label" />,
  [TokenSortMethod.TOKEN_AMOUNT]: <Trans i18nKey="common.tokenAmount" />,
  [TokenSortMethod.WAELLET_LABEL]: <Trans i18nKey="common.wallet.label" />
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [SwapType, setSwapType] = useState(true)
  const [AddType, setAddType] = useState(true)
  const [RemoveType, setRemoveType] = useState(true)
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <FlexCommit alignItems="center" ref={ref} onClick={() => setOpen(prev => !prev)}>
      <DropdownIconCommit width={16} height={17} pointerEvents="none" />
      <Text>{HEADER_TEXT[category]}</Text>
      <Drpdown ref={ref} active={open}>
        <DrpdownMain>
          <Flex alignItems="center" justifyContent="space-between" onClick={() => setSwapType(prev => !prev)}>
            <Text lineHeight="40px">Swap</Text>
            <LangLiImg src={choose} active={SwapType} />
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" onClick={() => setAddType(prev => !prev)}>
            <Text lineHeight="40px">Add</Text>
            <LangLiImg src={choose} active={AddType} />
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" onClick={() => setRemoveType(prev => !prev)}>
            <Text lineHeight="40px">Remove</Text>
            <LangLiImg src={choose} active={RemoveType} />
          </Flex>
        </DrpdownMain>
      </Drpdown>
    </FlexCommit>
  )
}
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
const TableColumn = function() {
  const { t, i18n } = useTranslation()
  const columns: ColumnsType[] = [
    {
      dataIndex: 'createdAt',
    
      header: function TokenHeader() {
        return <div>{HEADER_TEXT[TokenSortMethod.TIME]}</div>
      }
    },
    {
      dataIndex: 'type',
      header: function TokenHeader() {
        return (
          <TokenTableHeader
            category={TokenSortMethod.LABEL}
            isCurrentSortMethod={false}
            direction={OrderDirection.Asc}
          />
        )
      }
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return <div>{HEADER_TEXT[TokenSortMethod.TOKEN_AMOUNT]}</div>
      }
    },
    {
      dataIndex: 'index',
      header: function TokenHeader() {
        return <div>{HEADER_TEXT[TokenSortMethod.TOKEN_AMOUNT]}</div>
      }
    },
    {
      dataIndex: 'address',
      header: function TokenHeader() {
        return <div>{HEADER_TEXT[TokenSortMethod.WAELLET_LABEL]}</div>
      }
    }
  ]
  const [dataSource, setDataSource] = useState([])
  const [token, setToken] = useState('novai')
  //获取交易数据
  const getRansactionsData = async () => {
    try {
      const res = await getTransactions({ token: token?.toUpperCase() })
      console.log(res,'res')
      if (res.code === 0) {
         setDataSource(res.data)
        //let {} = res.data
        //setStat(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

    useEffect(() => {
      console.log(token, 'tokentoken')
      if (!token) return
      getRansactionsData()
      // debounce(()=>{
  
      // },300)
    }, [token])
  return (
    <div>
      <TableComponent dataSource={dataSource} columns={columns}></TableComponent>
    </div>
  )
}

export const RecentTransactions = memo(function RecentTransactions() {
  return <TableColumn></TableColumn>
})
