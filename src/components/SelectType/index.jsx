import React, { useState, useEffect } from 'react'
import { theme } from '../../theme'
import style from './selecttype.module.css'

import dropdown from '../../assets/svg/dropdown.svg'
import dropdownb from '../../assets/svg/dropdownb.svg'
import { useIsDarkMode } from '../../state/user/hooks'

const SelectType = ({ list, activeOption, setActiveOption, isShowText = true, isRight, smIcon = false }) => {
  const isDarkMode = useIsDarkMode()
  const themeColor = theme(isDarkMode)
  const CurrClick = item => {
    setActiveOption(item)
  }

  const [showOption, setShowOption] = useState(false)
  const handleShowCurr = e => {
    window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    setShowOption(!showOption)
  }

  useEffect(() => {
    window.addEventListener('click', () => {
      setShowOption(false)
    })
  })

  return (
    <div className={style.selectType}>
      <div className={style.currBox}>
        <div
          className={isDarkMode ? `${style.activeCurr} ${style.darkMode}` : style.activeCurr}
          onClick={handleShowCurr}
          style={{ borderColor: themeColor.border1 }}
        >
          <img
            src={isDarkMode ? activeOption?.imgb : activeOption?.img}
            className={style.currImg}
            style={{ width: smIcon && '18px', height: smIcon && '18px' }}
          />
          {isShowText && <span className={style.currName}>{activeOption?.name}</span>}
          <img src={isDarkMode ? dropdownb : dropdown} alt="" className={style.dropdownImg} />
        </div>
        <div
          className={showOption ? `${style.currList} ${style.currListShow}` : style.currList}
          style={isRight && { right: 0 }}
        >
          {list.map(item => (
            <div
              key={item.value}
              className={isDarkMode ? `${style.currListItem} ${style.currListItemDark}` : style.currListItem}
              onClick={() => CurrClick(item)}
            >
              <img
                src={item.img}
                className={style.currImg}
                style={{ width: smIcon && '18px', height: smIcon && '18px' }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default SelectType
