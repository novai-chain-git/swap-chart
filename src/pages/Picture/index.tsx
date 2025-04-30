import React, { ComponentType, useEffect, NamedExoticComponent, useMemo, useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { ExploreTopPoolTable } from './pools/ExploreTopPoolsTable'
import TableColumn from './transactions/RecentTransactions'
import { Trans, useTranslation } from 'react-i18next'
import { ExploreTab, InterfaceElementName } from './type'
import { RowBetween } from '../../components/Row'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { NavLink } from 'react-router-dom'
import style from './chart.module.css'
import SelectType from '../../components/SelectType'

import Charts from '../../components/Charts'
import { SearchBar } from '../../components/Explore/SearchBar'

import { getContractFactory, coinList } from './pools/utils'
import { getKline, getCategoryList, getStat } from '../../requests'
import Candlestick from './Candlestick'
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

const FlexButton = styled.div`
  height: 36px;

  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid #e5e5e53b;
  border-radius: 10px;
`
const FlexBox = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.bg9};
  padding: 14px 0 20px 0;
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.border1};
  .renders {
    color: #21c95e;
  }
  .render {
    color: #ff5f52;
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
const Main = styled.div`
  width: 100%;
  max-width: 1240px;
  padding-top: 74px;
`
interface Curr {
  token: string
  priceDecimals: number
  name: string
  value: string
  lineColor: string
  areaColor: string
  img: string
  imgb: string
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

  const { t, i18n } = useTranslation()
  const Pages = [
    // {
    //   title: t('common.tokens'),
    //   key: ExploreTab.Tokens,
    //   component: TopTokensTable,
    //   loggingElementName: InterfaceElementName.EXPLORE_TOKENS_TAB
    // },

    {
      title: t('common.transactions'),
      key: ExploreTab.Transactions,
      loggingElementName: InterfaceElementName.EXPLORE_TRANSACTIONS_TAB
    },
    {
      title: t('common.pools'),
      key: ExploreTab.Pools,
      loggingElementName: InterfaceElementName.EXPLORE_POOLS_TAB
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
  const [activeCurr, setActiveCurr] = useState<Curr>(currList[0])
  const [activeCurrValue, setActiveCurrValue] = useState('')
  const [sma, setSma] = useState(false)
  const [stat, setStat] = useState({
    circulatingSupply: 0,
    lockedPosition: 0,
    marketCap: 0,
    trading24H: 0
  })

  const [address, setAddress] = useState('')
  const [lockedPosition, setLockedPosition] = useState<any>(0)

  const handleClick = (index: number) => {
    console.log('Text clicked!', index)
    setCurrentTab(index)
  }

  const onBlur = (value: any) => {
    setAddress(value)
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
      console.log(dat, 'dat')
      return {
        ...item,
        ...curr,
        value: item.token
      }
    })

    setCurrList(data)
  }

  const getLockedPosition = async () => {
    let num: any = 0
    setLockedPosition(num)
    let src = coinList.find(item => item.lable.toUpperCase() == activeCurr?.value.toUpperCase())
    //getContractFactory()
    if (src && src.address) {
      try {
        num = await getContractFactory(src.address)
        console.log(num, 'src')
        setLockedPosition(num * 2)
      } catch (e) {}
    }
    console.log(src, 'src')
  }
  const getStasData = async () => {
    try {
      const res = await getStat(activeCurr?.value)
      console.log(res, 'resresres')
      if (res.code === 0) {
        //let {} = res.data
        setStat(res.data)
      }
    } catch (e) {
      console.log(e, 'eeee')
    }
  }
  useEffect(() => {
    getCategoryListData()
  }, [])
  const setActiveCurrs = function(item: Curr) {
    setActiveCurr(item)
    setActiveCurrValue(item.value)
  }
  useEffect(() => {
    if (currList.length > 0) setActiveCurrs(currList[0])
  }, [currList])

  useEffect(() => {
    if (!activeCurr?.value) return

    getStasData()
    getLockedPosition()
    // debounce(()=>{

    // },300)
  }, [activeCurr?.value, i18n])

  function onSetSma() {
    setSma(!sma)
  }
  return (
    <Main>
      {/* <Candlestick token={activeCurrValue} /> */}
      <Charts sma={sma} priceDecimals={activeCurr?.priceDecimals} token={activeCurr?.value}>
        
        {({activeGraphType}:{activeGraphType:any})=>(
          <Flex alignItems="center" justifyContent="space-between">
          <SelectType list={currList} activeOption={activeCurr} setActiveOption={setActiveCurrs} />
  
          {activeGraphType == 'candlestick' && <FlexButton onClick={onSetSma}>{sma ? t('HideShort-termMAs') : t('ShowShort-termMAs')}</FlexButton>}
        </Flex>
        )}
      </Charts>
      <FlexBox>
        <ChartTitle>{t('Stats')}</ChartTitle>
        <ChartBoxCom>
          <ChartBoxComItem>
            <div className="title">{t('TVL')}</div>
            {/* <div className="value">{formatNumber(stat.lockedPosition, i18n.language, priceDecimals)}</div> */}
            <div className="value">{lockedPosition.toFixed(0)}</div>
          </ChartBoxComItem>
          <ChartBoxComItem>
            <div className="title">{t('Market cap')}</div>
            <div className="value">{lockedPosition.toFixed(0)}</div>
            {/* <div className="value">${formatNumber(stat.marketCap, i18n.language, priceDecimals)}</div> */}
            {/* <div className="value">{stat.marketCap.toFixed(0)}</div> */}
          </ChartBoxComItem>
          <ChartBoxComItem>
            <div className="title">{t('FDV')}</div>
            {/* <div className="value">${formatNumber(stat.circulatingSupply, i18n.language, priceDecimals)}</div> */}
            <div className="value">{stat.circulatingSupply.toFixed(0)}</div>
          </ChartBoxComItem>
          <ChartBoxComItem>
            <div className="title">{t('1 day volume')}</div>
            {/* <div className="value">{formatNumber(stat.trading24H, i18n.language, priceDecimals)}</div> */}
            <div className="value">{stat.trading24H.toFixed(0)}</div>
          </ChartBoxComItem>
        </ChartBoxCom>
      </FlexBox>

      <ChartSearchBar className="pt-40" alignItems="center" justifyContent="space-between">
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
        {currentTab === 1 && (
          <Flex justifyContent="flex-start">
            <SearchBar
              value={address}
              onBlur={onBlur}
              placeholder={t('tokens.table.search.placeholder.transactions')}
            />
          </Flex>
        )}
      </ChartSearchBar>

      {currentTab === 1 && (
        <CardMain>
          <ExploreTopPoolTable token={activeCurr?.value} />
        </CardMain>
      )}

      {currentTab === 0 && (
        <TableColumn address={address} token={activeCurr?.value} priceDecimals={activeCurr?.priceDecimals} />
      )}
    </Main>
  )
}
export default Explore
