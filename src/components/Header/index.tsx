// import { ChainId } from '@uniswap/sdk'
import React, { useEffect, useState } from 'react'
// import { isMobile } from 'react-device-detect'
import { Link, useLocation } from 'react-router-dom'
import { Text } from 'rebass'
import i18next from 'i18next'

import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

// import LogoDark from '../../assets/svg/logo_white.svg'
// import Wordmark from '../../assets/svg/wordmark.svg'
// import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

// import { YellowCard } from '../Card'
import Settings from '../Settings'
// import Menu from '../Menu'

// import Row, { AutoRow, RowBetween } from '../Row'
import Web3Status from '../Web3Status'
// import VersionSwitch from './VersionSwitch'
import { langList, switchPageTitleAndDesc } from '../../i18n'
import chainSucessIcon from '../../assets/images/chain-sucess-icon.png'

import bigswap from '../../assets/svg/big_swap.svg'
import bigbaiseswap from '../../assets/svg/bigbaise_swap.svg'
import bigtwotup from '../../assets/svg/bigtwo_tup.svg'
import bigtwobaisetup from '../../assets/svg/bigtwobaise_tup.svg'
import smiswap from '../../assets/svg/smi_swap.svg'
import smitup from '../../assets/svg/smi_tup.svg'
import smitwoswap from '../../assets/svg/smitwo_swap.svg'
import smitwotup from '../../assets/svg/smitwo_tup.svg'
import choose from '../../assets/svg/choose.svg'

import './header.css'

const HeaderFrame = styled.div<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 23px;
  height: 74px;
  width: 100%;
  top: 0;
  position: fixed;
  z-index: 99;
  background-color: ${({ theme, isDark }) => (isDark ? 'rgba(44 47 54,0.5)' : 'rgba(255, 255, 255,0.5)')};
  backdrop-filter: blur(10px);
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0 15px;
    height: 54px;
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  text-decoration: none;

  :hover {
    cursor: pointer;
  }
`

/* const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
` */
const AccountDiv = styled.div<{ active: boolean }>`
  background: ${({ theme, active }) => (!active ? 'transparent' : theme.bgto1)};
  height: 36px;
  border-radius: 8px;
  padding: 1px;
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? 'transparent' : theme.bg8)};
  border-radius: 8px;
  height: 100%;
  white-space: nowrap;
  width: 100%;
  padding: 0 15px;
  font-family: 'OrbitronMedium';
  font-size: 14px;

  :focus {
    border: 1px solid blue;
  }
`
/* 
const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`
 */
const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`
const TriangleDiv = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid ${({ theme }) => theme.bg6};

  margin-left: 16px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`

const Vertical = styled.div`
  width: 1px;
  height: 18px;
  background-color: ${({ theme }) => theme.bg6};
  margin: 0 16px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`

const LogoImg = styled.img`
  display: block;
  height: 42px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 29px;
  `};
`
const LangDiv = styled.div`
  height: 74px;
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 40px;
  @media screen and (max-width: 768px) {
    height: 54px;
    margin: 0 10px;
    position: static;
  }
`
const LangImg = styled.img<{ isDark: boolean }>`
  display: block;
  height: 20px;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
  filter: ${({ theme, isDark }) => (isDark ? 'brightness(100)' : '')};
`
const LnagUiDiv = styled.div`
  width: 120px;
  border-radius: 10px;
  background: ${({ theme }) => theme.bgto1};
  padding: 1px;
  position: absolute;
  top: 44px;
  left: 50%;
  transition: all 0.3s;
  z-index: 100;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
  margin-top: 16px;
  @media screen and (max-width: 768px) {
    top: 29px;
    left: auto;
    right: 15px;
  }
`

const LangLn = styled.ul`
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
  padding: 10px 0;
  margin: 0;
`
const LangLi = styled.li`
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  @media screen and (max-width: 768px) {
    padding: 0 10px;
    font-size: 13px;
  }
`
const LangLiImg = styled.img`
  display: block;
  width: 12px;
  margin-left: auto;
`

const Menu = styled.div`
  display: flex;
  margin-right: auto;
  margin-left: 40px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`
const SetupDiv = styled.div`
  margin-left: 10px;
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const SetupDivImg = styled.img`
  display: block;
  width: 20px;
  height: 20px;
`

const SetupMenu = styled.div`
  border-radius: 10px;
  background-color: #fff;
  padding: 10px 0;
  width: 100px;
  z-index: 100;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
  position: absolute;
  top: 43px;
  right: 15px;
  transition: all 0.3s;
`
const AMenu = styled.a`
`
const SetupMenuItemImg = styled.img`
  width: 16px;
  height: 16px;
`

/* const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.ZXY]: process.env.REACT_APP_CHAIN_NAME as string
} */

