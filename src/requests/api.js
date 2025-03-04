import { Auth } from './auth'
// import { BASE_URL } from "./url";
// console.log("BASE_URL", BASE_URL);
const isDev = process.env.NODE_ENV === 'development'

const BASE_URL = process.env.REACT_APP_BASE_URL

// 对象转键值对

const queryString = params =>
  '?' +
  Object.keys(params)
    .map(i => `${i}=${encodeURIComponent(params[i])}`)
    .join('&')

// 需要加token的路径
const includeUrlList = []
// 排除user下不需要加token的路径
const excludeUrlList = []

const bodyMethod = ['POST', 'PUT', 'PATCH']

const request = async (partiaUrl, query, body, method = 'GET', type = 'application/json') => {
  const needBody = bodyMethod.includes(method)

  // 请求前拦截器
  const needAuth =
    includeUrlList.some(item => partiaUrl.startsWith(item)) && !excludeUrlList.some(item => partiaUrl.startsWith(item))

  const pormise = (
    await fetch(BASE_URL + partiaUrl + (query ? queryString(query) : ''), {
      headers: {
        ...(needAuth ? { token: Auth.token ? Auth.token : '' } : {}),
        ...(needBody && type !== null ? { 'Content-Type': type } : {})
      },
      method,
      ...(needBody ? { body: type === 'application/json' ? JSON.stringify(body) : body } : {})
    })
  ).json()

  // 响应后拦截器
  const { code } = await pormise

  return pormise
}

export class API {
  static get(partiaUrl, query) {
    return request(partiaUrl, query)
  }

  static delete(partiaUrl, query) {
    return request(partiaUrl, query, undefined, 'DELETE')
  }

  static post(partiaUrl, body, query) {
    return request(partiaUrl, query, body, 'POST')
  }

  static postFile(partiaUrl, formDataBody, query) {
    return request(partiaUrl, query, formDataBody, 'POST', null)
  }
}
