import { Service } from "egg";
import {
  BookSide,
  BookSideLayout,
  Config,
  getMarketByBaseSymbolAndKind,
  GroupConfig,
  MangoClient,
  IDS,
} from "@blockworks-foundation/mango-client";
import { Commitment, Connection } from "@solana/web3.js";

/**
 * Test Service
 */
export default class OrderBook extends Service {
  public async subscribeToOrderBook() {
    const { ctx } = this;
    // setup client
    const config = new Config(IDS);
    const groupConfig = config.getGroupWithName("mainnet.1") as GroupConfig;
    const connection = new Connection(
      config.cluster_urls[groupConfig.cluster],
      "processed" as Commitment
    );
    const client = new MangoClient(connection, groupConfig.mangoProgramId);

    // load group & market
    const perpMarketConfig = getMarketByBaseSymbolAndKind(
      groupConfig,
      "SOL",
      "perp"
    );
    const mangoGroup = await client.getMangoGroup(groupConfig.publicKey);
    const perpMarket = await mangoGroup.loadPerpMarket(
      connection,
      perpMarketConfig.marketIndex,
      perpMarketConfig.baseDecimals,
      perpMarketConfig.quoteDecimals
    );

    // subscribe to bids
    connection.onAccountChange(perpMarketConfig.asksKey, (accountInfo) => {
      const bids = new BookSide(
        perpMarketConfig.asksKey,
        perpMarket,
        BookSideLayout.decode(accountInfo.data)
      );
      const accounts: Array<any> = [];
      // print L3 orderbook data
      for (const order of bids) {
        accounts.push({
          account: order.owner.toBase58(),
        });
        // console.log(
        //   order.owner.toBase58(),
        //   order.orderId.toString("hex"),
        //   order.price,
        //   order.size,
        //   order.side // 'buy' or 'sell'
        // );
      }
      ctx.service.trackingAccount.create(accounts);
    });

    connection.onAccountChange(perpMarketConfig.bidsKey, (accountInfo) => {
      const bids = new BookSide(
        perpMarketConfig.bidsKey,
        perpMarket,
        BookSideLayout.decode(accountInfo.data)
      );

      const accounts: Array<any> = [];
      // print L3 orderbook data
      for (const order of bids) {
        accounts.push({
          account: order.owner.toBase58(),
        });
        // console.log(
        //   order.owner.toBase58(),
        //   order.orderId.toString("hex"),
        //   order.price,
        //   order.size,
        //   order.side // 'buy' or 'sell'
        // );
      }
      ctx.service.trackingAccount.create(accounts);
    });
  }
}
