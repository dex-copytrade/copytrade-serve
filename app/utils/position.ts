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
  MangoCache,
  nativeI80F48ToUi,
} from '@blockworks-foundation/mango-client';
import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import fetch from 'node-fetch';

interface FetchMangoData {
  client?: MangoClient;
  groupConfig: GroupConfig;
  connection: Connection;
}

export const programId = new PublicKey('mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68');

export function zipDict<K extends string | number | symbol, V>(keys: K[], values: V[]) {
  const result: Partial<Record<K, V>> = {};
  keys.forEach((key, index) => {
    result[key] = values[index];
  });
  return result;
}

export async function fetchMangoData({ groupConfig, connection }: FetchMangoData) {
  const allMarketConfigs = getAllMarkets(groupConfig);
  const allMarketPks = allMarketConfigs.map((m) => m.publicKey);

  const allMarketAccountInfos = await getMultipleAccounts(connection, allMarketPks);

  const allMarketAccounts = allMarketConfigs.map((config, i) => {
    if (config.kind === 'spot') {
      const decoded = Market.getLayout(programId).decode(allMarketAccountInfos[i].accountInfo.data);
      return new Market(decoded, config.baseDecimals, config.quoteDecimals, undefined, groupConfig.serumProgramId);
    }
    if (config.kind === 'perp') {
      const decoded = PerpMarketLayout.decode(allMarketAccountInfos[i].accountInfo.data);
      return new PerpMarket(config.publicKey, config.baseDecimals, config.quoteDecimals, decoded);
    }
    return null;
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
  mangoCache: MangoCache,
  marketConfig: PerpMarketConfig,
  perpMarket: PerpMarket,
  tradeHistory: any
): any | undefined => {
  if (!mangoAccount || !mangoGroup || !mangoCache || !perpMarket || !tradeHistory) {
    return;
  }

  const perpMarketInfo = mangoGroup.perpMarkets[marketConfig.marketIndex];
  const perpAccount = mangoAccount.perpAccounts[marketConfig.marketIndex];

  let avgEntryPrice = 0;
  const perpTradeHistory = tradeHistory.filter((t) => t.marketName === marketConfig.name);
  console.log('marketConfig = ', marketConfig);
  console.log('perpTradeHistory = ', perpTradeHistory);

  try {
    avgEntryPrice = perpAccount.getAverageOpenPrice(mangoAccount, perpMarket, perpTradeHistory).toNumber();
  } catch (e) {
    console.error(marketConfig.name, e);
  }

  let breakEvenPrice = 0;
  try {
    breakEvenPrice = perpAccount.getBreakEvenPrice(mangoAccount, perpMarket, perpTradeHistory).toNumber();
  } catch (e) {
    console.error(marketConfig.name, e);
  }

  const basePosition = perpMarket?.baseLotsToNumber(perpAccount.basePosition);
  const indexPrice = mangoGroup.getPrice(marketConfig.marketIndex, mangoCache).toNumber();
  const notionalSize = Math.abs(basePosition * indexPrice);
  const unrealizedPnl = basePosition * (indexPrice - breakEvenPrice);
  const unsettledPnl = +nativeI80F48ToUi(
    perpAccount.getPnl(
      perpMarketInfo,
      mangoCache.perpMarketCache[marketConfig.marketIndex],
      mangoCache.priceCache[marketConfig.marketIndex].price
    ),
    marketConfig.quoteDecimals
  ).toNumber();

  return {
    perpMarketInfo,
    perpMarket,
    marketConfig,
    perpAccount,
    base: marketConfig.baseSymbol,
    side: perpAccount.basePosition.gt(ZERO_BN) ? 'long' : 'short',
    basePosition,
    indexPrice,
    avgEntryPrice,
    breakEvenPrice,
    notionalSize,
    unrealizedPnl,
    unsettledPnl,
  };
};

export async function fetchTradeHistory(account: string) {
  if (!account) return;
  let tradeHistory = [];

  fetch(`https://trade-history-api-v3.onrender.com/perp_trades/${account}`)
    .then((response) => response.json())
    .then((jsonPerpHistory: any) => {
      const perpHistory = jsonPerpHistory?.data || [];

      tradeHistory = perpHistory;
      // if (perpHistory.length === 5000) {
      //   fetch(
      //     `https://trade-history-api-v3.onrender.com/perp_trades/${account}?page=2`
      //   )
      //     .then((response) => response.json())
      //     .then((jsonPerpHistory) => {
      //       const perpHistory2 = jsonPerpHistory?.data || []
      //       tradeHistory.perp = perpHistory.concat(perpHistory2)
      //     })
      //     .catch((e) => {
      //       console.error('Error fetching trade history', e)
      //     })
      // }
    })
    .catch((e) => {
      console.error('Error fetching trade history', e);
    });

  return tradeHistory;
}
