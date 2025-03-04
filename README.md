### Uniswap Interface v2 前端界面配置说明

#### 修改配置参数
- 开发修改 .env 文件中的配置
- 生产修改 .env.production 文件中的配置
- 修改项目根目录 `ResetUniSwapSdkCode.js` 里的变量值为你的配置
  - `CHAIN_ID`
  - `FACTORY_ADDRESS`
  - `INIT_CODE_HASH`
- 修改 logo
  - 在 src/assets/svg 目录下
  - 将 `logo.svg` 和 `logo_white.svg` 替换成自己的图标
  - 将 `wordmark.svg` 和 `wordmark_white.svg` 替换成自己的图标
- 添加默认代币列表
  - 修改 `src/constants/lists.ts` 里的 `DEFAULT_TOKEN_LIST_URL` 变量的值为一个 `json` 文件的链接，`json` 文件的内容参考项目根目录public下的 `tokens-list.json` 文件
  - 每次修改了代币文件 `tokens-list.json` 以后，都要修改其 `version` 字段，只能往大改，建议修改 `version.patch + 1`
- 修改基础路由的代币
  - 修改 `src/constants/index.ts` 文件里的 `CUSTOM_TOKENS` 变量
#### 启动项目
前端环境推荐: `node v14.21.3` `yarn v1.22.19`
- 建议使用 volta 来管理 `node` 和 yarn 版本：[volta](https://volta.sh/)
- `yarn install` 安装依赖
- 安装好依赖以后必须运行 `yarn reset` 来修改npm包 `@uniswap/sdk` 里的一些代码
- 然后就可以启动项目了 `yarn start`
