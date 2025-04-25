// HighchartsChart.jsx
import React, { useEffect, useRef, useState } from 'react'
import Highcharts from 'highcharts/highstock'
import StockTools from 'highcharts/modules/stock-tools';
import HighchartsReact from 'highcharts-react-official'
import IndicatorsCore from 'highcharts/indicators/indicators-all'
import IndicatorsIkh from 'highcharts/indicators/ichimoku-kinko-hyo'

import FullScreen from 'highcharts/modules/full-screen';
import AnnotationsAdvanced from 'highcharts/modules/annotations-advanced';
import PriceIndicator from 'highcharts/modules/price-indicator';
import HeikinAshi from 'highcharts/modules/heikinashi';
import { getKlineHistory, getKline } from '../../../requests'
import { Context } from '../../../pages/App.tsx'

StockTools(Highcharts);
  FullScreen(Highcharts);
  AnnotationsAdvanced(Highcharts);
  PriceIndicator(Highcharts);
  HeikinAshi(Highcharts);

// IndicatorsCore(Highcharts)
IndicatorsIkh(Highcharts)
const HighchartsChart = ({
  token,

  selectedInterval = { name: '1H', value: 60 }
}) => {
  const [options, setOptions] = useState(null)

  //const [isHistory, setIsHistory] = useState(true)
  const isHistory = useRef(true)
  // 图表数据
  const [data, setData] = useState([])
  // const intervalsData = [
  //   { name: '1H', value: 60 },
  //   { name: '1D', value: 1440 },
  //   { name: '1W', value: -7 },
  //   { name: '1M', value: -30 },
  //   { name: '1Y', value: -365 }
  // ]
  // // 选中的时间间隔
  // const [selectedInterval, setSelectedInterval] = useState(intervalsData[1])
  const [isDrag, setIsDrag] = useState(false)
  const { isLodaing, setIsLoading } = React.useContext(Context)
  const getChartData = async () => {
    const res = await getKline({ token: token, type: selectedInterval.value, rows: 200 })
    if (res.data) {
      // const arr = res.data.map(item => {
      //   return {
      //     ...item,
      //     value: item.close
      //   }
      // })
      // console.log(arr,'res.data')
      setData(res.data)
    }
  }
  //  const type = true
  // 获取历史图表数据
  const getHistoryChartData = async () => {
    try {
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
    } catch (e) {
    } finally {
    }
  }
  useEffect(() => {
    // console.log(console.log(data,'data'))

    // return
    if (data.length > 0) {
      // const response = await fetch(
      //   'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
      // );
      // const data = await response.json();

      const ohlc = []
      const volume = []
      let previousCandleClose = 0
      //       data.forEach(item => {
      //   console.log(item,'item')
      // })
      data.forEach(item => {
        ohlc.push([
          item.time, // time
          item.open, // open
          item.high, // high
          item.low, // low
          item.close // close
        ])
        volume.push({
          x: item.time,
          y: item.amount,
          color: item.close > previousCandleClose ? '#466742' : '#a23f43',
          labelColor: item.close > previousCandleClose ? '#51a958' : '#ea3d3d'
        })
        previousCandleClose = item.close
      })
      // for (let i = 0; i < data.length; i++) {
      //   ohlc.push([
      //     data[i][0], // time
      //     data[i][1], // open
      //     data[i][2], // high
      //     data[i][3], // low
      //     data[i][4]  // close
      //   ]);
      //   volume.push({
      //     x: data[i][0],
      //     y: data[i][5],
      //     color: data[i][4] > previousCandleClose ? '#466742' : '#a23f43',
      //     labelColor: data[i][4] > previousCandleClose ? '#51a958' : '#ea3d3d'
      //   });
      //   previousCandleClose = data[i][4];
      // }

      Highcharts.setOptions({
        chart: {
          backgroundColor: '#0a0a0a'
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
        },
        
        // exporting: {
        //   verticalAlign: 'bottom'
        //   // enabled: true,
        //   // buttons: {
        //   //   contextButton: {
        //   //     theme: { fill: '#121211' },
        //   //     menuItems:[]
        //   //   }
        //   // }
        // }
      })

      setOptions({
        rangeSelector: { enabled:false, inputEnabled: true,selected:1 },
        navigator: { enabled: true, outlineWidth: 0 },

        responsive: {
          rules: [{
              condition: {
                  maxWidth: 800
              },
              chartOptions: {
                  rangeSelector: {
                      inputEnabled: false
                  }
              }
          }]
      },
        scrollbar: {
          enabled: false // 禁用滚动条
        },
        chart: {
            panning: true, // 启用拖动
            panKey: 'shift' // 按住shift键拖动
        },
        title: { text: token },
        plotOptions: {
          series: {
            marker: {
              enabled: false,
              states: { hover: { enabled: false } }
            }
          },
          candlestick: {
            color: '#ea3d3d',
            upColor: '#51a958',
            upLineColor: '#51a958',
            lineColor: '#ea3d3d',
            pointWidth: 7
          }
        },
        xAxis: {
          gridLineWidth: 1,
          crosshair: { snap: false },
          events: {
            setExtremes: async function(e) {
              console.log(e,'e')
              // 如果拖到接近左边缘，则加载更多历史数据
              if (!e.min || !e.max) return
              // 检查是否接近左边缘（例如前5%的区域）
              const range = e.max - e.min
              const threshold = e.min - range * 0.05
              console.log(e, 'e', 'e', isHistory)
              if (isHistory.current && !isDrag) {
                isHistory.current = false
                setIsLoading(true)
                await getHistoryChartData()
                isHistory.current = true
                setIsLoading(false)
              }
            }
          }
        },
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
            yAxis: 1,
            borderRadius: 0,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
              pointFormat: '<b>Volume</b> <span style="color: {point.labelColor}">{point.y}</span><br/>'
            }
          },
          {
            type: 'ikh',
            linkedTo: 'aapl',
            tooltip: {
              pointFormat: `
                <br/>
                <span style="color: #666;">IKH</span><br/>
                tenkan sen: <span style="color:{series.options.tenkanLine.styles.lineColor}">{point.tenkanSen:.3f}</span><br/>
                kijun sen: <span style="color:{series.options.kijunLine.styles.lineColor}">{point.kijunSen:.3f}</span><br/>
                chikou span: <span style="color:{series.options.chikouLine.styles.lineColor}">{point.chikouSpan:.3f}</span><br/>
                senkou span A: <span style="color:{series.options.senkouSpanA.styles.lineColor}">{point.senkouSpanA:.3f}</span><br/>
                senkou span B: <span style="color:{series.options.senkouSpanB.styles.lineColor}">{point.senkouSpanB:.3f}</span><br/>
              `
            },
            tenkanLine: { styles: { lineColor: '#12dbd1' } },
            kijunLine: { styles: { lineColor: '#de70fa' } },
            chikouLine: { styles: { lineColor: '#728efd' } },
            senkouSpanA: { styles: { lineColor: '#2ad156' } },
            senkouSpanB: { styles: { lineColor: '#fca18d' } },
            senkouSpan: {
              color: 'rgba(255, 255, 255, 0.3)',
              negativeColor: 'rgba(237, 88, 71, 0.2)'
            }
          }
        ]
      })
    }
  }, [data])

  useEffect(() => {
    if (token && selectedInterval) {
      getChartData()
    }
  }, [token, selectedInterval])

  return (
    
    <div style={{ paddingTop: '10px' }}>
      {options && <HighchartsReact highcharts={Highcharts} constructorType="stockChart" options={options} />}
    </div>
  )
}

export default HighchartsChart
