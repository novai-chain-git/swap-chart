import React, { useState, useEffect } from 'react'

import style from './chart.module.css'

import SelectType from '../../components/SelectType'
import ChartComponent from '../../components/ChartComponent'
import Table from './Table'
import { getKline, getCategoryList, getKlineHistory } from '../../requests'

const Chart = props => {
  const currDataList = [
    {
      name: 'NOVAI',
      value: 'NOVAI',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/novai.svg',
      imgb: '/images/token/novai.svg'
    },
    {
      name: 'nUSDT',
      value: 'nUSDT',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/nusd.png',
      imgb: '/images/token/nusd.png'
    },
    {
      name: 'WNOVAI',
      value: 'WNOVAI',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/novai.svg',
      imgb: '/images/token/novai.svg'
    },
    {
      name: 'nAI',
      value: 'nAI',
      lineColor: '#006bff',
      areaColor: '#009bff',
      img: '/images/token/nAI.png',
      imgb: '/images/token/nAI.png'
    }
  ]
  // 选择币种
  const [currList, setCurrList] = useState([])
  // 选中的币种
  const [activeCurr, setActiveCurr] = useState(currList[0])

  // 获取币种列表
  const getCategoryListData = async () => {
    const res = await getCategoryList()
    const data = res.data.map(item => {
      const curr = currDataList.find(n => n?.value === item.token)
      return {
        ...item,
        ...curr,
        value: item.token
      }
    })

    setCurrList(data)
  }
  useEffect(() => {
    getCategoryListData()
  }, [])

  useEffect(() => {
    setActiveCurr(currList[0])
  }, [currList])

  return (
    <div className={style.chart}>
      <div className={style.choose}>
        <SelectType list={currList} activeOption={activeCurr} setActiveOption={setActiveCurr} />
      </div>
      <div className={style.chartContent}>
        {/* { activeCurr?.value.toUpperCase() != 'NAI' && } */}
        <ChartComponent {...props} priceDecimals={activeCurr?.priceDecimals} token={activeCurr?.value} />
      </div>
      <Table token={activeCurr?.value} priceDecimals={activeCurr?.priceDecimals} />
    </div>
  )
}

export default Chart
