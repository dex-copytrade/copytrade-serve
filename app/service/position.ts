import { Service } from 'egg';
import {
  Config,
  GroupConfig,
  MangoClient,
  IDS as configFile,
  PerpMarket,
} from '@blockworks-foundation/mango-client';
import { Commitment, Connection, PublicKey } from '@solana/web3.js';
import { collectPerpPosition, fetchMangoData } from '../utils/position';

export default class Position extends Service {
  public async getPosition(owner: string) {
    const mangoAccountPk = new PublicKey(owner);
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

    const perpPositions = mangoAccount
      ? groupConfig.perpMarkets.map((m) =>
          collectPerpPosition(
            mangoAccount,
            mangoGroup,
            {}, // mangoCache
            m,
            allMarkets[m.publicKey.toBase58()] as PerpMarket,
            [] // tradeHistory
          )
        )
      : [];
    console.log(perpPositions, 'groupConfig');

    return {
      owner,
      perpPositions,
    };
  }
}
