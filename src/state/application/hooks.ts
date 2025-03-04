import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { injected } from '../../connectors'

import { addPopup, PopupContent, removePopup, toggleWalletModal, toggleSettingsMenu } from './actions'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../index'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useWalletModalOpen(): boolean {
  return useSelector((state: AppState) => state.application.walletModalOpen)
}

export function useWalletModalToggle(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(toggleWalletModal()), [dispatch])
}

export function useSettingsMenuOpen(): boolean {
  return useSelector((state: AppState) => state.application.settingsMenuOpen)
}

export function useToggleSettingsMenu(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(toggleSettingsMenu()), [dispatch])
}

export function useOpenMetamask(): () => void {
  const { activate } = useWeb3React()
  // 链接metamask
  const openMetamask = () => {
    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected) // a little janky...can't use setError because the connector isn't set
      }
    })
  }
  return openMetamask
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
}
