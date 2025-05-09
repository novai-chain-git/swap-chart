import React, { useRef, useEffect, useState, useMemo,useContext } from 'react'
import { createChart, ColorType, LineType, LineStyle, TickMarkType } from 'lightweight-charts'
import SelectType from '../SelectType'
import { colors } from '../../theme'
import { useIsDarkMode } from '../../state/user/hooks'
import { useTranslation } from 'react-i18next'
import { getFormatNumber } from '../../utils/debounce'
import { getKlineHistory, getKline } from '../../requests'
import { Context } from '../../pages/App.tsx'
import styled, { ThemeContext } from 'styled-components'

import { formatDate } from '../../utils/dateFormat'
import BrokenLine from './BrokenLine'
import KLine from './KLine'

import candle from '../../assets/svg/candle.svg'
import candleb from '../../assets/svg/candleb.svg'
import linechart from '../../assets/svg/linechart.svg'
import linechartb from '../../assets/svg/linechartb.svg'

import style from './chartComponent.module.css'

const ChartBom = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  
  ${({ theme }) => theme.mediaWidth.upToMedium`
  display: block;
  font-size: 14px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`

  `}
`
const SelectBom = styled.div`
 

  
  ${({ theme }) => theme.mediaWidth.upToMedium`
   margin-top: 10px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraMINI`

  `}
`
const ChartComponent = props => {
  
    const theme = useContext(ThemeContext)
  const darkMode = useIsDarkMode()
  const { text1, bgto1, bg8 } = colors(darkMode)
  const { i18n } = useTranslation()
  const {
    priceDecimals, // 小数位数
    token,
    sma = false,
    colors: {
      backgroundColor = 'transparent',
      lineColor = '#85d25a',
      textColor = text1,
      areaTopColor = '#85d25a',
      areaBottomColor = 'rgba(108, 201, 109, 0.28)'
    } = {},
    children
  } = props

  // 鼠标移动到点上的数据
  const [hoverData, setHoverData] = useState({
    time: 0,
    value: 0,
    open: 0,
    close: 0,
    high: 0,
    low: 0,
    chg: 0
  })

  const [minType, setMinType] = useState(true)

  // 时间间隔
  const intervalsData = [
    { name: '1m', value: 1 },
    { name: '10m', value: 10 },
    { name: '15m', value: 15 },
    { name: '1H', value: 60 },
    { name: '1D', value: 1440 },
    { name: '1W', value: -7 },
    { name: '1M', value: -30 },
    { name: '1Y', value: -365 }
  ]

  // 提示工具是否显示
  const [isShowTooltip, setIsShowTooltip] = useState(false)
  // 提示工具内的值
  // const [tooltipValue, setTooltipValue] = useState(null)
  // 鼠标移入的数值的下标
  const [hoverIndex, setHoverIndex] = useState(null)

  // 是否可以拖拽 false 能拖拽 true 不能拖拽
  const [isDrag, setIsDrag] = useState(false)
  // 图表数据
  const [data, setData] = useState([])

  const [screenSize, setScreenSize] = useState(true)
  // 选中的时间间隔
  const [selectedInterval, setSelectedInterval] = useState(intervalsData[3])

  const handleIntervalClick = data => {
    setSelectedInterval(data)
    setIsDrag(false)
  }

  // 图表类型
  const [graphType, setGraphType] = useState([
    {
      name: 'Line chart',
      value: 'line',
      img: linechart,
      imgb: linechartb
    },
    {
      name: 'Candlestick',
      value: 'candlestick',
      img: candle,
      imgb: candleb
    }
  ])
  // 选中的图表类型
  const [activeGraphType, setActiveGraphType] = useState(graphType[0])

  useEffect(() => {
    if (!hoverIndex || activeGraphType.value === 'line' || !hoverData || !hoverData.time) {
      return setIsShowTooltip(false)
    }
    // 图表切换
    if (activeGraphType.value === 'line') {
      setIsShowTooltip(false)
    } else if (activeGraphType.value === 'candlestick') {
      setIsShowTooltip(true)
    }
  }, [activeGraphType, hoverIndex, hoverData])

  //获取最小数据
  const minimumPrice = useMemo(() => {
    let value = 0

    if (activeGraphType.value == 'line') {
      value = data.length
        ? data.reduce((min, item) => (item?.value < min ? item?.value : min), data[0]?.value)
        : undefined
    } else {
      const list = data.filter(item => {
        return item?.close < item?.open
      })
      value = list.reduce((min, item) => (item?.open < min ? item?.open : min), list[0]?.open)
    }
    return {
      price: value,
      color: '#c7c7c7',
      lineWidth: 2,
      lineStyle: 2, // LineStyle.Dashed
      axisLabelVisible: minType,
      title: ''
    }
  })


  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      if(width <= 960){
        setScreenSize(false)
      }else{
        setScreenSize(true)
      }

    }

    handleResize() // 初始调用
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      {children && children({ activeGraphType: activeGraphType.value })}
      {/* {children({ activeGraphType })} */}
      {activeGraphType.value === 'candlestick' && <KLine sma={sma} selectedInterval={selectedInterval} token={token} />}
      {activeGraphType.value === 'line' && (
        <BrokenLine selectedInterval={selectedInterval} epriceDecimals={priceDecimals} token={token} />
      )}

      <ChartBom>
        <div className={style.chartBomBox} style={{ background: bgto1 }}>
          <div
            className={style.intervals}
            style={{ borderColor: darkMode === true ? '#ddd' : 'rgba(34, 34, 34, 0.07)', background: bg8 }}
          >
            {intervalsData.map((item, i) => (
              <div
                key={i}
                className={
                  selectedInterval.name === item.name
                    ? `${style.intervalItem} ${style.intervalItemActive}`
                    : style.intervalItem
                }
                onClick={() => handleIntervalClick(item)}
                style={{ background: selectedInterval.name === item.name ? bgto1 : 'transparent' }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <SelectBom>
        <SelectType
            list={graphType}
            activeOption={activeGraphType}
            setActiveOption={setActiveGraphType}
            isShowText={false}
            isRight={screenSize}
            smIcon={true}
          />
        </SelectBom>
  
      </ChartBom>
    </div>
  )
}

export default ChartComponent
