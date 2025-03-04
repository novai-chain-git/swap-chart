import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { RowFixed } from '../Row'

import arrow from '../../assets/svg/arrow.svg'

export const FilterWrapper = styled(RowFixed)`
  //padding: 8px;
  //background: ${({ theme }) => theme.bgto1};
  //color: ${({ theme }) => theme.text1};
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`

const FilterWrapperImg = styled.img<{ ascending: boolean }>`
  width: 10px;
  transform: rotate(${({ ascending }) => (ascending ? 180 : 0)}deg);
`

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      {/* <Text fontSize={14} fontWeight={500}>
        {ascending ? '↑' : '↓'}
      </Text> */}
      <FilterWrapperImg ascending={ascending} src={arrow} />
    </FilterWrapper>
  )
}
