import React, { ReactNode, useState, useRef, useEffect, RefObject, ReactElement } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
// import { Flex } from '../style'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { ChartSkeleton } from '../../../components/Charts/LoadingState'
import { ChartType } from '../../../components/Charts/utils'
import { Trans, useTranslation } from 'react-i18next'
import { Chart } from '../../../components/Charts/ChartModel'
import { TVLChartModel } from '../../../components/Charts/StackedLineChart'
// import { CustomVolumeChartModel } from "../../../components/VolumeChart"

import { createChart, CrosshairMode, LineStyle, IChartApi, ISeriesApi, LineData, UTCTimestamp } from 'lightweight-charts'
import { ChartHeader } from '../../../components/Charts/ChartHeader'

// import { Chart, refitChartContentAtom } from '../../../components/Charts/ChartModel'

// const Text = styled.span`
//   font-size: 16px;
//   font-weight: 300;
// `

const EXPLORE_CHART_HEIGHT_PX = 368

const SectionContainer = styled.div`
  position: relative;
  width: 47%;
  gap: 4px;
  background-color: rgba(19, 19, 21, 0.5);
`
interface ChartSectionHeaderProps {
  titleKey: string
  children?: ReactNode
}

function ChartSectionHeader({ titleKey, children }: ChartSectionHeaderProps) {
  const { t } = useTranslation()
  return (
    <Flex>
      <Text>{t(titleKey)}</Text>
      {children}
    </Flex>
  )
  // return (
  //   <Flex row justifyContent="space-between" alignItems="center" mb="$spacing8" height="34px">
  //     <SectionTitle>{t(titleKey)}</SectionTitle>
  //     {children}
  //   </Flex>
  // )
}
function TVLChartSection() {
  const [loading, setLoading] = useState<boolean>(true)

  const chartContainerRef: RefObject<HTMLDivElement> = useRef(null)
  const chartRef = useRef<IChartApi | null>(null)
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // 初始化图表
    // chartRef.current = createChart(chartContainerRef.current, {
    //   height: EXPLORE_CHART_HEIGHT_PX,
    //   layout: {
    //     background: { color: 'transparent' },
    //     textColor: '#333'
    //   }
    // })

    // // 添加线系列
    // lineSeriesRef.current = chartRef.current.addLineSeries({
    //   color: '#2962FF',
    //   lineWidth: 2
    // })

    // // 设置数据
    // // lineSeriesRef.current.setData(obj.data)
    // // 自适应缩放
    // chartRef.current.timeScale().fitContent()

    // return () => {
    //   chartRef.current?.remove()
    // }
  }, [])

  function toUTCTimestamp(value: number): UTCTimestamp {
    return value as UTCTimestamp
  }
  const obj = {
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
    data: [
      {
        time: toUTCTimestamp(1588636800),
        values: [0.989, 0]
      },
      {
        time: toUTCTimestamp(1736121600),
        values: [2303424341.2516665, 2255491162.5112615]
      },
      {
        time: toUTCTimestamp(1736121601),
        values: [2303424341.2516665, 2255491162.5112615]
      },
      {
        time: toUTCTimestamp(1739836800),
        values: [1512125019.4964962, 1859865910.3778791]
      }
    ]
  }

  return (
    <SectionContainer>
      <ChartSectionHeader titleKey="explore.uniswapTVL" />
      {(() => {
        if (loading === false) {
          const errorText = loading ? undefined : <Trans i18nKey="explore.unableToDisplayHistoricalTVL" />
          return <ChartSkeleton type={ChartType.TVL} height={EXPLORE_CHART_HEIGHT_PX} errorText={errorText} />
        }
        return (
          <Chart Model={TVLChartModel} params={obj} height={EXPLORE_CHART_HEIGHT_PX}>
            {crosshairData => <ChartHeader time={crosshairData?.time} protocolData={crosshairData} />}
          </Chart>
        )
        // return <div ref={chartContainerRef}></div>
      })()}
    </SectionContainer>
  )
}
export const DEFAULT_TOP_PRICE_SCALE_MARGIN = 0.32
export const DEFAULT_BOTTOM_PRICE_SCALE_MARGIN = 0.15
function VolumeChartSection() {
  const [loading, setLoading] = useState<boolean>(true)

  const [chartDivElement, setChartDivElement] = useState<HTMLDivElement | null>(null)
  function toUTCTimestamp(value: number): UTCTimestamp {
    return value as UTCTimestamp
  }
  const obj = {
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
    data: [
      {
        time: toUTCTimestamp(1588636800),
        values: [0.989, 0]
      },
      {
        time: toUTCTimestamp(1736121600),
        values: [2303424341.2516665, 2255491162.5112615]
      },
      {
        time: toUTCTimestamp(1736121601),
        values: [2303424341.2516665, 2255491162.5112615]
      },
      {
        time: toUTCTimestamp(1739836800),
        values: [1512125019.4964962, 1859865910.3778791]
      }
    ]
  }
  useEffect(() => {
    if (chartDivElement) {
      const chart = createChart(chartDivElement)
      const histogramSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume'
        }
      })
      chart.applyOptions({
        layout: { textColor: '#F9F9F9', background: { color: 'transparent' } },
        grid: {
          vertLines: {
            visible: false
          },
          horzLines: {
            visible: false
          }
        },
        rightPriceScale: {
          visible: false,
          borderVisible: false,
          autoScale: true,

          // scaleMargins: {
          //   top: 0.32,
          //   bottom: 0.15
          // }
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
      })

      histogramSeries.setData([
        { time: '2022-01-01', value: 10 },
        { time: '2022-01-02', value: 20 },
        { time: '2022-01-03', value: 5 },
        { time: '2022-01-04', value: 30 }
      ])
      // Providers the time period selector with a handle to refit the chart
      // setRefitChartContent(() => () => chartModelRef.current?.fitContent())
    }
  }, [chartDivElement])

  // useEffect(() => {
  //   if (chartDivElement && chartModelRef.current === undefined) {
  //     chartModelRef.current = new Model(chartDivElement, modelParams)
  //     // Providers the time period selector with a handle to refit the chart
  //     // setRefitChartContent(() => () => chartModelRef.current?.fitContent())
  //   }
  // }, [chartDivElement, modelParams])
  return (
    <SectionContainer>
      <ChartSectionHeader titleKey="explore.uniswuniVolumeapTVL" />
      {(() => {
        if (loading === false) {
          const errorText = loading ? undefined : <Trans i18nKey="explore.unableToDisplayHistoricalTVL" />
          return <ChartSkeleton type={ChartType.VOLUME} height={EXPLORE_CHART_HEIGHT_PX} errorText={errorText} />
        }
        // return <div>TVL Chart</div>
        return (
          <div ref={setChartDivElement} style={{ height: `${EXPLORE_CHART_HEIGHT_PX}px`, position: 'relative' }}></div>
        )
        // return (
        //     <Chart Model={TVLChartModel} params={obj} height={EXPLORE_CHART_HEIGHT_PX}>
        //       {crosshairData => <ChartHeader
        //       time={crosshairData?.time}
        //        protocolData={crosshairData} />}
        //     </Chart>
        //   )
      })()}
    </SectionContainer>
  )
}
export function ExploreChartsSection() {
  return (
    <Flex>
      <TVLChartSection />
      <VolumeChartSection />
    </Flex>
  )
}
