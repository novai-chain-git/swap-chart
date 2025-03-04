import React from 'react'
import styled from 'styled-components'

const BodyDiv = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.bgto1};
  padding: 1px;
  border-radius: 30px;
`

export const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  padding: 1rem;
`
export const Body = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.bg7};
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.65);
  border-radius: 30px;
  padding: 1rem;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <BodyDiv>
      <Body>{children}</Body>
    </BodyDiv>
  )
}
