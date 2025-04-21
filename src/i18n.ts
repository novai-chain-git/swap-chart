/* eslint-disable */
// @ts-nocheck
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'


i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `./localesi18n/{{lng}}.json`
    },
    react: {
      useSuspense: true
    },
    fallbackLng: 'en',
    preload: ['en', 'zh'],
    keySeparator: false,
    interpolation: { escapeValue: false }
  })

export const langList = [
  {
    name: 'English',
    alias: 'EN',
    value: 'en'
    // logo: enLogo
  },
  {
    name: '简体中文',
    alias: 'CN',
    value: 'zh'
    // logo: zhLogo
  }
]

export const switchPageTitleAndDesc = acLang => {
  switch (acLang) {
    case 'zh':
      document.querySelector('#swap-page-title').innerText = 'Novai Swap：无缝资产交易的去中心化交易平台'
      document.querySelector('#swap-desc-meta').content =
        'Novai Swap 提供一个安全、高效的去中心化交易平台，以低费用和高流动性交易各种数字资产。'
      break
    default:
      document.querySelector('#swap-page-title').innerText =
        'Novai Swap: Decentralized Exchange for Seamless Asset Trading'
      document.querySelector('#swap-desc-meta').content =
        'Novai Swap offers a secure, efficient decentralized exchange platform for trading a wide range of digital assets with low fees and high liquidity.'
      break
  }
}

export default i18next
