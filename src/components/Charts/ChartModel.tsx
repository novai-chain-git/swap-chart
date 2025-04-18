import { PROTOCOL_LEGEND_ELEMENT_ID, SeriesDataItemType } from './types'
import { getFormatNumber } from '../../utils/debounce'
import { v4 } from 'uuid'

import { useTranslation } from 'react-i18next'
import { DefaultTheme, useTheme } from '../../lib/styled-components'
import {
  BarPrice,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineStyle,
  Logical,
  TimeChartOptions,
  createChart,
  TickMarkType,
  UTCTimestamp
} from 'lightweight-charts'

import { StackedAreaSeries } from '../../components/Charts/StackedLineChart/stacked-area-series/stacked-area-series'
import { StackedAreaData } from '../../components/Charts/StackedLineChart/stacked-area-series/data'
import { StackedAreaSeriesOptions } from '../../components/Charts/StackedLineChart/stacked-area-series/options'
import React, { ReactElement, ReactNode, useEffect, useMemo, useRef, useState, RefObject } from 'react'
// import { CustomVolumeChartModelParams } from './VolumeChart/CustomVolumeChartModel'
export type TamaguiElement = HTMLElement

export function formatTickMarks(time: UTCTimestamp, tickMarkType: TickMarkType, locale: string): string {
  const date = new Date(time.valueOf() * 1000)
  switch (tickMarkType) {
    case TickMarkType.Year:
      return date.toLocaleString(locale, { year: 'numeric' })
    case TickMarkType.Month:
      return date.toLocaleString(locale, { month: 'short', year: 'numeric' })
    case TickMarkType.DayOfMonth:
      return date.toLocaleString(locale, { month: 'short', day: 'numeric' })
    case TickMarkType.Time:
      return date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric' })
    case TickMarkType.TimeWithSeconds:
      return date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', second: '2-digit' })
  }
}
interface ChartUtilParams<TDataType extends SeriesDataItemType> {
  locale: string
  theme: DefaultTheme
  format: ReturnType<any>
  isLargeScreen: boolean
  onCrosshairMove?: (data: TDataType | undefined) => void
}

interface ChartDataParams<TDataType extends SeriesDataItemType> {
  color?: string
  data: TDataType[]
  /** Repesents whether `data` is stale. If true, stale UI will appear */
  stale?: boolean
}

export type ChartModelParams<TDataType extends SeriesDataItemType> = ChartUtilParams<TDataType> &
  ChartDataParams<TDataType>

export type ChartHoverData<TDataType extends SeriesDataItemType> = {
  item: TDataType
  x: number
  y: number
  logicalIndex: Logical
}

export const DEFAULT_TOP_PRICE_SCALE_MARGIN = 0.32
export const DEFAULT_BOTTOM_PRICE_SCALE_MARGIN = 0.15
const isBetween = (num: number, lower: number, upper: number) => num > lower && num < upper
/** Util for managing lightweight-charts' state outside of the React Lifecycle. */
export abstract class ChartModel<TDataType extends SeriesDataItemType> {
  protected api: IChartApi
  protected abstract series: ISeriesApi<any>
  protected data: TDataType[] = []
  protected chartDiv: HTMLDivElement
  protected onCrosshairMove?: (data: TDataType | undefined, index: number | undefined) => void
  private _hoverData?: ChartHoverData<TDataType> | undefined
  private _lastTooltipWidth: number | null = null
  public tooltipId = `chart-tooltip-${v4()}`

