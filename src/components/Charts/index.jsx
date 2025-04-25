import React, { useRef, useEffect, useState, useMemo } from 'react'
import { createChart, ColorType, LineType, LineStyle, TickMarkType } from 'lightweight-charts'
import SelectType from '../SelectType'
import { colors } from '../../theme'
import { useIsDarkMode } from '../../state/user/hooks'
import { useTranslation } from 'react-i18next'
import { getFormatNumber } from '../../utils/debounce'
import { getKlineHistory, getKline } from '../../requests'
import { Context } from '../../pages/App.tsx'

import { formatDate } from '../../utils/dateFormat'
import BrokenLine from './BrokenLine'
import KLine from './KLine'

import candle from '../../assets/svg/candle.svg'
import candleb from '../../assets/svg/candleb.svg'
import linechart from '../../assets/svg/linechart.svg'
import linechartb from '../../assets/svg/linechartb.svg'

import style from './chartComponent.module.css'
const ChartComponent = props => {
  const darkMode = useIsDarkMode()
  const { text1, bgto1, bg8 } = colors(darkMode)
  const { i18n } = useTranslation()
  const {
    priceDecimals, // 小数位数
    token,
    colors: {
      backgroundColor = 'transparent',
      lineColor = '#85d25a',
      textColor = text1,
      areaTopColor = '#85d25a',
      areaBottomColor = 'rgba(108, 201, 109, 0.28)'
    } = {}
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
    { name: '1M', value: 1 },
    { name: '10M', value: 10 },
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
  // 获取图表数据
  const getChartData = async time => {
    const res = await getKline({ token: token, type: time })
    if (res.data) {
      const arr = res.data.map(item => {
        return {
          ...item,
          value: item.close
        }
      })
      setData(arr)
    }
  }

  // 选中的时间间隔
  const [selectedInterval, setSelectedInterval] = useState(intervalsData[2])

  const handleIntervalClick = data => {
    setSelectedInterval(data)
    getChartData(data.value)
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
    if (!token) return
    getChartData(intervalsData[0].value)
  }, [token])

  useEffect(() => {
    setHoverData(data[hoverIndex])
  }, [hoverIndex])

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


  // 获取历史图表数据
  const getHistoryChartData = async () => {
    const res = await getKlineHistory({ token: token, type: selectedInterval.value, lastTime: data[0]?.time })
    if (res.data.length <= 0) return setIsDrag(true)
    if (res.data) {
      const arr = res.data.map(item => {
        return {
          ...item,
          value: item.close
        }
      })
      const arr1 = arr.reverse()
      setData([...arr1, ...data])
      // return arr1
    }
  }



  return (
    <>
    {activeGraphType.value === 'candlestick' && <KLine selectedInterval={selectedInterval} token={token}/>}
    {activeGraphType.value === 'line' && <BrokenLine selectedInterval={selectedInterval} epriceDecimals={priceDecimals} token={token}/>}
    
      <div className={style.chartBom}>
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

        <div className={style.graphType}>
          <SelectType
            list={graphType}
            activeOption={activeGraphType}
            setActiveOption={setActiveGraphType}
            isShowText={false}
            isRight={true}
            smIcon={true}
          />
        </div>
      </div>
    </>
  )
}

export default ChartComponent
