import { Currency, Pair } from '@uniswap/sdk'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg10 : theme.primary6)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 17px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: 1px solid ${({ selected, theme }) => (selected ? theme.border1 : theme.border2)};
  padding: 0 1px;

  :focus,
  :hover {
    //background-color: ${({ selected, theme }) => theme.bg2};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.75rem 0 0;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean; location: string }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput, location }) =>
    hideInput ? '8px' : location === 'top' ? '20px 20px 0 0' : location === 'bottom' ? '0 0 20px 20px' : '20px'};
  background-color: ${({ theme }) => theme.bg9};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  padding:5px 0;
  // border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  // border: 1px solid ${({ theme }) => theme.bg2};
  // background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
 // ${({ active }) => (active ? '  margin: 0 0.75rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
 margin: 0 0.75rem 0 0.75rem;
  //font-size:  ${({ active }) => (active ? '20px' : '16px')};
  font-size: 16px;

`

const StyledBalanceMax = styled.button`
  height: 28px;
  background: ${({ theme }) => theme.bgto1};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 1px;
  font-weight: 500;
  -webkit-background-clip: text;
  background-clip: text;
  cursor: pointer;
  margin-right: 10px;
  color: transparent;
  font-family: 'OrbitronBold';

  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`
const StyledBalanceMaxDiv = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bgto3};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  location?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  location = 'all' // top为上面两个角, bottom为下面两个角, all为全部
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id} location={location}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text1} fontWeight={500} fontSize={14} fontFamily={'OrbitronMedium'}>
                {t(label)}
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? t('balance', { balanceInput: selectedCurrencyBalance?.toSignificant(6) })
                    : ' -'}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
                style={{ backgroundColor: 'transparent', fontFamily: 'OrbitronMedium', fontSize: '28px' }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={32} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'32px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
