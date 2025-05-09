import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

export const gapValues = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '24px',
  xl: '32px'
}
export type Gap = keyof typeof gapValues

const MEDIA_WIDTHS = {
  upToExtraMINI: 300,
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',
    text6: darkMode ? 'rgba(255,255,255,0.54)' : '#888D9B',
    text7: darkMode ? '#131315' : '#F8F8F8',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#131315' : '#F8F8F8',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bgAccount: darkMode ? '#131315' : '#F8F8F8',
    bgAddress: darkMode ? '#121214' : '#ffffff',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bg6: darkMode ? '#959698' : '#959698',
    bg7: darkMode ? '#121d16' : '#F8F8F8',
    bg8: darkMode ? '#181A20' : '#181A20',
    bg9: darkMode ? 'rgba(12, 14, 16, 0.8)' : 'rgba(12, 14, 16, 0.8)',
    bg10: darkMode ? 'transparent' : '#131315',
    bg11: darkMode ? '#28332E' : '#EDEEF2',
    bg12: darkMode ? '#0E1111' : '#F8F8F8',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    primary1: darkMode ? '#2172E5' : '#4352D4',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#4352d41a',
    primary5: darkMode ? '#153d6f70' : '#4352d41a',
    primary6: darkMode ? 'rgba(164, 221, 64,0.12)' : '#4352d41a',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#4352D4',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#4352D4',
    secondary2: darkMode ? '#17000b26' : '#4352d41a',
    secondary3: darkMode ? '#17000b26' : '#4352d41a',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    green2: '#5AC27C',
    yellow1: '#FFE270',
    yellow2: '#F3841E',

    // gradients
    bgto1: 'linear-gradient( 180deg, #5AC27C 0%, #B2E235 100%)',
    bgto2: 'radial-gradient(50% 50% at 50% 50%, #076a12 0%, #131315 100%)',
    bgto3: 'linear-gradient( 180deg, rgba(90, 194, 124,0.3) 0%, rgba(178, 226, 53,0.3)  100%)',

    // border colors
    border1: darkMode ? ' rgba(255,255,255,0.16)' : '#131315',
    border2: '#A4DD40'

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`


html, input, textarea, button {
  font-family: 'Poppins', Pingfang, Arial, Helvetica, sans-serif;
}
/* @supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: Pingfang, Arial, Helvetica, sans-serif;
  }
} */

html,
body {
  margin: 0;
  padding: 0;
}
::-webkit-scrollbar {
  display: none;
}
* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}


`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  // background-color: ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  /* background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
      1,
      theme.bg1
    )} 100%)`}; */
}
`
