// import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from '@uniswap/sdk'
import { useMemo } from 'react'
import { BIPS_BASE, DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../constants'
import { getTradeVersion, useV1TradeExchangeAddress } from '../data/V1'
import { useTransactionAdder } from '../state/transactions/hooks'
// import { calculateGasMargin, getRouterContract, isAddress, shortenAddress } from '../utils'
import { getRouterContract, getNaiRouterContract, calculateGasMargin, isAddress, shortenAddress } from '../utils'
import isZero from '../utils/isZero'
import v1SwapArguments from '../utils/v1SwapArguments'
import { useActiveWeb3React } from './index'
import { useV1ExchangeContract } from './useContract'
import useENS from './useENS'
import { Version } from './useToggledVersion'
import { parseUnits, formatUnits } from '@ethersproject/units'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

/* interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall */

function calculateSlippagePercent(trade: Trade | undefined,
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW,
):Percent {
  if (!trade || !trade.outputAmount || !trade.inputAmount) {
    return new Percent(JSBI.BigInt(allowedSlippage), JSBI.BigInt(deadline))
  }
  const expectedOutput = parseFloat(trade.executionPrice.invert().toSignificant(6)) // 比例，比如 178
  const actualOutput = parseFloat(trade.outputAmount.toExact()) / parseFloat(trade.inputAmount.toExact())

  const slippageRatio = Math.abs((expectedOutput - actualOutput) / expectedOutput)

  // 限制在合理范围内，避免过大滑点
  const safeSlippage = Math.min(slippageRatio, 0.07) // 最大允许 50%
  const bps = Math.ceil(safeSlippage * 10_000)

  return new Percent(JSBI.BigInt(bps), JSBI.BigInt(10_000))
 // return ''
}
/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const v1Exchange = useV1ExchangeContract(useV1TradeExchangeAddress(trade), true)

  return useMemo(() => {
    const tradeVersion = getTradeVersion(trade)
    if (!trade || !recipient || !library || !account || !tradeVersion || !chainId) return []

    // const contract: Contract | null =
    //   tradeVersion === Version.v2 ? getRouterContract(chainId, library, account) : v1Exchange
    // if (!contract) {
    //   return []
    // }
    const nai = '0x53788c75206c3BD55b2304d627C1fF89dc58b02C'
    const naiType =
      (trade.inputAmount.currency as any).address === nai || (trade.outputAmount.currency as any).address == nai
  
    const contract: Contract | null = naiType
      ? getNaiRouterContract(chainId, library, account)
      : tradeVersion === Version.v2
      ? getRouterContract(chainId, library, account)
      : v1Exchange
      
    
    if (!contract) {
      return []
    }
    const slippage = calculateSlippagePercent(trade,allowedSlippage, deadline)

    const swapMethods = []

    switch (tradeVersion) {
      case Version.v2:
        swapMethods.push(
          Router.swapCallParameters(trade, {
            feeOnTransfer: false,
            allowedSlippage: slippage,
            recipient,
            ttl: deadline
          })
        )

        if (trade.tradeType === TradeType.EXACT_INPUT) {
          swapMethods.push(
            Router.swapCallParameters(trade, {
              feeOnTransfer: true,
              allowedSlippage: slippage,
              recipient,
              ttl: deadline
            })
          )
        }
        break
      case Version.v1:
        swapMethods.push(
          v1SwapArguments(trade, {
            allowedSlippage: slippage,
            recipient,
            ttl: deadline
          })
        )
        break
    }
    return swapMethods.map(parameters => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade, v1Exchange])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()


  const swapCalls = useSwapCallArguments(trade, allowedSlippage, deadline, recipientAddressOrName)
  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }

    const tradeVersion = getTradeVersion(trade)

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        /* const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map(call => {
            console.log('call：', call)
            const {
              parameters: { methodName, args, value },
              contract
            } = call
            const options = !value || isZero(value) ? {} : { value }
            console.log('methodName：', methodName)
            return (
              contract['swapExactTokensForTokens'](...args, {
                ...(value && !isZero(value) ? { value, from: account } : { from: account })
              })
                // return contract.estimateGas[methodName](...args, options)
                .then((gasEstimate: any) => {
                  console.log('gasEstimate：', gasEstimate)
                  return {
                    call,
                    gasEstimate
                  }
                })
                .catch((gasError: any) => {
                  console.debug('Gas estimate failed, trying eth_call to extract error', call)
                  console.log('methodName：', methodName)
                  return contract.callStatic[methodName](...args, options)
                    .then(result => {
                      console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                      return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                    })
                    .catch(callError => {
                      console.debug('Call threw error', call, callError)
                      let errorMessage: string
                      switch (callError.reason) {
                        case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                        case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                          errorMessage =
                            'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                          break
                        default:
                          errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`
                      }
                      return { call, error: new Error(errorMessage) }
                    })
                })
            )
          })
        ) */

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        /* const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        ) */

        /* if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        } */

        /* const {
          call: {
            contract,
            parameters: { methodName, args, value }
          },
          gasEstimate
        } = successfulEstimation */
        const nai = '0x53788c75206c3BD55b2304d627C1fF89dc58b02C'

        const nUSDT: string = '0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37'
        let outAddress = (trade.outputAmount.currency as any).address

        let inAddress = (trade.inputAmount.currency as any).address
        const naiType = (outAddress === nai || inAddress == nai) && (outAddress === nUSDT || inAddress == nUSDT)
        const decimals = (trade.inputAmount.currency as any).decimals
        const {
          contract,
          parameters: { methodName, args, value }
        } = swapCalls[naiType ? 1 : 0]
 
        let argss = [...args]
        argss[1] = parseUnits('0', decimals).toString()
        
        
        // const finalArgs = (naiType) ? argss : args;
        const finalArgs = args;
        return contract[methodName](...finalArgs, {
          ...(naiType
            ? {
                gasLimit: 500000
              }
            : {}),
          ...(value && !isZero(value) ? { value, from: account } : { from: account })
        })
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const inputAmount = trade.inputAmount.toSignificant(3)
            const outputAmount = trade.outputAmount.toSignificant(3)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            const withVersion =
              tradeVersion === Version.v2 ? withRecipient : `${withRecipient} on ${(tradeVersion as any).toUpperCase()}`

            addTransaction(response, {
              summary: withVersion
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
      error: null
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction])
}
