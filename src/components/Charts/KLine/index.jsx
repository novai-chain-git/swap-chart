// HighchartsChart.jsx
import React, { useEffect, useRef, useState } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import styled from 'styled-components'

import { getKlineHistory, getKline } from '../../../requests'
import { Context } from '../../../pages/App.tsx'

const chark = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  background-color: #0a0a0a;
  height: 40px;
  z-index: 10;
`
const HighchartsChart = ({ token, sma = false, selectedInterval = { name: '1H', value: 60 } }) => {
  const [options, setOptions] = useState(null)

  //const [isHistory, setIsHistory] = useState(true)
  const isHistory = useRef(true)
  // 图表数据
  const [data, setData] = useState([])
  const chartRef = useRef(null)
  const [isDrag, setIsDrag] = useState(false)
  const isInitLoad = useRef(true)
  const { isLodaing, setIsLoading } = React.useContext(Context)

  function fixTimestamp(t) {
    return t < 1e11 ? t * 1000 : t // 如果是秒级（10位），就乘1000
  }
  const getChartData = async () => {
    const res = await getKline({ token: token, type: selectedInterval.value, rows: 200 })
    setOptions(null)
    if (res.data) {
      setData(res.data)
    }
  }
  //  const type = true
  // 获取历史图表数据
  const getHistoryChartData = async () => {
    try {
      const chart = chartRef.current?.chart
      if (!chart) return

      const res = await getKlineHistory({ token: token, type: selectedInterval.value, lastTime: data[0]?.time })
      if (res.data.length <= 0) return setIsDrag(true)
      if (res.data) {
        // chart.redraw()
    //  const arr = res.data.map(item => {
    //     return {
    //       ...item,
    //       value: item.close
    //     }
    //   })
        //    console.log(mergedData.length,'mergedData')
      const arr1 = res.data.reverse()
        setData([...arr1, ...data])
      }
    } catch (e) {
    } finally {
    }
  }
  //格式化数据
  function formatData(arr) {
    const ohlc = []
    const volume = []
    let previousCandleClose = 0

    arr.forEach(item => {
      ohlc.push([
        fixTimestamp(item.time), // time
        item.open, // open
        item.high, // high
        item.low, // low
        item.close // close
      ])
      volume.push({
        x: fixTimestamp(item.time),
        y: item.amount,
        color: item.close > previousCandleClose ? '#466742' : '#a23f43',
        labelColor: item.close > previousCandleClose ? '#51a958' : '#ea3d3d'
      })
      previousCandleClose = item.close
    })
    return { ohlc, volume }
  }
  useEffect(() => {
    const chart = chartRef.current?.chart
    if (!chart) return
    Highcharts.setOptions({
      chart: {
        backgroundColor: '#0a0a0a',
        height: 500
      },
      title: { style: { color: '#cccccc' } },
      xAxis: {
        gridLineColor: '#181816',
        labels: { style: { color: '#9d9da2' } }
      },
      yAxis: {
        gridLineColor: '#181816',
        labels: { style: { color: '#9d9da2' } }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        style: { color: '#cdcdc9' }
      },
      scrollbar: {
        barBackgroundColor: '#464646',
        barBorderRadius: 0,
        barBorderWidth: 0,
        buttonBorderWidth: 0,
        buttonArrowColor: '#cccccc',
        rifleColor: '#cccccc',
        trackBackgroundColor: '#121211',
        trackBorderRadius: 0,
        trackBorderWidth: 1,
        trackBorderColor: '#464646'
      }
    })
  }, [chartRef])
  useEffect(() => {
    console.log(data.length, 'data.length')
    // return
    if (data.length > 0) {
      const ohlc = []
      const volume = []
      let previousCandleClose = 0
      data.forEach(item => {
        ohlc.push([
          fixTimestamp(item.time), // time
          item.open, // open
          item.high, // high
          item.low, // low
          item.close // close
        ])
        volume.push({
          x: fixTimestamp(item.time),
          y: item.amount,
          color: item.close > previousCandleClose ? '#466742' : '#a23f43',
          labelColor: item.close > previousCandleClose ? '#51a958' : '#ea3d3d'
        })
        previousCandleClose = item.close
      })
      console.log(data.length, 'data.length')
      // let {ohlc,volume} = formatData(data)

      let initialMin = ohlc[ohlc.length - 90] ? ohlc[ohlc.length - 90][0] : ohlc[0][0]
      let initialMax = ohlc[ohlc.length - 1][0]

      const smaList = sma
        ? [
            {
              type: 'sma',
              linkedTo: 'aapl',
              params: { period: 3 },
              color: '#FFD700',
              name: 'MA3'
            },
            {
              type: 'sma',
              linkedTo: 'aapl',
              params: { period: 5 },
              color: '#00FFFF',
              name: 'MA5'
            },
            {
              type: 'sma',
              linkedTo: 'aapl',
              params: { period: 10 },
              color: '#728efd',
              name: 'MA10'
            }
          ]
        : []
      // const smaList = [{
      //   type: 'sma',
      //   linkedTo: 'aapl',
      //   params: { period: 3 },
      //   color: '#FFD700',
      //   name: 'MA3'
      // },
      // {
      //   type: 'sma',
      //   linkedTo: 'aapl',
      //   params: { period: 5 },
      //   color: '#00FFFF',
      //   name: 'MA5'
      // },
      // {
      //   type: 'sma',
      //   linkedTo: 'aapl',
      //   params: { period: 10 },
      //   color: '#728efd',
      //   name: 'MA10'
      // }]
      setOptions({
        rangeSelector: { enabled: false, inputEnabled: true, selected: 1 },
        navigator: {
          enabled: true,
          adaptToUpdatedData: false,
          baseSeries: 0,
          height: 20
        },

        scrollbar: {
          enabled: true
        },

        chart: {
          panning: {
            enabled: true,
            type: 'x' // 仅允许水平拖动
          },
          events: {
            load: function(as) {
              // 初始加载后强制显示最新数据范围
              this.xAxis[0].setExtremes(null, null)
            }
          }
        },
        title: { text: token },
        plotOptions: {
          series: {
            marker: {
              enabled: true,
              states: { hover: { enabled: false } }
            },
            dataGrouping: {
              enabled: false // 确保关闭数据分组
            }
          },

          candlestick: {
            color: '#ea3d3d',
            upColor: '#51a958',
            upLineColor: '#51a958',
            lineColor: '#ea3d3d',
            grouping: false, // 关闭分组
            minPointLength: 2 // 确保最小可见高度
          }
          // candlestick: {
          //   color: '#ea3d3d',
          //   upColor: '#51a958',
          //   upLineColor: '#51a958',
          //   lineColor: '#ea3d3d',
          //   pointWidth: 7,
          //   // grouping: false,         // 禁用分组，避免在小屏上过于拥挤
          //   // pointWidth: 8,          // 固定蜡烛宽度
          //   // minPointLength: 3       // 最小高度，避免太小的蜡烛看不见

          //   grouping: false,          // 禁用自动分组
          //   pointPadding: 0.1,        // 蜡烛之间的内边距 (0-1)
          //   pointWidth: calculatePointWidth(),            // 固定蜡烛宽度(像素)
          //   minPointLength: 3,        // 最小蜡烛高度
          //   borderWidth: 1            // 边框宽度
          // }
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 800
              },
              // chartOptions: {
              //   rangeSelector: {
              //     inputEnabled: false
              //   }
              // },
              chartOptions: {
                // 保持相同的分组策略
                plotOptions: {
                  candlestick: {
                    groupPixelWidth: 8 // 与大屏保持一致
                  }
                },
                // 仅调整视觉元素
                xAxis: {
                  labels: {
                    rotation: -45,
                    style: {
                      fontSize: '10px'
                    }
                  }
                }
              }
            }
          ]
        },
        xAxis: {
          min: initialMin,
          max: initialMax,
          // min: initial.initialMin ,
          // max: initial.initialMax ,
          events: {
            setExtremes: async function(e) {
              // if (!e.trigger || e.trigger !== 'pan') return; // 仅处理拖动事件

              const chart = chartRef.current?.chart
              // 计算是否拖动到左侧边缘（阈值设为5%）
              const min = e.min
              const range = e.max - e.min
              const threshold = min - range * 0.05
               const oldest = ohlc[0]?.[0]
              if (oldest && threshold <= oldest && isHistory.current && !isDrag) {
                console.log(e, 'eventseventseventsevents')
                console.log(threshold, 'oldestDataPoint',oldest)
                isHistory.current = false
                setIsLoading(true)
                await getHistoryChartData()
                isHistory.current = true
                setIsLoading(false)
              }
            }
          }
        },
        // xAxis: {
        //   gridLineWidth: 1,
        //   crosshair: { snap: false },
        //   events: {
        //     setExtremes: async function(e) {
        //       console.log(e, 'eventseventseventsevents')

        //       // 如果拖到接近左边缘，则加载更多历史数据
        //       if (!e.min || !e.max) return
        //       // 检查是否接近左边缘（例如前5%的区域）
        //       const range = e.max - e.min
        //       const threshold = e.min - range * 0.05
        //       console.log(e, 'e', 'e', isHistory)
        // if (isHistory.current && !isDrag) {
        //   isHistory.current = false
        //   setIsLoading(true)
        //   await getHistoryChartData()
        //   isHistory.current = true
        //   setIsLoading(false)
        // }
        //     }
        //   }
        // },
        yAxis: [
          {
            height: '70%',
            crosshair: { snap: false },
            accessibility: { description: 'price' }
          },
          {
            top: '70%',
            height: '30%',
            accessibility: { description: 'volume' }
          }
        ],
        tooltip: {
          shared: true,
          split: false,
          fixed: true
        },
        series: [
          {
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: ohlc,
            tooltip: {
              valueDecimals: 2,
              pointFormat: `
                <b>O</b> <span style="color: {point.color}">{point.open}</span>
                <b>H</b> <span style="color: {point.color}">{point.high}</span><br/>
                <b>L</b> <span style="color: {point.color}">{point.low}</span>
                <b>C</b> <span style="color: {point.color}">{point.close}</span><br/>
              `
            }
          },
          {
            type: 'column',
            name: 'Volume',
            data: volume,
            id: 'volume',
            yAxis: 1,
            borderRadius: 0,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
              pointFormat: '<b>Volume</b> <span style="color: {point.labelColor}">{point.y}</span><br/>'
            }
          },
          {
            type: 'candlestick',
            id: 'aapls',
            name: 'AAPL Stock Price',
            data: ohlc
            // 你的 tooltip 等其他配置
          },
          // {
          //   type: 'sma',
          //   linkedTo: 'aapl',
          //   params: { period: 3 },
          //   color: '#FFD700',
          //   name: 'MA3'
          // },
          // {
          //   type: 'sma',
          //   linkedTo: 'aapl',
          //   params: { period: 5 },
          //   color: '#00FFFF',
          //   name: 'MA5'
          // },
          // {
          //   type: 'sma',
          //   linkedTo: 'aapl',
          //   params: { period: 10 },
          //   color: '#728efd',
          //   name: 'MA10'
          // }
          ...smaList
        ]
      })
    }
  }, [data, sma])

  useEffect(() => {
    if (token && selectedInterval) {
      getChartData()
    }
  }, [token, selectedInterval, chartRef])

  return (
    <div style={{ paddingTop: '10px', position: 'relative' }}>
      {options && (
        <div
          style={{
            position: 'absolute',
            left: '0',
            right: 0,
            bottom: '12px',
            height: '40px',
            background: '#19191b',
            zIndex: 10
          }}
        ></div>
      )}
      {options && (
        <HighchartsReact
          ref={chartRef}
          updateArgs={[true, true]}
          highcharts={Highcharts}
          constructorType="stockChart"
          options={options}
        />
      )}
    </div>
  )
}

export default HighchartsChart
