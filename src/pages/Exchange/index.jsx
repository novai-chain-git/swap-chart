import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import { ethers, Contract } from 'ethers'
import { WNOVAI_ABI } from '../../constants/abis/wnovai'

import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import Modal from '../../components/Modal'
import { TYPE, LinkStyledButton } from '../../theme'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { AutoRow, RowBetween } from '../../components/Row'
import { CloseIcon, Spinner } from '../../theme/components'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { ArrowDown } from 'react-feather'

import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { useCurrencyBalance, useETHBalances } from '../../state/wallet/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { useToggleSettingsMenu, useOpenMetamask } from '../../state/application/hooks'
import { Text } from 'rebass'

import { Field } from '../../state/swap/actions'

import novai from '../../assets/svg/novai.svg'
import Circle from '../../assets/images/blue-loader.svg'

import {
  ExchangeText,
  ExchangeFrom,
  ExchangeBoxTitle,
  ExchangeBoxCurr,
  ExchangeBoxCurrLeft,
  ExchangeBoxBalance,
  ExchangeBoxCurrImg,
  ExchangeBoxCurrName,
  ExchangeTo,
  ExchangeBoxText,
  ExchangeBoxCurrRight,
  ExchangeBoxInput,
  ExchangeBoxCurrRightDiv,
  ExchangeBoxCurrRightMax,
  ExchangeToNum,
  ExchangeModalDiv
} from './styleds'

