import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useMemo, useState, useContext } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useDarkModeManager } from '../../state/user/hooks'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import DisconnectIcon from '../../assets/svg/Disconnect.svg'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../../connectors'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import { ThemeContext } from 'styled-components'

import Identicon from '../Identicon'
import Loader from '../Loader'

import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;
  padding: 0;
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: transparent;
      color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        background-color: transparent;
        border: none;
        color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  //background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.bgAddress)};
  background-color: transparent;
  // border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
  border: none;
  color: ${({ pending, theme }) => theme.text1};
  font-weight: 500;
  margin-left: 1px;
  margin-right: 1px;
  height: 100%;
  padding: 0;
  font-family: 'OrbitronMedium';
  font-size: 14px;
   :hover,
  :focus {
    background-color: ${({ pending, theme }) => theme.bg10};
    border: none;
    box-shadow: none;
    
  } 
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const Address = styled(Text)`
  margin: 0 10px 0 0;
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.text1};
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`
const WalletImg = styled.img<{ isDark: boolean }>`
  height: 20px;
  width: 20px;
  filter: ${({ theme, isDark }) => (isDark ? 'brightness(100)' : '')};
  @media screen and (max-width: 768px) {
    height: 16px;
    width: 16px;
  }
`
const MenuLn = styled.ul`
  border-radius: 10px;
  background: ${({ theme }) => theme.bgto1};
  padding: 1px;
  z-index: 100;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
  position: absolute;
  top: 20px;
  left: 50%;
  transition: all 0.3s;
  @media screen and (max-width: 768px) {
    top: 20px;
    left: auto;
    right: 15px;
  }
`
const MenuLnDiv = styled.div`
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
  padding: 5px 0;
`

const MenuLi = styled.li`
  height: 30px;
  padding: 0 16px;
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
const MenuLiImg = styled.img`
  display: block;
  height: 15px;
  margin-left: auto;
  marrgin-right: 10px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <img src={FortmaticIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <img src={PortisIcon} alt={''} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, connector, error, activate, deactivate } = useWeb3React()
  const theme = useContext(ThemeContext)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const [isDark] = useDarkModeManager()
  const [isShowMenu, setIsShowMenu] = useState(false)

  // 链接metamask
  const openMetamask = () => {
    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected) // a little janky...can't use setError because the connector isn't set
      }
    })
  }
  const disconnectMetamask = () => {
    deactivate()
    // eslint-disable-next-line
    // @ts-ignore
    /* window.ethereum.request({
      method: 'wallet_revokePermissions',
      // eslint-disable-next-line
      params: [{ eth_accounts: {} }]
    }) */
  }

  if (account) {
    // Web3StatusConnected onClick toggleWalletModal
    return (
      <Web3StatusConnected
        onMouseEnter={() => setIsShowMenu(true)}
        onMouseLeave={() => setIsShowMenu(false)}
        id="web3-status-connected"
        pending={hasPendingTransactions}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} Pending</Text> <Loader stroke={theme.green2} />
          </RowBetween>
        ) : (
          <>
            {hasSocks ? SOCK : null}
            <Address>{ENSName || shortenAddress(account)}</Address>
            <MenuLn className={isShowMenu ? 'dropdown_item' : 'dropdown_items'}>
              <MenuLnDiv>
                <MenuLi onClick={disconnectMetamask}>
                  <MenuLiImg src={DisconnectIcon} />
                  <Text style={{ borderBottom: 'none' }}>{t('Disconnect')}</Text>
                </MenuLi>
              </MenuLnDiv>
            </MenuLn>
          </>
        )}
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Switch Chain' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    // Web3StatusConnect onClick toggleWalletModal
    return (
      <Web3StatusConnect id="connect-wallet" onClick={openMetamask} faded={!account}>
        {/* <Text>{t('Connect to a wallet')}</Text> */}
        <WalletImg isDark={isDark} src={isDark ? '/images/home/walletb.svg' : '/images/home/wallet.svg'} />
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
