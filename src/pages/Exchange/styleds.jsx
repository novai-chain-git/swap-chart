import { Text } from 'rebass'
import styled from 'styled-components'

export const ExchangeText = styled.div`
  text-align: center;
  font-size: 24px;
`
export const ExchangeFrom = styled.div`
  padding: 5px 0;
  background: ${({ theme }) => theme.bg9};
  border-radius: 20px 20px 0 0;
`

export const ExchangeFromInput = styled.input`
  padding: 16px;
  background: ${({ theme }) => theme.bg9};
  border-radius: 14px;
`

export const ExchangeBoxTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem 0 1rem;
  line-height: 16px;
`

export const ExchangeBoxText = styled.div`
  font-size: 14px;
  font-family: 'OrbitronMedium';
`

export const ExchangeBoxCurr = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
`
export const ExchangeBoxCurrLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ExchangeBoxCurrRight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const ExchangeBoxCurrRightDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border1};
  padding: 1px;
  border-radius: 17px;
  padding-right: 0.75rem;
`

export const ExchangeBoxCurrRightMax = styled.button`
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

export const ExchangeBoxCurrImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`

export const ExchangeBoxCurrName = styled.div`
  font-size: 16px;
`

export const ExchangeBoxBalance = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text2};
`

export const ExchangeTo = styled.div`
  background: ${({ theme }) => theme.bg9};
  margin-top: 12px;
  border-radius: 0 0 20px 20px;
  padding-top: 5px;
`

export const ExchangeBoxInput = styled.input`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text2};
  background: ${({ theme }) => theme.bgto1};
`
export const ExchangeToNum = styled.div`
  font-family: OrbitronMedium;
  font-size: 28px;
`
export const ExchangeModalDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`
