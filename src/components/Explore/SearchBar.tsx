import React, { NamedExoticComponent, useMemo, useState } from 'react'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ExploreTab } from '../../pages/Explore/type'

const ICON_SIZE = '20px'
export const SearchIconCommit = styled(SearchIcon)`
  cursor: pointer;
`
export const Cards = styled(Card)`
  cursor: pointer;
  border: 1px solid #333333;
  border-radius: 8px;
  position: relative;
  padding: 0 0px;

  height: 44px;
  background-color: #333333;
`
const SearchInput = styled.input<{ isOpen?: boolean }>`
  height: 100%;
  background-color: transparent;
  width: ${({ isOpen }) => (isOpen ? '260px' : '0')};
  color: #ffffff;
  box-shadow: none;
  outline: none;
  border: none;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 485;
  padding-left: 40px;
`
export const SearchBar = ({ placeholder,value, onBlur= () =>{} }: { placeholder?: string,value:any,onBlur?:(value:any) => void }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const currentString = 'useAtomValue(exploreSearchStringAtom)'
  const [localFilterString, setLocalFilterString] = useState('')
  const [searchText, setSearchText] = useState('')
  // const placeholdersText: Record<string, string> = {
  //   // [ExploreTab.Tokens]: t('tokens.table.search.placeholder.tokens'),
  //   [ExploreTab.Pools]: t('tokens.table.search.placeholder.pools'),
  //   [ExploreTab.Transactions]: t('tokens.table.search.placeholder.transactions')
  // }
  const handleFocus = () => setIsOpen(true)

  const handleBlur = (e:any) => {
    onBlur(e.target.value)
    
    if (searchText === '') {
      setIsOpen(false)
    }
  }

  return (
    <Cards pr={12} pl={12}>
      <SearchIconCommit
        fill={'#ffffff'}
        style={{ position: 'absolute', left: '12px', top: '10px' }}
        width={ICON_SIZE}
        height={ICON_SIZE}
        pointerEvents="none"
      />
      <SearchInput
        isOpen={isOpen}
        autoComplete="off"
        type="search"
        value={searchText}
      
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Cards>
  )
}