  // constructor(chartDiv: HTMLDivElement, params: ChartModelParams<TDataType>) {
  constructor(chartDiv: HTMLDivElement, params: any) {
    this.chartDiv = chartDiv
    this.onCrosshairMove = params.onCrosshairMove
    this.data = params.data
    this.api = createChart(chartDiv)
    this.api.subscribeCrosshairMove(param => {
      let newHoverData: ChartHoverData<TDataType> | undefined = undefined
      const logical = param.logical
      const x = param.point?.x
      const y = param.point?.y

      if (
        x !== undefined &&
        isBetween(x, 0, this.chartDiv.clientWidth) &&
        y !== undefined &&
        isBetween(y, 0, this.chartDiv.clientHeight) &&
        logical !== undefined
      ) {
        const item = param.seriesData.get(this.series) as TDataType | undefined
        if (item) {
          newHoverData = { item, x, y, logicalIndex: logical }
        }
      }

      const prevHoverData = this._hoverData
      if (
        newHoverData?.item.time !== prevHoverData?.item.time ||
        newHoverData?.logicalIndex !== prevHoverData?.logicalIndex ||
        newHoverData?.x !== prevHoverData?.x ||
        newHoverData?.y !== prevHoverData?.y
      ) {
        this._hoverData = newHoverData
        this.onSeriesHover?.(newHoverData)
      }
    })

    this.updateOptions()
  }
  /**
   * Updates React state with the current crosshair data.
   * This method should be overridden in subclasses to provide specific hover functionality.
   * When overriding, call `super.onSeriesHover(data)` to maintain base functionality.
   */
  protected onSeriesHover(hoverData?: ChartHoverData<TDataType>) {
    this.onCrosshairMove?.(hoverData?.item, hoverData?.logicalIndex)

    if (!hoverData) {
      return
    }

    // Tooltip positioning modified from https://github.com/tradingview/lightweight-charts/blob/master/plugin-examples/src/plugins/tooltip/tooltip.ts
    const x = hoverData.x + this.api.priceScale('left').width() + 10
    const deadzoneWidth = this._lastTooltipWidth ? Math.ceil(this._lastTooltipWidth) : 45
    const xAdjusted = Math.min(x, this.api.paneSize().width - deadzoneWidth)

    const transformX = `calc(${xAdjusted}px)`

    const y = hoverData.y
    const flip = y <= 20 + 100
    const yPx = y + (flip ? 1 : -1) * 20
    const yPct = flip ? '' : ' - 100%'
    const transformY = `calc(${yPx}px${yPct})`

    const tooltip = document.getElementById(this.tooltipId)
    const legend = document.getElementById(PROTOCOL_LEGEND_ELEMENT_ID)

    if (tooltip) {
      tooltip.style.transform = `translate(${transformX}, ${transformY})`

      const tooltipMeasurement = tooltip.getBoundingClientRect()
      this._lastTooltipWidth = tooltipMeasurement?.width || null
    }
    if (legend) {
      // keep legend centered on mouse cursor if hovered
      legend.style.left = `${x}px`
      const heroWidth = 230
      // adjust height of tooltip if hovering below the hero text
      if (x < heroWidth) {
        legend.style.top = '80px'
      } else {
        legend.style.top = 'unset'
      }
      const transformOffset = 60
      const maxXOffset = this.api.paneSize().width - 40
      // keeps the legend centered on mouse x axis without getting cut off by chart edges
      if (x < transformOffset) {
        // Additional 4px of padding is added to prevent box-shadow from being cutoff
        legend.style.transform = `translateX(-${x - 4}%)`
      } else if (x > maxXOffset) {
        legend.style.transform = `translateX(-${transformOffset + (x - maxXOffset)}%)`
      } else {
        legend.style.transform = `translateX(-${transformOffset}%)`
      }
    }
  }

