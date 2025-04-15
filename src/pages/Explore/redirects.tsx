import React from 'react'
import Explore from './index'
import { ExploreTab } from './type'
import { Redirect, useLocation, useParams } from 'react-router-dom'

export function useExploreParams(): {
  tab?: ExploreTab
  chainName?: string
  tokenAddress?: string
} {
  const { tab, chainName, tokenAddress } = useParams<{ tab: string; chainName: string; tokenAddress: string }>()
  const isLegacyUrl = !useLocation().pathname.includes('explore')
  const exploreTabs = Object.values(ExploreTab)
  if (tab && !chainName && exploreTabs.includes(tab as ExploreTab)) {
    // /explore/:tab
    return { tab: tab as ExploreTab, chainName: undefined, tokenAddress }
  } else if (tab && !chainName) {
    // /explore/:chainName
    return { tab: undefined, chainName: tab, tokenAddress }
  } else if (isLegacyUrl && !tab) {
    // legacy /tokens, /tokens/:chainName, and /tokens/:chainName/:tokenAddress
    return { tab: ExploreTab.Tokens, chainName, tokenAddress }
  } else if (!tab) {
    // /explore
    return { tab: undefined, chainName: undefined, tokenAddress: undefined }
  } else {
    // /explore/:tab/:chainName
    return { tab: tab as ExploreTab, chainName, tokenAddress }
  }
}

export default function RedirectExplore() {
  const { tab } = useExploreParams()
  // const { tab, chainName, tokenAddress } = useExploreParams()
  // const isLegacyUrl = !useLocation().pathname.includes('explore')
  console.log(tab, 'tab')
  // if (isLegacyUrl) {
  //   if (tab && chainName && tokenAddress) {
  //     return <Navigate to={`/explore/${tab}/${chainName}/${tokenAddress}`} replace />
  //   } else if (chainName && tokenAddress) {
  //     return <Navigate to={`/explore/tokens/${chainName}/${tokenAddress}`} replace />
  //   } else if (tab && chainName) {
  //     return <Navigate to={`/explore/${tab}/${chainName}`} replace />
  //   }
  // }

  return <Explore initialTab={tab} />
}

// export default function RedirectOldRemove() {
//   return <div>asd</div>
// }
