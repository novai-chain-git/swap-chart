import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { Text } from 'rebass'

export const ModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`

export const FadedSpan = styled(RowFixed)`
  color: ${({ theme }) => theme.primary1};
  font-size: 14px;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

export const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background: ${({ theme, disabled }) => !disabled && theme.bgto3};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 40px; !important;
    font-size: 12px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`
    height: 36px; !important;
    font-size: 11px;
  `}
`

export const SearchTitle = styled(Text)`
  font-size: 16px;
  display: flex;
  align-items: center;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 12px;
  `}
`
export const SearchTokenName = styled(Text)`
  font-size: 14px
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 12px;
  `}
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.border2};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 8px;
    font-size: 12px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`
    padding: 4px;
    font-size: 11px;
    
  `}
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.border1};
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`
