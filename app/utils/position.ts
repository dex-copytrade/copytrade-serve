import {
  getAllMarkets,
  GroupConfig,
  MangoClient,
  getMultipleAccounts,
  PerpMarketLayout,
  PerpMarket,
  MangoAccount,
  MangoGroup,
  PerpMarketConfig,
  ZERO_BN,
  // nativeI80F48ToUi,
} from '@blockworks-foundation/mango-client';
import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';

interface FetchMangoData {
  client?: MangoClient;
  groupConfig: GroupConfig;
  connection: Connection;
}

export const programId = new PublicKey(
  'mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68'
);

export function zipDict<K extends string | number | symbol, V>(
  keys: K[],
  values: V[]
) {
  const result: Partial<Record<K, V>> = {};
  keys.forEach((key, index) => {
    result[key] = values[index];
  });
  return result;
}

export async function fetchMangoData({
  groupConfig,
  connection,
}: FetchMangoData) {
  const allMarketConfigs = getAllMarkets(groupConfig);
  const allMarketPks = allMarketConfigs.map((m) => m.publicKey);

  const allMarketAccountInfos = await getMultipleAccounts(
    connection,
    allMarketPks
  );

  const allMarketAccounts = allMarketConfigs.map((config, i) => {
    if (config.kind === 'spot') {
      const decoded = Market.getLayout(programId).decode(
        allMarketAccountInfos[i].accountInfo.data
      );
      return new Market(
        decoded,
        config.baseDecimals,
        config.quoteDecimals,
        undefined,
        groupConfig.serumProgramId
      );
    }
    if (config.kind === 'perp') {
      const decoded = PerpMarketLayout.decode(
        allMarketAccountInfos[i].accountInfo.data
      );
      return new PerpMarket(
        config.publicKey,
        config.baseDecimals,
        config.quoteDecimals,
        decoded
      );
    }
  });

  const allMarkets = zipDict(
    allMarketPks.map((pk) => pk.toBase58()),
    allMarketAccounts
  );

  return allMarkets;
}

export const collectPerpPosition = (
  mangoAccount: MangoAccount,
  mangoGroup: MangoGroup,
  mangoCache: any, // MangoCache,
  marketConfig: PerpMarketConfig,
  perpMarket: PerpMarket,
  tradeHistory: any
): any | undefined => {
  if (
    !mangoAccount ||
    !mangoGroup ||
    !mangoCache ||
    !perpMarket ||
    !tradeHistory
  ) {
    return;
  }

  // const perpMarketInfo = mangoGroup.perpMarkets[marketConfig.marketIndex];
  const perpAccount = mangoAccount.perpAccounts[marketConfig.marketIndex];

  let avgEntryPrice = 0,
    breakEvenPrice = 0;
  const perpTradeHistory = tradeHistory.filter(
    (t) => t.marketName === marketConfig.name
  );
  try {
    avgEntryPrice = perpAccount
      .getAverageOpenPrice(mangoAccount, perpMarket, perpTradeHistory)
      .toNumber();
  } catch (e) {
    console.error(marketConfig.name, e);
  }

  try {
    breakEvenPrice = perpAccount
      .getBreakEvenPrice(mangoAccount, perpMarket, perpTradeHistory)
      .toNumber();
  } catch (e) {
    console.error(marketConfig.name, e);
  }

  const basePosition = perpMarket?.baseLotsToNumber(perpAccount.basePosition);
  // const indexPrice = mangoGroup
  //   .getPrice(marketConfig.marketIndex, mangoCache)
  //   .toNumber();
  // const notionalSize = Math.abs(basePosition * indexPrice);
  // const unrealizedPnl = basePosition * (indexPrice - breakEvenPrice);
  // const unsettledPnl = +nativeI80F48ToUi(
  //   perpAccount.getPnl(
  //     perpMarketInfo,
  //     mangoCache.perpMarketCache[marketConfig.marketIndex],
  //     mangoCache.priceCache[marketConfig.marketIndex].price
  //   ),
  //   marketConfig.quoteDecimals
  // ).toNumber();

  return {
    // perpMarketInfo,
    // perpMarket,
    // marketConfig,
    // perpAccount,
    base: marketConfig.baseSymbol,
    side: perpAccount.basePosition.gt(ZERO_BN) ? 'long' : 'short',
    basePosition,
    // indexPrice,
    avgEntryPrice,
    breakEvenPrice,
    // notionalSize,
    // unrealizedPnl,
    // unsettledPnl,
  };
};
