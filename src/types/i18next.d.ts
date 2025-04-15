import 'i18next'

declare module 'i18next' {
  export type TFunction = (key: string, options?: any) => string
  interface i18n {
    language: string
  }
}
