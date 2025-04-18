import { API } from './api'
export const getVol = async token => {
  return await API.get(`api/token/vol/${token}`)
}
export const getStat = async token => {
  return await API.get(`api/token/stat/${token}`)
}
export const getTransactions = async query => {
  return await API.get(`api/token/transactions`, query)
}

// 获取k线数据
export const getKline = async query => {
  return await API.get('api/token/klines', query)
}

// 获取类别列表
export const getCategoryList = async query => {
  return await API.get('api/token/list', query)
}

// 获取k线历史数据
export const getKlineHistory = async query => {
  return await API.get('api/token/klineHistory', query)
}
