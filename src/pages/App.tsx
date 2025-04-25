import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Spinner } from '../theme/components'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SwapTitleText from '../components/Header/SwapTitleText'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
// import MigrateV1 from './MigrateV1'
// import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
// import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Explore from './Explore/redirects'
import Swap from './Swap'
import Chart from './Chart'
import Exchange from './Exchange'
import Picture from './Picture'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import { BackgroundImage } from '../components/Header/BackgroundImage'
import { switchPageTitleAndDesc } from '../i18n'
import lightcircle from '../assets/images/blue-loader.svg'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow: hidden;
  position: relative;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // padding-top: 160px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  min-height: calc(100vh - 301.5px);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 16px 16px;
  `};

  z-index: 1;
`

const FooterrWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const Loading = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: ${({ theme }) => theme.bg9};
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingImg = styled(Spinner)`
  height: 90px;
  width: 90px;

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`
const LoadingDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const LoadingText = styled.div`
  margin-top: 10px;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const SwapTitleTextContent = () => {
  const location = useLocation()
  console.log('location', location.pathname)

  return location.pathname === '/chart' || location.pathname === '/explore' || location.pathname === '/picture' ? null : <SwapTitleText />
}

const SwapBg = () => {
  const location = useLocation()
  return location.pathname === '/chart' || location.pathname === '/explore' || location.pathname === '/picture' ? null : <BackgroundImage />
}

export const Context = React.createContext({ isLodaing: false, setIsLoading: (value: boolean) => {} })

export default function App() {
  const acLang = localStorage.getItem('i18nextLng') || 'en'
  switchPageTitleAndDesc(acLang)
  const [isChartPage, setIsChanrtPage] = useState(window.location.hash === '#/chart')

  // 全局状态
  const [isLodaing, setIsLoading] = useState(false)
  return (
    <Context.Provider value={{ isLodaing, setIsLoading }}>
      <Suspense fallback={null}>
        <HashRouter>
          <Route component={GoogleAnalyticsReporter} />
          <Route component={DarkModeQueryParamReader} />
          <AppWrapper>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper>
              <SwapTitleTextContent />
              <Popups />
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/explore" component={Explore} />
                  <Route exact strict path="/picture" component={Picture} />
                  <Route exact strict path="/swap" component={Swap} />
                  <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                  <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                  <Route exact strict path="/find" component={PoolFinder} />
                  <Route exact strict path="/pool" component={Pool} />
                  <Route exact strict path="/exchange" component={Exchange} />
                  <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                  <Route exact path="/add" component={AddLiquidity} />
                  <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  {/* <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} /> */}
                  <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                  <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                  <Route exact strict path="/chart" component={Chart} />
                  {/* <Route exact strict path="/migrate/v1" component={MigrateV1} />
                <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} /> */}
                  <Route component={RedirectPathToSwapOnly} />
                </Switch>
              </Web3ReactManager>
              <Marginer />
            </BodyWrapper>
            <FooterrWrapper>
              <Footer />
            </FooterrWrapper>
            <SwapBg />
          </AppWrapper>
        </HashRouter>
        {isLodaing && (
          <Loading>
            <LoadingDiv>
              <LoadingImg src={lightcircle} alt="loading" />
              <LoadingText>Loading...</LoadingText>
            </LoadingDiv>
          </Loading>
        )}
      </Suspense>
    </Context.Provider>
  )
}
