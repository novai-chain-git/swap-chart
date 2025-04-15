import React, { ComponentType, NamedExoticComponent, useMemo, useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { TopTokensTable } from './tokens'
import { ExploreTopPoolTable } from './pools/ExploreTopPoolsTable'
import { RecentTransactions } from './transactions/RecentTransactions'
import { Trans, useTranslation } from 'react-i18next'
import { ExploreTab, InterfaceElementName } from './type'
import { RowBetween } from '../../components/Row'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { NavLink } from 'react-router-dom'
import { SearchBar } from '../../components/Explore/SearchBar'

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
function usePages(): Array<Page> {
  const { t } = useTranslation()
  return [
    // {
    //   title: t('common.tokens'),
    //   key: ExploreTab.Tokens,
    //   component: TopTokensTable,
    //   loggingElementName: InterfaceElementName.EXPLORE_TOKENS_TAB
    // },
    {
      title: t('common.pools'),
      key: ExploreTab.Pools,
      component: ExploreTopPoolTable,
      loggingElementName: InterfaceElementName.EXPLORE_POOLS_TAB
    },
    {
      title: t('common.transactions'),
      key: ExploreTab.Transactions,
      component: RecentTransactions,
      loggingElementName: InterfaceElementName.EXPLORE_TRANSACTIONS_TAB
    }
  ]
}
const Main = styled.div`
  width: 100%;
  max-width: 1240px;
  padding-top: 74px;
`

const Explore = ({ initialTab }: { initialTab?: ExploreTab }) => {
  const { t } = useTranslation()
  const Pages = usePages()
  const initialKey: number = useMemo(() => {
    const key = initialTab && Pages.findIndex(page => page.key === initialTab)

    if (!key || key === -1) {
      return 0
    }
    return key
  }, [initialTab, Pages])
  const [currentTab, setCurrentTab] = useState(initialKey)
  const { component: Page, key: currentKey } = Pages[currentTab]

  // const handleClick = (index: number) => {
  //   setCurrentTab(index)
  // }
  const handleClick = (index: number) => {
    console.log('Text clicked!', index)
    setCurrentTab(index)
  }
  return (
    <Main>
      <Flex justifyContent="space-between">
        <Flex flex="1">
          <Flex flexDirection="column" alignItems="center">
            <Text>{t('stats.volume.1d.long')}</Text>
            <Text>asd</Text>
            <Text>asd</Text>
          </Flex>
        </Flex>
        <Flex flex="1">
          <Flex flexDirection="column" alignItems="center">
            <Text>{t('common.assemble')}Uniwap YVL</Text>
            <Text>asd</Text>
            <Text>asd</Text>
          </Flex>
        </Flex>
        <Flex flex="1">
          <Flex flexDirection="column" alignItems="center">
            <Text>v2 TVL</Text>
            <Text>asd</Text>
            <Text>asd</Text>
          </Flex>
        </Flex>
        <Flex flex="1">
          <Flex flexDirection="column" alignItems="center">
            <Text>v3 TVL</Text>
            <Text>asd</Text>
            <Text>asd</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
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
        <Flex justifyContent="flex-start">
          <SearchBar tab={currentKey} />
        </Flex>
      </Flex>
      <CardMain>
        <Page />
      </CardMain>
    </Main>
  )
}
export default Explore
