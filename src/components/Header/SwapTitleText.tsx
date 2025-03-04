import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { AutoRow } from '../Row'

const SwapTitleText = styled(Text)`
  margin-top: 120px !important;
  margin-bottom: 30px !important;
  font-size: 50px;
  background-image: ${({ theme }) => theme.bgto1};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: 'OrbitronBold';
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 30px !important;
    margin-bottom: 20px !important;
    font-size: 20px;
  `};
`

export default function SwapTitleTextWrap() {
  return (
    <AutoRow justify="center" style={{ position: 'relative', zIndex: 2 }}>
      <SwapTitleText textAlign={'center'} fontWeight={700}>
        Novai Swap
      </SwapTitleText>
    </AutoRow>
  )
}
