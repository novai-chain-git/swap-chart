import { Chart, ChartModel, ChartModelParams } from '../ChartModel'
import {
  CustomStyleOptions,
  DeepPartial,
  ISeriesApi,
  LineStyle,
  Logical,
  UTCTimestamp,
  WhitespaceData
} from 'lightweight-charts'
import { StackedAreaData } from './stacked-area-series/data'
// import { multipleBarData } from './stacked-area-series/sample-data'
import { StackedAreaSeries } from './stacked-area-series/stacked-area-series'
import { StackedAreaSeriesOptions } from './stacked-area-series/options'

export interface StackedLineData extends WhitespaceData<UTCTimestamp> {
  values: number[]
}

interface TVLChartParams extends ChartModelParams<StackedLineData> {
  colors: string[]
  gradients?: { start: string; end: string }[]
}


export class TVLChartModel extends ChartModel<StackedLineData> {
  protected series: ISeriesApi<'Custom'>
  private hoveredLogicalIndex: Logical | null | undefined

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // constructor(chartDiv: HTMLDivElement, params: TVLChartParams) {
  constructor(chartDiv: HTMLDivElement, params: TVLChartParams) {
    super(chartDiv, params)
    this.series = {} as ISeriesApi<'Custom'>

    this.series = this.api.addCustomSeries(new StackedAreaSeries(), {} as DeepPartial<CustomStyleOptions>)
    this.series.setData(params.data)
    this.updateOptions(params)
    this.api.subscribeCrosshairMove(param => {
      if (param?.logical !== this.hoveredLogicalIndex) {
        this.hoveredLogicalIndex = param?.logical
        console.log(param,'param')
        this.series.applyOptions({
          hoveredLogicalIndex: this.hoveredLogicalIndex ?? (-1 as Logical) // -1 is used because series will use prev value if undefined is passed
        } as DeepPartial<StackedAreaSeriesOptions>)
      }
    })
    this.api.timeScale().fitContent()
  }

  updateOptions(params: any) {
    const isSingleLineChart = false

    const gridSettings = isSingleLineChart
      ? {
        grid: {
          vertLines: { style: 5, color: '#CECECE' },
          horzLines: { style: 5, color: '#CECECE' }
        }
          // grid: {
          //   vertLines: { style: LineStyle.CustomDotGrid, color: '#CECECE' },
          //   horzLines: { style: LineStyle.CustomDotGrid, color: '#CECECE' }
          // }
        }
      : {}

    super.updateOptions({
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        visible: isSingleLineChart, // Hide pricescale on multi-line charts
        borderVisible: false,
        scaleMargins: {
          top: 0.25,
          bottom: 0
        },
        autoScale: true
      },
      ...gridSettings
    })
    // const { data } = params

    // Handles changes in data, e.g. time period selection
    // if (this.data !== data) {
    //   this.data = [
    //     {
    //       time: toUTCTimestamp(1588636800),
    //       values: [0.989, 0, 0]
    //     },
    //     {
    //       time: toUTCTimestamp(1736121600),
    //       values: [2303424341.2516665, 2255491162.5112615, 0]
    //     },
    //     {
    //       time: toUTCTimestamp(1736121600),
    //       values: [2303424341.2516665, 2255491162.5112615, 0]
    //     },
    //     {
    //       time: toUTCTimestamp(1739836800),
    //       values: [1512125019.4964962, 1859865910.3778791, 75128929.65814592]
    //     }
    //   ]
    //   this.series.setData(this.data)
    //   this.fitContent()
    // }

    console.log(this.series, 'this.series')
    if (this.series) {
      this.series.applyOptions({
        priceLineVisible: false,
        lastValueVisible: false,
        colors: ['#4C82FB', '#FC72FF'],
        gradients: [
          {
            start: 'rgba(96, 123, 238, 0.20)',
            end: 'rgba(55, 70, 136, 0.00)'
          },
          {
            start: 'rgba(252, 116, 254, 0.20)',
            end: 'rgba(252, 116, 254, 0.00)'
          }
        ],
        lineWidth: 2.5
      } as DeepPartial<StackedAreaSeriesOptions>)
    }
  }

  // updateOptions() {}
}