export default function Header() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { pathname } = useLocation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  const [isShowLang, setIsShowLang] = useState(false)
  const [acLang, setAcLang] = useState(localStorage.getItem('i18nextLng') || 'en')

  const [isShowMenu, setIsShowMenu] = useState(false)

  // 菜单
  const menu = [
    {
      name: t('swap'),
      link: '/swap',
      img: smiswap,
      activeImg: smitwoswap,
      showImg: bigswap,
      markShowImg: bigbaiseswap
    },
    {
      name: t('Chart'),
      link: '/picture',
      img: smitwotup,
      activeImg: smitup,
      showImg: bigtwotup,
      markShowImg: bigtwobaisetup
    },
    {
      name: t('Bridge'),
      link: 'https://bridge.novaichain.com/#/',
      external: true,
      img: smitwotup,
      activeImg: smitup,
      showImg: bigtwotup,
      markShowImg: bigtwobaisetup
    }
  ]

  // 选中的菜单
  const [selectedImg, setSelectedImg] = useState(menu[0])

  const langChange = (lang: string) => {
    i18next.changeLanguage(lang)
    setAcLang(lang)
    setIsShowLang(false)
    switchPageTitleAndDesc(lang)
  }

  const onClickActiveLink = (item: any) => {
    setIsShowMenu(false)
    setSelectedImg(item)
  }

  useEffect(() => {
    const newLang: string = localStorage.getItem('i18nextLng') || 'en'
    setAcLang(newLang)
    let arr: any = {}
    if (pathname === '/') {
      return setSelectedImg(menu[0])
    }
    menu.forEach(item => {
      if (item.link === pathname) {
        arr = item
      }
    })
    setSelectedImg(arr)
  }, [])

  return (
    <HeaderFrame isDark={isDark}>
      <HeaderElement>
        <Title href="https://www.novaichain.com">
          {isDark ? (
            <LogoImg src="/images/home/logo_dark.svg" alt="logo" />
          ) : (
            <LogoImg src="/images/home/logo.svg" alt="logo" />
          )}
        </Title>
      </HeaderElement>
      <Menu>
        {menu.map(item => {
          if (item.external) {
            return ( <AMenu href={item.link} target="_blank"
              style={{
                textDecoration: 'none',
                color: isDark ? '#fff' : '#000',
                marginRight: '20px',
                paddingBottom: '3px',
                borderBottom: selectedImg.link === item.link ? '1px solid #85d25a' : '1px solid transparent'
              }} rel="noopener noreferrer">
              {item.name}
            </AMenu>)
          }
          return (
            <Link
              key={item.link}
              to={item.link}
              style={{
                textDecoration: 'none',
                color: isDark ? '#fff' : '#000',
                marginRight: '20px',
                paddingBottom: '3px',
                borderBottom: selectedImg.link === item.link ? '1px solid #85d25a' : '1px solid transparent'
              }}
              onClick={() => setSelectedImg(item)}
            >
              {item.name}
            </Link>
          )
        })}
      </Menu>
      <HeaderControls>
        <HeaderElementWrap>
          {/* <VersionSwitch /> */}
          <Settings />
          {/* <Menu /> */}
        </HeaderElementWrap>
        <HeaderElement>
          <LangDiv onMouseEnter={() => setIsShowLang(true)} onMouseLeave={() => setIsShowLang(false)}>
            <LangImg
              isDark={isDark}
              src={isDark ? '/images/home/langb.svg' : '/images/home/lang.svg'}
              onClick={() => setIsShowLang(true)}
            />
            <LnagUiDiv className={isShowLang ? 'dropdown_item' : 'dropdown_items'}>
              <LangLn>
                {langList.map((item, i) => (
                  <LangLi
                    key={i}
                    onClick={() => langChange(item.value)}
                    className={item.value === acLang ? 'lang_active' : ''}
                  >
                    {item.name}
                    {item.value === acLang && <LangLiImg src={choose} />}
                  </LangLi>
                ))}
              </LangLn>
            </LnagUiDiv>
          </LangDiv>
          {/* <TestnetWrapper>
            {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
          </TestnetWrapper> */}
          <AccountDiv active={!!account}>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <>
                  <BalanceText style={{ flexShrink: 0 }}>{userEthBalance?.toFixed(4, undefined, 1)} NOV</BalanceText>
                  <TriangleDiv></TriangleDiv>
                  <Vertical></Vertical>
                </>
              ) : null}
              <Web3Status />
              <div id="switch-chain-tip">
                <img alt="switch chain tip icon" className="switch-chain-tip-icon" src={chainSucessIcon} />
                {t('SwitchNetWrokSuccess')}
              </div>
            </AccountElement>
          </AccountDiv>

          <SetupDiv onMouseEnter={() => setIsShowMenu(true)} onMouseLeave={() => setIsShowMenu(false)}>
            <SetupDivImg
              src={isDark ? selectedImg.markShowImg : selectedImg.showImg}
              onClick={() => setIsShowMenu(true)}
            />
            <SetupMenu className={isShowMenu ? 'show_meny' : 'hide_menu'}>
              {menu.map(item => (
                <Link
                  key={item.link}
                  to={item.link}
                  className={['setup_menu_item', selectedImg.link === item.link ? 'setup_menu_item_active' : ''].join(
                    ' '
                  )}
                  onClick={() => onClickActiveLink(item)}
                >
                  <SetupMenuItemImg src={selectedImg.link === item.link ? item.activeImg : item.img} />
                  {item.name}
                </Link>
              ))}
            </SetupMenu>
          </SetupDiv>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
