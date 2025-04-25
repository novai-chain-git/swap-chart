import swapNaiAbi from '../../../constants/abis/swapNai.json'
import factoryAbi from '../../../constants/abis/factory.json'
import pairAbi from '../../../constants/abis/Pair.json'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { parseUnits, formatUnits } from '@ethersproject/units'
import {  NAI_ADDRESS,NAI_HEYUE_ADDRESS } from '../../../constants'

export const coinList = [
    {
          lable: 'NOVAI',
          title: 'NOVAI/nUSDT',
          address: '0x4aC2abdDF928C3D01a208e880E101a1423dB6C73',
          coin: 'USDT',
          protocol: 'v2',
          fees: '0.05%',
          trading24H: '',
          trading30D: '',
          day: 'NOVAI',
          thirty: 'NOVAI',
          dayTvl: 'NOVAI'
        },
        {
          lable: 'nAI',
          title: 'nAI/nUSDT',
          address: NAI_ADDRESS,
          coin: 'WNOVAI',
          protocol: 'v2',
          fees: '0.05%',
          trading24H: '',
          trading30D: '',
          day: '',
          thirty: '',
          dayTvl: ''
        }
]

 //获取合约factory
export const getContractFactory = async (address: string): Promise<any> => {
  const nusdt = '0xE623AED6b4dAf04553B8fEe8daECCF1cfaAece37'
  const provider = new JsonRpcProvider('https://rpc.novaichain.com')
  const router = new Contract(NAI_HEYUE_ADDRESS, swapNaiAbi, provider)
  //  console.log('Uniswap V2 Factory 地址:', provider,NAI_HEYUE_ADDRESS,router)
  try {
    const factoryAddress = await router.factory()
    console.log('factoryAddress', factoryAddress)

    const pairContract = new Contract(factoryAddress, factoryAbi, provider)
    const pairAddress = await pairContract.getPair(address, nusdt)
    console.log('pairAddress', pairAddress)

    const reservesContract = new Contract(pairAddress, pairAbi, provider)
    //获取合约地址
    const token0 = await reservesContract.token0()
    const token1 = await reservesContract.token1()
    const [reserve0, reserve1] = await reservesContract.getReserves()
    console.log(reserve0, 'reserve0', formatUnits(reserve0, 18), 'reserve1', reserve1, formatUnits(reserve1, 6))
    console.log(token0, token1, 'token0')
    let num = 0
    if (token0 === address) {
      num = parseFloat(formatUnits(reserve1, 6))
    } else {
      num = parseFloat(formatUnits(reserve0, 6))
    }
    console.log(num, 'num')
    return num
  } catch (e) {
    console.log(e, 'Uniswap V2 Factory 地址:')
  }
}
