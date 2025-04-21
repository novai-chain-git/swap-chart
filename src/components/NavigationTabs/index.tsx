import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
  font-family: 'OrbitronMedium';
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-bottom: 10px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`
  `}
`

const Dot = styled.div<{ isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, isActive }) => (isActive ? theme.bgto1 : theme.bg8)};
  margin-right: 9px;

  
  ${({ theme }) => theme.mediaWidth.upToMedium`
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`
  margin-right: 3px;
  width: 4px;
  height: 4px;
  `}
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 18px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  height: 17px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`
    font-size: 11px;
  `} ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  height: 17px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`
    font-size: 11px;
  `}
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' | 'exchange' }) {
  const { t } = useTranslation()
  return (
    <Tabs >
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        <Dot isActive={active === 'swap'} />
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        <Dot isActive={active === 'pool'} />
        {t('pool')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/exchange'} isActive={() => active === 'exchange'}>
        <Dot isActive={active === 'exchange'} />
        {t('Exchange')}
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  const { t } = useTranslation()
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{t('Import Pool')}</ActiveText>
        <QuestionHelper text={t('Import Pool Tip')} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  const { t } = useTranslation()
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{adding ? t('addLiquidity') : t('removeLiquidity')}</ActiveText>
        <QuestionHelper text={adding ? t('Add Liquidity Tip') : t('Remove Liquidity Tip')} />
      </RowBetween>
    </Tabs>
  )
}
