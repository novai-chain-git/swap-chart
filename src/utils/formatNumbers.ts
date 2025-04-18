
import React,{ useCallback, useMemo } from 'react'
export enum NumberType {
    // used for token quantities in non-transaction contexts (e.g. portfolio balances)
    TokenNonTx = 'token-non-tx',
  
    // used for token quantity stats where shorthand is okay (e.g. pool stats balances)
    TokenQuantityStats = 'token-quantity-stats',
  
    // used for token quantities in transaction contexts (e.g. swap, send)
    TokenTx = 'token-tx',
  
    // this formatter is used for displaying swap price conversions
    // below the input/output amounts
    SwapPrice = 'swap-price',
  
    // this formatter is only used for displaying the swap trade output amount
    // in the text input boxes. Output amounts on review screen should use the above TokenTx formatter
    SwapTradeAmount = 'swap-trade-amount',
  
    SwapDetailsAmount = 'swap-details-amount',
  
    // fiat values for price, volume, tvl, etc in a chart header or scale
    ChartFiatValue = 'chart-fiat-value',
  
    // fiat values for volume bar chart scales (y axis ticks)
    ChartVolumePriceScale = 'chart-volume-price-scale',
  
    // fiat prices in any component that belongs in the Token Details flow (except for token stats)
    FiatTokenDetails = 'fiat-token-details',
  
    // fiat prices everywhere except Token Details flow
    FiatTokenPrice = 'fiat-token-price',
  
    // fiat values for market cap, TVL, volume in the Token Details screen
    FiatTokenStats = 'fiat-token-stats',
  
    // fiat price of token balances
    FiatTokenQuantity = 'fiat-token-quantity',
  
    // fiat gas prices
    FiatGasPrice = 'fiat-gas-price',
  
    // portfolio balance
    PortfolioBalance = 'portfolio-balance',
  
    // nft floor price denominated in a token (e.g, ETH)
    NFTTokenFloorPrice = 'nft-token-floor-price',
  
    // nft collection stats like number of items, holder, and sales
    NFTCollectionStats = 'nft-collection-stats',
  
    // nft floor price with trailing zeros
    NFTTokenFloorPriceTrailingZeros = 'nft-token-floor-price-trailing-zeros',
  
    // nft token price in currency
    NFTToken = 'nft-token',
  
    // nft token price in local fiat currency
    FiatNFTToken = 'fiat-nft-token',
  