  public updateOptions(nonDefaultChartOptions?: DeepPartial<TimeChartOptions>) {
    const defaultOptions: DeepPartial<TimeChartOptions> = {
      localization: {
        locale: 'zh-Hans'
        // priceFormatter: (price: BarPrice) => format.formatFiatPrice({ price })
      },
      autoSize: true,
      layout: { textColor: '#F9F9F9', background: { color: 'transparent' } },
      timeScale: {
        tickMarkFormatter: formatTickMarks,
        borderVisible: false,
        ticksVisible: false,
        timeVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true
      },
      rightPriceScale: {
        visible: false,
        borderVisible: false,
        scaleMargins: {
          top: DEFAULT_TOP_PRICE_SCALE_MARGIN,
          bottom: DEFAULT_BOTTOM_PRICE_SCALE_MARGIN
        },
        autoScale: true
      },
      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          visible: false
        }
      },
      crosshair: {
        horzLine: {
          visible: true,
          style: LineStyle.Solid,
          width: 1,
          color: '#22222212',
          labelVisible: false
        },
        mode: CrosshairMode.Magnet,
        vertLine: {
          visible: true,
          style: LineStyle.Solid,
          width: 1,
          color: '#22222212',
          labelVisible: false
        }
      }
    }
    // console.log({ ...defaultOptions, ...nonDefaultChartOptions }, '{ ...defaultOptions, ...nonDefaultChartOptions }')
    this.api.applyOptions({ ...defaultOptions, ...nonDefaultChartOptions })
  }
  public fitContent() {
    this.api.timeScale().fitContent()
  }

  /** Removes the injected canvas from the chartDiv. */
  public remove() {
    this.api.remove()
  }

}
export function Chart<TParamType extends ChartDataParams<TDataType>, TDataType extends SeriesDataItemType>({
  Model,
  height,
  params,
  className,
  children
}: {
  // Model: new (chartDiv: HTMLDivElement, params: TParamType & ChartUtilParams<TDataType>) => ChartModel<TDataType>
  Model: new (chartDiv: HTMLDivElement, params: any) => ChartModel<TDataType>
  height: number
  params: TParamType
  className?: string
  children?: (crosshair?: TDataType) => ReactElement
}) {
  const chartContainerRef: RefObject<HTMLDivElement> = useRef(null)
  const chartRef = useRef<IChartApi | null>(null)
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const [chartDivElement, setChartDivElement] = useState<HTMLDivElement | null>(null)

  const [crosshairData, setCrosshairData] = useState<any | null>(null)
  const chartModelRef = useRef<ChartModel<TDataType>>()
  // const format = useFormatter()
  const { i18n } = useTranslation()
  const [hoveredLogicalIndex, setHoveredLogicalIndex] = useState<any | null>(null)


  const modelParams = useMemo(() => ({ ...params,onCrosshairMove: setCrosshairData }), [params])
  useEffect(() => {
    if (chartDivElement && chartModelRef.current === undefined) {
      chartModelRef.current = new Model(chartDivElement, modelParams)
      // Providers the time period selector with a handle to refit the chart
      // setRefitChartContent(() => () => chartModelRef.current?.fitContent())
    }
  }, [Model, chartDivElement, modelParams])

  useEffect(() => {
    if (chartModelRef.current) {
      chartModelRef.current?.updateOptions()
    }
    // chartModelRef.current?.updateOptions()
    // chartModelRef.current?.updateOptions()
  }, [modelParams, chartModelRef.current])
  // function children(crosshairData: SeriesDataItemType | undefined): React.ReactNode {
  //   throw new Error('Function not implemented.')
  // }

  // useEffect(() => {
  //   if (!chartContainerRef.current) return
  //   // 初始化图表
  //   chartRef.current = createChart(chartContainerRef.current)
  //   // chartRef.current.applyOptions({
  //   //   colors: ['#4C82FB', '#FC72FF', '#A457FF']
  //   // })
  //   chartRef.current.applyOptions({
  //     height: height,
  //     layout: {
  //       background: { color: 'transparent' },
  //       textColor: '#FFEFFF',
  //       attributionLogo: false
  //     },
  //     // localization: {
  //     //   locale: i18n.language === 'zh' ? 'zh-CN' : 'en-US',
  //     //   priceFormatter: (price: number) => getFormatNumber(price, 1)
  //     // },
  //     timeScale: {
  //       borderVisible: false,
  //       ticksVisible: false,
  //       timeVisible: true,
  //       fixLeftEdge: true,
  //       fixRightEdge: true
  //     },
  //     rightPriceScale: {
  //       borderVisible: false,
  //       visible: false,
  //       autoScale: true
  //     },
  //     grid: {
  //       vertLines: { visible: false }, // 隐藏垂直网格线
  //       horzLines: { visible: false } // 隐藏水平网格线
  //     },
  //     crosshair: {
  //       horzLine: {
  //         visible: true,
  //         style: 0, //实线
  //         width: 1,
  //         color: '#22222212',
  //         labelVisible: false
  //       },
  //       mode: CrosshairMode.Magnet,
  //       vertLine: {
  //         visible: true,
  //         style: 0,
  //         width: 1,
  //         color: '#22222212',
  //         labelVisible: false
  //       }
  //     }
  //   })

  //   const customSeriesView = new StackedAreaSeries()
  //   const myCustomSeries = chartRef.current.addCustomSeries(customSeriesView, {})
  //   // 添加线系列
  //   // lineSeriesRef.current = chartRef.current.addLineSeries({
  //   //   color: '#2962FF',
  //   //   lineWidth: 2
  //   // })
  //   myCustomSeries.applyOptions({
  //     priceLineVisible: false
  //   })
  //   chartRef.current.subscribeCrosshairMove(param => {
  //     console.log(param, 'param')
  //     // if (param?.logical !== hoveredLogicalIndex) {
  //     //   setHoveredLogicalIndex(param?.logical)
  //     //   myCustomSeries.applyOptions({
  //     //     hoveredLogicalIndex: hoveredLogicalIndex ?? (-1 as Logical) // -1 is used because series will use prev value if undefined is passed
  //     //   } as DeepPartial<StackedAreaSeriesOptions>)
  //     // }
  //   })
  //   const data = [
  //     {
  //       time: '2020-01-01',
  //       values: [2, 2]
  //     },
  //     {
  //       time: '2020-01-02',
  //       values: [30, 47]
  //     },
  //     {
  //       time: '2020-01-03',
  //       values: [30, 47]
  //     }
  //   ]
  //   myCustomSeries.setData(data)

  //   chartRef.current.subscribeCrosshairMove(param => {
  //     console.log(param, 'param')
  //   })

  //   // 设置数据
  //   // lineSeriesRef.current.setData(obj.data)

  //   // // 自适应缩放
  //   chartRef.current.timeScale().fitContent()

  //   // return () => {
  //   //   chartRef.current?.remove()
  //   // }
  // }, [Model, chartDivElement])

  // // 数据更新
  // useEffect(() => {
  //   if (lineSeriesRef.current) {
  //     chartRef.current?.timeScale().fitContent()
  //   }
  // }, [obj.data])
  return (
    <div ref={setChartDivElement} style={{ height: `${height}px`, position: 'relative' }}>
      {children && children(crosshairData)}
    </div>
  )
}
