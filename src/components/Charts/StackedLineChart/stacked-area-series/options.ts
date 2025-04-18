// import { CustomSeriesOptions, customSeriesDefaultOptions, Logical } from 'lightweight-charts'

// export interface StackedAreaColor {
//   line: string
//   area: string
// }

// export interface StackedAreaSeriesOptions extends CustomSeriesOptions {
//   //colors: readonly StackedAreaColor[]
//   colors: readonly string[]
//   lineWidth: number
//   gradients?: { start: string; end: string }[]
//   hoveredLogicalIndex?: Logical
// }

// export const defaultOptions: StackedAreaSeriesOptions = {
//   ...customSeriesDefaultOptions,
//   colors: ['#4C82FB', '#FC72FF', '#A457FF'], //'#4C82FB', '#FC72FF', '#A457FF'
//   // colors: [
//   //   { line: '#4C82FB', area: 'rgba(76, 130, 251, 0.2)' },
//   //   { line: '#FC72FF', area: 'rgba(252, 114, 255, 0.2)' },
//   //   { line: '#A457FF', area: 'rgba(242, 143, 44, 0.2)' },
//   //   { line: 'rgb(164, 89, 209)', area: 'rgba(164, 89, 209, 0.2)' },
//   //   { line: 'rgb(27, 156, 133)', area: 'rgba(27, 156, 133, 0.2)' }
//   // ],
//   gradients: undefined,
//   lineWidth: 2
// } as const
/**
 * Copied and modified from: https://github.com/tradingview/lightweight-charts/blob/f13a3c1f3fefcace9d4da5b97c1638009298b3c8/plugin-examples/src/plugins/stacked-area-series
 * Modifications are called out with comments.
 */

import { customSeriesDefaultOptions, CustomSeriesOptions, Logical } from 'lightweight-charts'

export interface StackedAreaSeriesOptions extends CustomSeriesOptions {
  colors: readonly string[]
  lineWidth: number
  gradients?: { start: string; end: string }[]
  // Modification: tracks the hovered data point, used for rendering crosshair
  hoveredLogicalIndex?: Logical
}

export const defaultOptions: StackedAreaSeriesOptions = {
  ...customSeriesDefaultOptions,
  colors: ['#4C82FB', '#FC72FF', '#A457FF'],
  gradients: undefined,
  lineWidth: 2
} as const