    // whole number formatting
    WholeNumber = 'whole-number',
  }

  // export function useFormatter() {
  //   const activeLocale = useCurrentLocale()
  //   const activeLocalCurrency = useAppFiatCurrency()
  //   const { convertFiatAmount, conversionRate: localCurrencyConversionRate } = useLocalizationContext()
  
  //   const previousSelectedCurrency = usePrevious(activeLocalCurrency)
  //   const previousConversionRate = usePrevious(localCurrencyConversionRate)
  
  //   const shouldFallbackToPrevious = !localCurrencyConversionRate
  //   const shouldFallbackToUSD = !localCurrencyConversionRate
  //   const currencyToFormatWith = handleFallbackCurrency(
  //     activeLocalCurrency,
  //     previousSelectedCurrency,
  //     previousConversionRate,
  //     shouldFallbackToUSD,
  //     shouldFallbackToPrevious,
  //   )
  //   const localCurrencyConversionRateToFormatWith = shouldFallbackToPrevious
  //     ? previousConversionRate
  //     : localCurrencyConversionRate
  
  //   type LocalesType = 'locale' | 'localCurrency' | 'conversionRate'
  //   const formatNumberWithLocales = useCallback(
  //     (options: Omit<FormatNumberOptions, LocalesType>) =>
  //       formatNumber({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //         conversionRate: localCurrencyConversionRateToFormatWith,
  //       }),
  //     [currencyToFormatWith, activeLocale, localCurrencyConversionRateToFormatWith],
  //   )
  
  //   const formatCurrencyAmountWithLocales = useCallback(
  //     (options: Omit<FormatCurrencyAmountOptions, LocalesType>) =>
  //       formatCurrencyAmount({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //         conversionRate: localCurrencyConversionRateToFormatWith,
  //       }),
  //     [currencyToFormatWith, activeLocale, localCurrencyConversionRateToFormatWith],
  //   )
  
  //   const formatPriceWithLocales = useCallback(
  //     (options: Omit<FormatPriceOptions, LocalesType>) =>
  //       formatPrice({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //         conversionRate: localCurrencyConversionRateToFormatWith,
  //       }),
  //     [currencyToFormatWith, activeLocale, localCurrencyConversionRateToFormatWith],
  //   )
  
  //   const formatReviewSwapCurrencyAmountWithLocales = useCallback(
  //     (amount: CurrencyAmount<Currency>) => formatReviewSwapCurrencyAmount(amount, activeLocale),
  //     [activeLocale],
  //   )
  
  //   const formatTickPriceWithLocales = useCallback(
  //     (options: Omit<FormatTickPriceOptions, LocalesType>) =>
  //       formatTickPrice({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //         conversionRate: localCurrencyConversionRateToFormatWith,
  //       }),
  //     [currencyToFormatWith, activeLocale, localCurrencyConversionRateToFormatWith],
  //   )
  
  //   const formatNumberOrStringWithLocales = useCallback(
  //     (options: Omit<FormatNumberOrStringOptions, LocalesType>) =>
  //       formatNumberOrString({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //         conversionRate: localCurrencyConversionRateToFormatWith,
  //       }),
  //     [currencyToFormatWith, activeLocale, localCurrencyConversionRateToFormatWith],
  //   )
  
  //   const formatFiatPriceWithLocales = useCallback(
  //     (options: Omit<FormatFiatPriceOptions, LocalesType>) =>
  //       formatFiatPrice({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //         conversionRate: localCurrencyConversionRateToFormatWith,
  //       }),
  //     [currencyToFormatWith, activeLocale, localCurrencyConversionRateToFormatWith],
  //   )
  
  //   const formatDeltaWithLocales = useCallback(
  //     (percent: Maybe<number>) => formatDelta(percent, activeLocale),
  //     [activeLocale],
  //   )
  
  //   const formatPercentWithLocales = useCallback(
  //     (percent: Percent | undefined, maxDecimals?: number) => formatPercent(percent, maxDecimals, activeLocale),
  //     [activeLocale],
  //   )
  
  //   const formatEtherwithLocales = useCallback(
  //     (options: Omit<FormatEtherOptions, LocalesType>) =>
  //       formatEther({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //       }),
  //     [currencyToFormatWith, activeLocale],
  //   )
  
  //   const formatConvertedFiatNumberOrString = useCallback(
  //     (options: Omit<FormatNumberOrStringOptions, LocalesType>) =>
  //       formatNumberOrString({
  //         ...options,
  //         locale: activeLocale,
  //         localCurrency: currencyToFormatWith,
  //         conversionRate: undefined,
  //       }),
  //     [currencyToFormatWith, activeLocale],
  //   )
  
  //   return useMemo(
  //     () => ({
  //       convertToFiatAmount: convertFiatAmount,
  //       formatConvertedFiatNumberOrString,
  //       formatCurrencyAmount: formatCurrencyAmountWithLocales,
  //       formatEther: formatEtherwithLocales,
  //       formatFiatPrice: formatFiatPriceWithLocales,
  //       formatNumber: formatNumberWithLocales,
  //       formatNumberOrString: formatNumberOrStringWithLocales,
  //       formatDelta: formatDeltaWithLocales,
  //       formatPercent: formatPercentWithLocales,
  //       formatPrice: formatPriceWithLocales,
  //       formatReviewSwapCurrencyAmount: formatReviewSwapCurrencyAmountWithLocales,
  //       formatTickPrice: formatTickPriceWithLocales,
  //     }),
  //     [
  //       convertFiatAmount,
  //       formatConvertedFiatNumberOrString,
  //       formatCurrencyAmountWithLocales,
  //       formatDeltaWithLocales,
  //       formatEtherwithLocales,
  //       formatFiatPriceWithLocales,
  //       formatNumberOrStringWithLocales,
  //       formatNumberWithLocales,
  //       formatPercentWithLocales,
  //       formatPriceWithLocales,
  //       formatReviewSwapCurrencyAmountWithLocales,
  //       formatTickPriceWithLocales,
  //     ],
  //   )
  // }
  