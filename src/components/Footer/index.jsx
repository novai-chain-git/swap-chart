import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDarkModeManager } from '../../state/user/hooks'
import { useTranslation } from 'react-i18next'

import stickyImg from '../../assets/svg/sticky.svg'
import mail from '../../assets/svg/mail.svg'
import tm from '../../assets/svg/tm.svg'
import x from '../../assets/svg/x.svg'
import medium from '../../assets/svg/medium.svg'
import tchain from '../../assets/svg/tchain.svg'

const FooterContainer = styled.div`
  width: 100%;
  background-color: ${props => (props.isDark ? 'transparent' : '#fff')};
  position: relative;
  z-index: 2;
  border-top: 1px solid ${({ theme }) => theme.border1};
  padding: 0 150px;
  @media (max-width: 768px) {
    padding: 0px;
  }
`
const FooterCon = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-top: 41px;
  padding-bottom: 20px;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`
const Sticky = styled.div`
  padding-bottom: 6px;
  display: flex;
  justify-content: flex-end;
`
const StickyImg = styled.img`
  width: 11px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-right: 10px;
  }
`
const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`
const LogoCon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const LogoConTopLogo = styled.img`
  display: block;
  width: 92px;
  height: 42px;
`
const LogoConTopText = styled.div`
  margin-top: 14px;
  font-size: 15px;
  line-height: 22.5px;
  @media (max-width: 768px) {
    margin-top: 19px;
  }
`
const LogoConBtm = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 76px;
  @media (max-width: 768px) {
    margin-top: 20px; 
  }
`

const LogoConBtmLi = styled.li`
  margin-right: 27px;
  height: 16px;
  line-height: 1.5;
  :last-child {
    margin-right: 0;
  }
`

const LogoConBtmliA = styled.a`
  display: block;
  width: 16px;
`
const LogoConBtmliAImg = styled.img`
  display: block;
  width: 100%;
`
const FooterList = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const FooterListUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  padding-right: 97px;
  :last-child {
    padding-right: 30px;
  }
  @media (max-width: 768px) {
    margin-top: 10px;
    padding-right: 0;
    :last-child {
      padding-right: 0;
    }
  }
`
const FooterListUlLi = styled.li`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.green2};
  @media (max-width: 768px) {
    text-align: center;
  }
`
const FooterListLi = styled.li`
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.15s;
  height: 21px;
  font-size: 14px;
  line-height: 1.5;
  :hover {
    transform: translateX(10px);
  }
  :nth-child(2) {
    margin-top: 10px;
  }
  @media (max-width: 768px) {
    text-align: center;
  }
`

const FooterListA = styled.a`
  color: #999;
  text-decoration: none;
`

const FooterTom = styled.div`
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.5;
  @media (max-width: 768px) {
    margin-top: 10px;
    text-align: center;
  }
`

const Footer = props => {
  const { t } = useTranslation()
  const [isDark] = useDarkModeManager()

  const stickyClick = () => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  return (
    <FooterContainer isDark={isDark}>
      <FooterCon>
        <Sticky>
          <StickyImg src={stickyImg} onClick={stickyClick} />
        </Sticky>
        <FooterTop>
          <LogoCon>
             <LogoConTopLogo src={isDark ? '/images/home/logo_dark.svg' : '/images/home/logo.svg'} />
            <LogoConTopText>{t('Novai Chain is a next-generation Layer 1 AI public blockchain')}</LogoConTopText> 
            <LogoConBtm>
              <LogoConBtmLi>
                <LogoConBtmliA href="mailto:marketing@novaichain.co" target="_blank">
                  <LogoConBtmliAImg src={mail} />
                </LogoConBtmliA>
              </LogoConBtmLi>
              <LogoConBtmLi>
                <LogoConBtmliA href="https://t.me/Novai_Community" target="_blank">
                  <LogoConBtmliAImg src={tm} />
                </LogoConBtmliA>
              </LogoConBtmLi>
              <LogoConBtmLi>
                <LogoConBtmliA href="https://x.com/NovaiChain_" target="_blank">
                  <LogoConBtmliAImg src={x} />
                </LogoConBtmliA>
              </LogoConBtmLi>
              <LogoConBtmLi>
                <LogoConBtmliA href="https://medium.com/@novaidao" target="_blank">
                  <LogoConBtmliAImg src={medium} />
                </LogoConBtmliA>
              </LogoConBtmLi>
              <LogoConBtmLi>
                <LogoConBtmliA href="https://t.me/novarchain1" target="_blank">
                  <LogoConBtmliAImg src={tchain} />
                </LogoConBtmliA>
              </LogoConBtmLi>
            </LogoConBtm>
          </LogoCon>
          <FooterList>
            <FooterListUl>
              <FooterListUlLi>{t('About Us')}</FooterListUlLi>
              <FooterListLi>
                <FooterListA href="https://scan.novaichain.com/novaichain/aboutUs/privacyPolicy" target="_blank">
                  {t('Privacy Policy')}
                </FooterListA>
              </FooterListLi>
              <FooterListLi>
                <FooterListA href="https://scan.novaichain.com/novaichain/aboutUs/termsOfService" target="_blank">
                  {t('Terms of Service')}
                </FooterListA>
              </FooterListLi>
            </FooterListUl>
            <FooterListUl>
              <FooterListUlLi>{t('Services & Support')}</FooterListUlLi>
              <FooterListLi>
                <FooterListA href="https://medium.com/@novaidao" target="_blank">
                  {t('Medium')}
                </FooterListA>
              </FooterListLi>
              <FooterListLi>
                <FooterListA href="mailto:marketing@novaichain.co" target="_blank">
                  {t('Contact Us')}
                </FooterListA>
              </FooterListLi>
            </FooterListUl>
            <FooterListUl>
              <FooterListUlLi>{t('Resources')}</FooterListUlLi>
              <FooterListLi>
                <FooterListA href="https://scan.novaichain.com/novai_chain_intro.pdf" target="_blank">
                  {t('Novaichain Introduce')}
                </FooterListA>
              </FooterListLi>
              <FooterListLi>
                <FooterListA href="https://scan.novaichain.com/novai_chain_white_paper.pdf" target="_blank">
                  {t('Novaichain Whitepaper')}
                </FooterListA>
              </FooterListLi>
            </FooterListUl>
          </FooterList>
        </FooterTop>
        <FooterTom>Copyright© 2017-2025 novaichain.com</FooterTom>
      </FooterCon>
    </FooterContainer>
  )
}
export default Footer
