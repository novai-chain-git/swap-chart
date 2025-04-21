import React, { ComponentType, useEffect, NamedExoticComponent, useMemo, useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { TopTokensTable } from './tokens'
import { ExploreTopPoolTable } from './pools/ExploreTopPoolsTable'
import { TableColumn } from './transactions/RecentTransactions'
import { Trans, useTranslation } from 'react-i18next'
import { ExploreTab, InterfaceElementName } from './type'
import { RowBetween } from '../../components/Row'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { NavLink } from 'react-router-dom'
import { SearchBar } from '../../components/Explore/SearchBar'
import style from './chart.module.css'
import SelectType from '../../components/SelectType'

import { getKline, getCategoryList, getKlineHistory } from '../../requests'
import Candlestick from "./Candlestick"
// import { ExploreChartsSection } from './charts/ExploreChartsSection'

interface Page {
  title: React.ReactNode
  key: ExploreTab
  component: NamedExoticComponent<object>
  loggingElementName: InterfaceElementName
}

export const CardMain = styled(Card)`
  border-radius: 10px;
  margin-top: 10px;
  background: rgba(12, 14, 16, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.16);
  thead > tr {
    border-top: 0px;
  }
`
export const HeaderTab = styled(Text)<{ active?: boolean }>`
  cursor: pointer;
  color: ${props => (props.active ? '' : '#7D7D7D')};
`
// function usePages(): Array<Page> {
//   const { t } = useTranslation()
//   return [
//     // {
//     //   title: t('common.tokens'),
//     //   key: ExploreTab.Tokens,
//     //   component: TopTokensTable,
//     //   loggingElementName: InterfaceElementName.EXPLORE_TOKENS_TAB
//     // },
//     {
//       title: t('common.pools'),
//       key: ExploreTab.Pools,
//       component: ExploreTopPoolTable,
//       loggingElementName: InterfaceElementName.EXPLORE_POOLS_TAB
//     },
//     {
//       title: t('common.transactions'),
//       key: ExploreTab.Transactions,
//       component: RecentTransactions,
//       loggingElementName: InterfaceElementName.EXPLORE_TRANSACTIONS_TAB
//     }
//   ]
// }
const Main = styled.div`
  width: 100%;
  max-width: 1240px;
  padding-top: 74px;
`
interface Curr {
  "token": string,
  "priceDecimals": number,
  "name": string,
  "value": string,
  "lineColor": string,
  "areaColor": string,
  "img": string,
  "imgb": string
}
const Explore = ({ initialTab }: { initialTab?: ExploreTab }) => {
  const currDataList = [
    {
      name: 'NOVAI',
      value: 'NOVAI',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/novai.svg',
      imgb: '/images/token/novai.svg'
    },
    {
      name: 'nUSDT',
      value: 'nUSDT',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/nusd.png',
      imgb: '/images/token/nusd.png'
    },
    {
      name: 'WNOVAI',
      value: 'WNOVAI',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/novai.svg',
      imgb: '/images/token/novai.svg'
    },
    {
      name: 'nAI',
      value: 'nAI',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/nai.png',
      imgb: '/images/token/nai.png'
    }
  ]

  const { t } = useTranslation()
  const Pages = [
        // {
        //   title: t('common.tokens'),
        //   key: ExploreTab.Tokens,
        //   component: TopTokensTable,
        //   loggingElementName: InterfaceElementName.EXPLORE_TOKENS_TAB
        // },
        {
          title: t('common.pools'),
          key: ExploreTab.Pools,
          loggingElementName: InterfaceElementName.EXPLORE_POOLS_TAB
        },
        {
          title: t('common.transactions'),
          key: ExploreTab.Transactions,
          loggingElementName: InterfaceElementName.EXPLORE_TRANSACTIONS_TAB
        }
      ]
  const initialKey: number = useMemo(() => {
    const key = initialTab && Pages.findIndex(page => page.key === initialTab)

    if (!key || key === -1) {
      return 0
    }
    return key
  }, [initialTab, Pages])
  const [currentTab, setCurrentTab] = useState(initialKey)
  // const { component: Page, key: currentKey } = Pages[currentTab]
  // 选择币种
  const [currList, setCurrList] = useState<Curr[]>([])
  // 选中的币种
  const [activeCurr, setActiveCurr] = useState<Curr>()
  const [activeCurrValue, setActiveCurrValue] = useState('')
  const [address,setAddress] = useState('')

  // const handleClick = (index: number) => {
  //   setCurrentTab(index)
  // }
  const handleClick = (index: number) => {
    console.log('Text clicked!', index)
    setCurrentTab(index)
  }
  // 获取币种列表
  const getCategoryListData = async () => {
    const res = await getCategoryList()
    const data = res.data.map((item: any) => {
      const curr = currDataList.find(n => n?.value === item.token)
      let dat = {
        ...item,
        ...curr,
        value: item.token
      }
      console.log(dat,'dat')
      return {
        ...item,
        ...curr,
        value: item.token
      }
    })

    setCurrList(data)
  }

  const onBlur = (value:any) => {
    setAddress(value)
  }

  useEffect(() => {
    getCategoryListData()
  }, [])
  const setActiveCurrs = function(item: Curr) {
    setActiveCurr(item)
    setActiveCurrValue(item.value)
  }
  useEffect(() => {
    if(currList.length > 0) setActiveCurrs(currList[0])
    
    
  }, [currList])
  return (
    <Main>
      {/* <ExploreChartsSection /> */}
       <SelectType  list={currList} activeOption={activeCurr} setActiveOption={setActiveCurrs} />
      {/* <Flex>
        <Box p={3} width={1 / 2} color="white" bg="">
        <ChartComponent priceDecimals={3} token={activeCurrValue} carValue={0} />
        </Box>
        <Box p={3} width={1 / 2} color="white" bg="">
        <ChartComponent priceDecimals={3} token={activeCurrValue} carValue={1} />
        </Box>
      </Flex> */}
      <Candlestick token={activeCurrValue} />
    
      <Flex className='pt-20' alignItems="center" justifyContent="space-between">
        {Pages.map((page, index) => {
          return (
            <HeaderTab
              onClick={() => {
                handleClick(index)
              }}
              fontSize={24}
              fontWeight="bold"
              mr={10}
              key={index}
              active={currentTab === index}
            >
              {page.title}
            </HeaderTab>
          )
        })}
        <Box mx="auto" />
        { currentTab === 1 &&
          <Flex justifyContent="flex-start">
          <SearchBar value={address} onBlur={onBlur} placeholder={t('tokens.table.search.placeholder.transactions')} />
        </Flex>
        }
      </Flex>
      <CardMain>
      { currentTab === 0 && <ExploreTopPoolTable/>}
        { currentTab === 1 && <TableColumn address={address}/>}
        
      </CardMain>
    </Main>
  )
}
export default Explore
