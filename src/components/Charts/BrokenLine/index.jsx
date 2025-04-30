import React, { useRef, useEffect, useState, useMemo } from 'react'
import { createChart, ColorType, LineType, LineStyle, TickMarkType } from 'lightweight-charts'
import SelectType from '../../SelectType'
import { colors } from '../../../theme'
import { useIsDarkMode } from '../../../state/user/hooks'
import { useTranslation } from 'react-i18next'
import { getFormatNumber } from '../../../utils/debounce'
import { getKlineHistory, getKline } from '../../../requests'
import { Context } from '../../../pages/App.tsx'

import { formatDate } from '../../../utils/dateFormat'

import candle from '../../../assets/svg/candle.svg'
import candleb from '../../../assets/svg/candleb.svg'
import linechart from '../../../assets/svg/linechart.svg'
import linechartb from '../../../assets/svg/linechartb.svg'

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
    } = {},
    selectedInterval ={ name: '1H', value: 60 }
  } = props

  const { isLodaing, setIsLoading } = React.useContext(Context)

  // 是否可以拖拽 false 能拖拽 true 不能拖拽
  const [isDrag, setIsDrag] = useState(false)

  const chartContainerRef = useRef()
  const tooltipRef = useRef()

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

  // 图表数据
  const [data, setData] = useState([])
  // 获取图表数据
  const getChartData = async time => {
    const res = await getKline({ token: token, type: time, rows: 200 })
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


  useEffect(() => {
    if(selectedInterval.value && token){

      getChartData(selectedInterval.value)
      setIsDrag(false)
    }
  },[selectedInterval, token])


  // 选中的图表类型
  const [activeGraphType, setActiveGraphType] = useState({
    name: 'Line chart',
    value: 'line',
    img: linechart,
    imgb: linechartb
  })

  const [isHistory, setIsHistory] = useState(true)

  // useEffect(() => {
  //   if (!token) return
  //   getChartData(intervalsData[0].value)
  // }, [token])

  useEffect(() => {
    setHoverData(data[hoverIndex])
  }, [hoverIndex])

  // useEffect(() => {
  //   if (!hoverIndex || activeGraphType.value === 'line' || !hoverData || !hoverData.time) {
  //     return setIsShowTooltip(false)
  //   }
  //   // 图表切换
  //   if (activeGraphType.value === 'line') {
  //     setIsShowTooltip(false)
  //   } else if (activeGraphType.value === 'candlestick') {
  //     setIsShowTooltip(true)
  //   }
  // }, [activeGraphType, hoverIndex, hoverData])

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
  const maximumPrice = useMemo(() => {
    let value = 0
    if (activeGraphType.value == 'line') {
      value = data.length ? data.reduce((max, item) => (item.value > max ? item.value : max), data[0].value) : undefined
    } else {
      const list = data.filter(item => {
        return item.close >= item.open
      })
      value = list.reduce((min, item) => (item.close > min ? item.close : min), list[0]?.close)
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

  useEffect(() => {
    if (data?.length <= 0) return

    // 初始化
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        attributionLogo: false
      },
      width: chartContainerRef.current.clientWidth,
      height: 360,
      // 底部时间轴设置
      timeScale: {
        borderVisible: false
      },
      // 右侧价格轴设置
      rightPriceScale: {
        borderVisible: false
      },

      // 鼠标移入十字线设置
      crosshair: {
        vertLine: {
          labelVisible: false
        },
        horzLine: {
          labelVisible: false
        }
      },
      grid: {
        vertLines: { style: LineStyle.SparseDotted },
        horzLines: { style: LineStyle.SparseDotted }
      },
      localization: {
        locale: i18n.language === 'zh' ? 'zh-CN' : 'en-US',
        timeFormatter: time => formatDate(time),
        priceFormatter: price => '$' + getFormatNumber(price, priceDecimals)
      }
    })
    chart.timeScale().fitContent({})
    chart.timeScale().applyOptions({
      fixLeftEdge: isDrag,
      fixRightEdge: true,
      timeVisible: true,
      tickMarkFormatter: (time, tickMarkType, locale) => {
        // 返回不同时间下的格式
        const date = new Date(time * 1000)
        switch (tickMarkType) {
          case TickMarkType.Year:
            return date.getFullYear()

          case TickMarkType.Month:
            const month = new Intl.DateTimeFormat(locale, { month: 'short', hour12: true }).format(date)
            return month

          case TickMarkType.DayOfMonth:
            const day = new Intl.DateTimeFormat(locale, {
              month: 'short',
              day: 'numeric'
            }).format(date)
            return day

          case TickMarkType.Time:
            const timeFormatter = new Intl.DateTimeFormat(locale, {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }).format(date)
            return timeFormatter

          case TickMarkType.TimeWithSeconds:
            const seconds = new Intl.DateTimeFormat(locale, {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true
            }).format(date)
            return seconds

          default:
            return ''
        }
      }
    })

    let newSeries = null
    if (activeGraphType.value === 'line') {
      newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor })
      newSeries.applyOptions({
        lineType: LineType.Curved,
        priceLineVisible: false,
        lastValueVisible: false
      })
    } else if (activeGraphType.value === 'candlestick') {
      newSeries = chart.addCandlestickSeries({
        upColor: '#40b66b',
        downColor: '#ff5f52',
        borderVisible: false,
        wickUpColor: '#40b66b',
        wickDownColor: '#ff5f52'
      })
      newSeries.applyOptions({
        priceLineVisible: false,
        lastValueVisible: false
      })
    }
    newSeries.setData(data)

    let liceList = []
    chartContainerRef.current.addEventListener('mouseenter', () => {
      if (activeGraphType.value === 'line') {
      }
      const min = newSeries.createPriceLine(minimumPrice)
      const max = newSeries.createPriceLine(maximumPrice)
      liceList.push(min)
      liceList.push(max)
    })
    chartContainerRef.current.addEventListener('mouseleave', () => {
      liceList.forEach(item => {
        newSeries.removePriceLine(item)
      })
      liceList = []
    })

    chart.subscribeCrosshairMove(param => {
      if (param.time) {
        setHoverIndex(param.logical)
        if (activeGraphType.value === 'candlestick') {
          // 工具提示内容的位置
          let y = param.point.y + 10
          let x = param.point.x + 10

          if (y > chartContainerRef.current.offsetHeight - tooltipRef.current.offsetHeight - 40) {
            y = param.point.y - tooltipRef.current.offsetHeight - 10
          }

          if (x > chartContainerRef.current.offsetWidth - tooltipRef.current.offsetWidth - 40) {
            x = chartContainerRef.current.offsetWidth - tooltipRef.current.offsetWidth - 40
          }
          tooltipRef.current.style.top = `${y}px`
          tooltipRef.current.style.left = `${x}px`
        }
      } else {
        const lastIndex = newSeries.dataByIndex(Number.MAX_SAFE_INTEGER, -1)
        setHoverIndex(lastIndex)
        setIsShowTooltip(false)
      }
    })

    // const mainSeries = chart.addCandlestickSeries()
    // mainSeries.priceScale().applyOptions({
    //   ticksVisible: false
    // })

    // 历史数据
    chart.timeScale().subscribeVisibleLogicalRangeChange(async logicalRange => {
      // console.log('logicalRange', logicalRange)
      if (-20 < logicalRange.from && logicalRange.from < -10 && isHistory && !isDrag) {
        setIsHistory(false)
        setIsLoading(true)
        await getHistoryChartData()
        // newSeries.setData(data)
        setIsHistory(true)
        setIsLoading(false)
      }
    })

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    activeGraphType,
    i18n.language,
    isHistory,
    isDrag
  ])

  return (
    <>
      <div ref={chartContainerRef} className={style.ChartComponent}>
        <div className={isShowTooltip ? style.tooltipBox : style.tooltipBoxNone} ref={tooltipRef}>
          <div className={style.tooltipItem}>
            <span className={style.tooltipTitle}>Open:</span>${getFormatNumber(hoverData?.open, priceDecimals)}
          </div>
          <div className={style.tooltipItem}>
            <span className={style.tooltipTitle}>High:</span>${getFormatNumber(hoverData?.high, priceDecimals)}
          </div>
          <div className={style.tooltipItem}>
            <span className={style.tooltipTitle}>Low:</span>${getFormatNumber(hoverData?.low, priceDecimals)}
          </div>
          <div className={style.tooltipItem}>
            <span className={style.tooltipTitle}>Close:</span>${getFormatNumber(hoverData?.close, priceDecimals)}
          </div>
        </div>

        {hoverData?.value > 0 && (
          <div className={style.hoverData}>
            <div className={style.hoverDataTitle}>${getFormatNumber(hoverData?.value, priceDecimals)}</div>
            <div className={style.hoverDataInfo}>
              <div className={style.hoverDataAmplitude}>
                <div className={hoverData?.chg > 0 ? style.triangleUp : style.triangleDown}></div>
                <span style={{ color: hoverData?.chg > 0 ? '#40b66b' : '#ff5f52' }}>
                  {(hoverData?.chg > 0 ? hoverData?.chg * 100 : hoverData?.chg * -100).toFixed(2)}%
                </span>
              </div>
              <div className={style.hoverDataTime}>{formatDate(hoverData?.time)}</div>
            </div>
          </div>
        )}
      </div>
      {/* <div className={style.chartBom}>
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
      </div> */}
    </>
  )
}

export default ChartComponent