export default function Exchange() {
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const openMetamask = useOpenMetamask()
  const [wNovaiBalance, setWNovaiBalance] = useState('')
  const [loading, setLoading] = useState(false)

  // 获取wnovai余额
  const rpc = process.env.REACT_APP_NETWORK_URL
  const signer = new ethers.providers.JsonRpcProvider(rpc)
  const contract = new Contract('0x4aC2abdDF928C3D01a208e880E101a1423dB6C73', WNOVAI_ABI, signer)
  const getBalance = async () => {
    if (!account) return
    const res = await contract.balanceOf(account)
    const number = ethers.utils.formatUnits(res, 18)
    const dotIndex = number.indexOf('.')
    const balance = number.slice(0, dotIndex + 6)
    return balance
  }

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isExpertMode] = useExpertModeManager()

  const { t } = useTranslation()
  const ArrowDiv = styled.div`
    height: 42px;
    border-radius: 21px;
    background-color: ${({ theme }) => theme.bg8};
    padding: 8px;
    cursor: pointer;
  `

  const ArrowSpan = styled.div`
    height: 26px;
    border-radius: 13px;
    background: ${({ theme }) => theme.bgto1};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 18px;
  `
  const ConfirmedIcon = styled(ColumnCenter)`
    padding: 60px 0;
  `
  const CustomLightSpinner = styled(Spinner)`
    height: 90px;
    width: 90px;
  `

  const [value, setValue] = useState('')
  const onUserInput = value => {
    if (value > wNovaiBalance) {
      return setValue(wNovaiBalance)
    }
    setValue(value)
  }
  const handleMax = () => {
    setValue(wNovaiBalance)
  }

  // 确认
  const onWrap = async () => {
    if (window.ethereum) {
      try {
        setLoading(true)
        const library = new ethers.providers.Web3Provider(window.ethereum)
        library.pollingInterval = 12000
        // wnovai兑换
        const wnovaiContract = new Contract(
          '0x4aC2abdDF928C3D01a208e880E101a1423dB6C73',
          WNOVAI_ABI,
          library.getSigner()
        )
        const num = ethers.utils.parseUnits(value, 18)
        const res = await wnovaiContract.withdraw(num)
        const tx = await res.wait()
        setLoading(false)
      } catch (error) {
        console.log('error', error)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const getBalanceFunc = async () => {
      const balance = await getBalance()
      setWNovaiBalance(balance)
    }
    getBalanceFunc()
  }, [account])
  return (
    <>
      <AppBody style={{ position: 'relative' }}>
        <SwapPoolTabs active={'exchange'} />
        {/* <ExchangeText>Exchange Novai</ExchangeText> */}
        <ExchangeFrom>
          <ExchangeBoxTitle>
            <TYPE.body color={theme.text1} fontWeight={500} fontSize={14} fontFamily={'OrbitronMedium'}>
              {t('Token From')}
            </TYPE.body>
            {account && (
              <TYPE.body
                color={theme.text2}
                fontWeight={500}
                fontSize={14}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {wNovaiBalance ? t('balance', { balanceInput: wNovaiBalance }) : ' -'}
              </TYPE.body>
            )}
          </ExchangeBoxTitle>
          <ExchangeBoxCurr>
            <ExchangeBoxCurrLeft>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
                style={{ backgroundColor: 'transparent', fontFamily: 'OrbitronMedium', fontSize: '28px' }}
              />
            </ExchangeBoxCurrLeft>
            <ExchangeBoxCurrRight>
              <ExchangeBoxCurrRightMax onClick={handleMax}>MAX</ExchangeBoxCurrRightMax>
              <ExchangeBoxCurrRightDiv>
                <ExchangeBoxCurrImg src={novai} />
                <ExchangeBoxCurrName>WNOVAI</ExchangeBoxCurrName>
              </ExchangeBoxCurrRightDiv>
            </ExchangeBoxCurrRight>
          </ExchangeBoxCurr>
        </ExchangeFrom>
        <AutoColumn
          justify="space-between"
          style={{ position: 'absolute', top: '168px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
        >
          <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
            <ArrowDiv>
              <ArrowSpan>
                <ArrowWrapper clickable style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ArrowDown
                    size="20"
                    //color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text1}
                    color={theme.text1}
                  />
                </ArrowWrapper>
              </ArrowSpan>
            </ArrowDiv>
          </AutoRow>
        </AutoColumn>

        <ExchangeTo>
          <ExchangeBoxTitle>
            <TYPE.body color={theme.text1} fontWeight={500} fontSize={14} fontFamily={'OrbitronMedium'}>
              {t('Token To')}
            </TYPE.body>
            {account && (
              <TYPE.body
                color={theme.text2}
                fontWeight={500}
                fontSize={14}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {account && userEthBalance ? t('balance', { balanceInput: userEthBalance?.toSignificant(6) }) : ' -'}
              </TYPE.body>
            )}
          </ExchangeBoxTitle>
          <ExchangeBoxCurr>
            <ExchangeBoxCurrLeft>
              <NumericalInput
                className="token-amount-input"
                value={value}
                style={{ backgroundColor: 'transparent', fontFamily: 'OrbitronMedium', fontSize: '28px' }}
                disabled={true}
              />
            </ExchangeBoxCurrLeft>
            <ExchangeBoxCurrRight>
              <ExchangeBoxCurrImg src={novai} />
              <ExchangeBoxCurrName>Novai</ExchangeBoxCurrName>
            </ExchangeBoxCurrRight>
          </ExchangeBoxCurr>
        </ExchangeTo>

        <BottomGrouping>
          {!account ? (
            <ButtonLight onClick={openMetamask}>{t('Connect Wallet')}</ButtonLight>
          ) : (
            <ButtonPrimary disabled={!value || value <= 0} onClick={onWrap}>
              {t('Confirm')}
            </ButtonPrimary>
          )}
        </BottomGrouping>
      </AppBody>

      <Modal isOpen={loading} onDismiss={() => setLoading(false)}>
        <ExchangeModalDiv>
          <ConfirmedIcon>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </ConfirmedIcon>
          <Text fontWeight={500} fontSize={20}>
            {t('Waiting For Confirmation')}
          </Text>
          <Text fontSize={12} color="#565A69" textAlign="center">
            {t('Confirm this transaction in your wallet')}
          </Text>
        </ExchangeModalDiv>
      </Modal>
    </>
  )
}
