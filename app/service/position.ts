import { Service } from 'egg';
import {
  Config,
  GroupConfig,
  MangoClient,
  IDS as configFile,
  PerpMarket,
  MangoCache,
} from '@blockworks-foundation/mango-client';
import { Commitment, Connection, PublicKey } from '@solana/web3.js';
import { collectPerpPosition, fetchMangoData } from '../utils/position';

export default class Position extends Service {
  public async getPosition(owner: string, account: string) {
    const mangoAccountPk = new PublicKey(account);
    // setup client
    const config = new Config(configFile);
    const groupConfig = config.getGroupWithName('mainnet.1') as GroupConfig;

    const connection = new Connection(
      config.cluster_urls[groupConfig.cluster],
      'processed' as Commitment
    );

    const client = new MangoClient(connection, groupConfig.mangoProgramId);
    const mangoGroup = await client.getMangoGroup(groupConfig.publicKey);
    const mangoAccount = await client.getMangoAccount(
      mangoAccountPk,
      mangoGroup.dexProgramId
    );
    const allMarkets = await fetchMangoData({ groupConfig, connection });

    const mangoCache = await mangoGroup.loadCache(connection);

    const tradeHistory =
      await this.ctx.service.accountTradeHistory.getTradeHistoryByOwner(owner);

    const perpPositions = mangoAccount
      ? groupConfig.perpMarkets
          .map((m) =>
            collectPerpPosition(
              mangoAccount,
              mangoGroup,
              mangoCache as MangoCache,
              m,
              allMarkets[m.publicKey.toBase58()] as PerpMarket,
              tradeHistory
            )
          )
          .filter((m) => m.basePosition !== 0)
      : [];

    return {
      perpPositions,
    };
  }
}
