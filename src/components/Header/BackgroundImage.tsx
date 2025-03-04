import React from 'react'
import styled from 'styled-components'

export const BackgroundImage = styled.div`
  width: 960px;
  height: 960px;
  background: ${({ theme }) => theme.bgto2};
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;

  @media (max-width: 768px) {
    width: 100%;
    height: 550px;
    top: 50px;
  }
`
