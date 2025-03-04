const fs = require('fs')
const path = require('path')

// ###################### 下面3个变量需要自己修改，替换成自己的 ####################
// 主币名称
const CurrencySymbolName = 'NOVAI'
// 网络ID
const CHAIN_ID = 7256
// UniswapV2Factory 地址
const FACTORY_ADDRESS = '0x5a751cA9077790a92E5175C47964eDe86C460838'
// initCode
const INIT_CODE_HASH = '0x78aaf8d2718e799fab9cfde40ff04b055e55f580ab143e7d73f78ccd54222228'

// ###################### 下面的代码不要修改 ####################
function setSdkEsm(path) {
  // 读取文件内容
  const fileContent = fs.readFileSync(path, 'utf8')
  // 修改文件内容
  let newFileContent = fileContent.replace(
    /ChainId\[ChainId\["KOVAN"\] = 42\][\n\s\S]*?\{\}\)\);/,
    `ChainId[ChainId["KOVAN"] = 42] = "KOVAN";
  ChainId[ChainId["ZXY"] = Number(process.env.REACT_APP_CHAIN_ID)] = "ZXY";
})(ChainId || (ChainId = {}));`
  )
  // 替换成主币的名称
  newFileContent = newFileContent.replace(
    /new Currency\(18,.*;?/,
    `new Currency(18, process.env.REACT_APP_CHAIN_SYMBOL, process.env.REACT_APP_CHAIN_SYMBOL);`
  )
  newFileContent = newFileContent.replace(
    /var FACTORY_ADDRESS =.*;/,
    `var FACTORY_ADDRESS = process.env.REACT_APP_FACTORY_ADDRESS;`
  )
  newFileContent = newFileContent.replace(
    /var INIT_CODE_HASH =.*;/,
    `var INIT_CODE_HASH = process.env.REACT_APP_INIT_CODE_HASH;`
  )
  newFileContent = newFileContent.replace(
    /var _toSignificantRoundin.*_toFixedRounding;/,
    // `var WETH = (_WETH = {}, _WETH[ChainId.MAINNET]`,
    // 设置 _WETH[ChainId.ZXY] 的值，然后返回 _WETH，赋值给 WETH
    `var _toSignificantRoundin, WETH = (_WETH[ChainId.ZXY] = /*#__PURE__*/new Token(ChainId.ZXY, process.env.REACT_APP_ZXY_WETH_ADDRESS, 18, 'WNOVAI', 'Wrapped NOVAI'), _WETH), _toFixedRounding;`
  )
  // 写入文件内容
  fs.writeFileSync(path, newFileContent, 'utf8')
}
function setCconstants(path) {
  const fileContent = fs.readFileSync(path, 'utf8')
  let newFileContent = fileContent.replace(
    /(KOVAN = 42)[\s\S]*?\}/,
    `$1,
    ZXY = ${CHAIN_ID}
}`
  )
  newFileContent = newFileContent.replace(
    /export declare const FACTORY_ADDRESS = ".*";/,
    `export declare const FACTORY_ADDRESS = "${FACTORY_ADDRESS}";`
  )
  newFileContent = newFileContent.replace(
    /export declare const INIT_CODE_HASH = ".*";/,
    `export declare const INIT_CODE_HASH = "${INIT_CODE_HASH}";`
  )
  fs.writeFileSync(path, newFileContent, 'utf8')
}
function setTokenSchema(path) {
  const fileContent = fs.readFileSync(path, 'utf8')
  const newFiledata = JSON.parse(fileContent)
  // logoURI 不用按照url规则校验，因为有自己定义的url规则 localhost
  delete newFiledata.definitions.TokenInfo.properties.logoURI.format
  newFiledata.definitions.TokenInfo.properties.disable = {
    type: 'boolean',
    description: 'The disable of the token',
    examples: [true]
  }
  fs.writeFileSync(path, JSON.stringify(newFiledata, null, 2), 'utf8')
}
function setToken(path) {
  const fileContent = fs.readFileSync(path, 'utf8')
  const newFileContent = fileContent.replace(
    /(42: Token;)[\s\S]*\}/,
    `$1
    ${CHAIN_ID}: Token;
}`
  )
  fs.writeFileSync(path, newFileContent, 'utf8')
}
setSdkEsm(path.resolve(__dirname, './node_modules/@uniswap/sdk/dist/sdk.esm.js'))
setCconstants(path.resolve(__dirname, './node_modules/@uniswap/sdk/dist/constants.d.ts'))
setToken(path.resolve(__dirname, './node_modules/@uniswap/sdk/dist/entities/token.d.ts'))
setTokenSchema(path.resolve(__dirname, './node_modules/@uniswap/token-lists/src/tokenlist.schema.json'))
