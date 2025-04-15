import React from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

export enum ExploreTab {
  Tokens = 'tokens',
  Pools = 'pools',
  Transactions = 'transactions'
}
export const Flex = styled.div`
  display: flex;
`
