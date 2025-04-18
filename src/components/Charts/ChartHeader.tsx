import React, { ReactNode, useState, useRef, useEffect, RefObject, ReactElement } from 'react'
import { createChart, IChartApi, ISeriesApi, LineData } from 'lightweight-charts'
import { Box, Text, Flex, Card } from 'rebass/styled-components'
import { PROTOCOL_LEGEND_ELEMENT_ID } from './types'
import styled from 'styled-components'
export enum PriceSource {
  SubgraphV2 = 'SUBGRAPH_V2',
  SubgraphV3 = 'SUBGRAPH_V3',
  SubgraphV4 = 'SUBGRAPH_V4'
}
export enum ExploreTab {
  Tokens = 'tokens',
  Pools = 'pools',
  Transactions = 'transactions'
}

export type ChartHeaderProtocolInfo = { protocol: PriceSource; value?: number }

interface HeaderValueDisplayProps {
  /** The number to be formatted and displayed, or the ReactElement to be displayed */
  value?: number | ReactElement
  /** Used to override default format NumberType (ChartFiatValue) */
  valueFormatterType?: any
}
interface HeaderTimeDisplayProps {
  /**UTCTimestamp*/
  time?: any
  /** Optional string to display when time is undefined */
  timePlaceholder?: string
}
interface ChartHeaderProps extends HeaderValueDisplayProps, HeaderTimeDisplayProps {
  protocolData?:any // ChartHeaderProtocolInfo[]
  additionalFields?: ReactNode
}

// const ProtocolLegendWrapper = styled(Flex, {
//   position: 'absolute',
//   right: 0,
//   py: '$spacing4',
//   px: '$spacing12',
//   gap: '$gap12',
//   pointerEvents: 'none',
//   variants: {
//     hover: {
//       true: {
//         right: 'unset',
//         p: '$spacing8',
//         gap: '$gap6',
//         borderRadius: '$rounded12',
//         border: '1px solid',
//         borderColor: '$surface3',
//         backgroundColor: '$surface2',
//         boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.02), 0px 1px 6px 2px rgba(0, 0, 0, 0.03)',
//         zIndex: '$tooltip'
//       }
//     }
//   }
// })
const ProtocolLegendWrapper = styled(Flex)`
  position: absolute;
  
  padding: 4px 12px;
  gap: 12px;
  border: 1px solid;
  border-radius: 12px;
  border-color: #0d222200;
  background-color: #fff9f90d;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02), 0px 1px 6px 2px rgba(0, 0, 0, 0.03);
  z-index: 1080;
`

// const PROTOCOL_LEGEND_ELEMENT_ID = 'protocolGraphLegend'
function ProtocolLegend({ protocolData }: { protocolData?: ChartHeaderProtocolInfo[] }) {
  // const { formatFiatPrice } = useFormatter()
  // const theme = useTheme()

  return (
    <ProtocolLegendWrapper  id={PROTOCOL_LEGEND_ELEMENT_ID}>asd
      {/* {protocolData
        ?.map(({ value, protocol }) => {
          const display = value ? formatFiatPrice({ price: value, type: NumberType.ChartFiatValue }) : null
          return (
            !!display && (
              <Flex row gap={8} justifyContent="flex-end" key={protocol + '_blip'} width="max-content">
                <Text variant="body4" textAlign="right" color="$neutral2" lineHeight={12}>
                  {getProtocolName(protocol)}
                </Text>

                <Flex
                  borderRadius="$rounded4"
                  width={12}
                  height={12}
                  backgroundColor={getProtocolColor(protocol, theme)}
                />
                <Text variant="body4" textAlign="right" lineHeight={12} {...EllipsisTamaguiStyle}>
                  {display}
                </Text>
              </Flex>
            )
          )
        })
        .reverse()} */}
    </ProtocolLegendWrapper>
  )
}

interface ChartProps {
  data: LineData[]
  width?: number
  height?: number
}

function HeaderValueDisplay({ value }: { value: string }) {
  if (typeof value !== 'number' && typeof value !== 'undefined') {
    return <Text fontSize={32}>{value}</Text>
  }

  return <Text>$25.65亿</Text>
}

function HeaderTimeDisplay({ time, timePlaceholder = '' }: { time: string | undefined; timePlaceholder: string }) {
  // const headerDateFormatter = useHeaderDateFormatter()
  return (
    <Text color="neutral2" fontSize={16}>
      {time ? time : timePlaceholder}
    </Text>
  )
}

// eslint-disable-next-line react/prop-types
export function ChartHeader({ time, protocolData }: ChartHeaderProps) {
  const isHovered = !!time
  const num = '$25.65亿'
  console.log(time,'time')
  return (
    <Flex
      id="chart-header"
      style={{
        top: 0,
        left: 0,
        height: '34px',
        backgroundColor: 'rgba(255, 0.9)',
        padding: '0',
        display: 'flex',
        width: '100%',
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 1000
      }}
    >
      <Box
        style={{
          position: 'absolute',
          paddingBottom: '14px',
          pointerEvents: 'none',
          width: '80%'
        }}
      >
        <HeaderValueDisplay value={num} />
        <Flex>
          {/* {additionalFields} */}
          <HeaderTimeDisplay time={time} timePlaceholder={''} />
        </Flex>
      </Box>
      {isHovered && protocolData && <ProtocolLegend protocolData={protocolData} />}
    </Flex>
  )
}
