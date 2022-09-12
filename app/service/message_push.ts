/* eslint-disable generator-star-spacing */
import { Service } from "egg";
import WebSocket from "ws";
import {
  Config,
  GroupConfig,
  IDS as configFile,
} from "@blockworks-foundation/mango-client";

import { L3DataMessage, SubRequest, SuccessResponse } from "mango-bowl";

const wait = async (delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

class SimpleWebsocketClient {
  private readonly _socket: WebSocket;

  constructor(url: string) {
    this._socket = new WebSocket(url);
  }

  public async send(payload: any) {
    while (this._socket.readyState !== WebSocket.OPEN) {
      await wait(100);
    }
    this._socket.send(JSON.stringify(payload));
  }

  public async *stream() {
    const realtimeMessagesStream = (WebSocket as any).createWebSocketStream(
      this._socket,
      {
        readableObjectMode: true,
      }
    ) as AsyncIterableIterator<Buffer>;

    for await (const messageBuffer of realtimeMessagesStream) {
      const message = JSON.parse(messageBuffer as any);
      yield message as L3DataMessage | SuccessResponse;
    }
  }
}

let subMap = new Map<string, string>();

export default class MessagePushService extends Service {
  public async updateAccount() {
    const { ctx } = this;
    const all = await ctx.service.subList.getAll();
    const map = new Map<string, string>();
    for await (const iterator of all) {
      if (iterator.subAccount) {
        for (const account of iterator.subAccount) {
          map.set(account, iterator.email);
        }
      }
    }
    subMap = map;
    console.log(subMap)
  }

  public async watchAccountAction() {
    const { ctx } = this;
    try {
      const WS_ENDPOINT = "wss://api.mango-bowl.com/v1/ws";
      const wsClient = new SimpleWebsocketClient(WS_ENDPOINT);
      const markets = await this.fetchMarkets();

      const subscribeRequest: SubRequest = {
        op: "subscribe",
        channel: "level3",
        markets,
      };

      await wsClient.send(subscribeRequest);
      const accounts: Array<any> = [];

      for await (const message of wsClient.stream()) {
        if (
          (message.type === "open" || message.type === "done") &&
          subMap.get(message.account)
        ) {
          // {
          //   type: 'done',
          //   market: 'SOL-PERP',
          //   timestamp: '2022-09-12T08:45:42.176Z',
          //   slot: 150308231,
          //   version: 1,
          //   orderId: '66094684016100523155041',
          //   clientId: '1662972336420',
          //   side: 'buy',
          //   reason: 'canceled',
          //   account: '42o91rqtV5P54gTpeDWmCvHm7DpRWmhW7UVZujvjVPvD',
          //   accountSlot: 1,
          //   sizeRemaining: '480.00'
          // }
          // console.log(message)
          if (message.type === "open") {
            // {
            //   type: 'open',
            //   market: 'SOL-PERP',
            //   timestamp: '2022-09-12T08:45:42.176Z',
            //   slot: 150308231,
            //   version: 1,
            //   orderId: '65725749134626332122638',
            //   clientId: '1662972337340',
            //   side: 'buy',
            //   price: '35.62',
            //   size: '480.00',
            //   account: '42o91rqtV5P54gTpeDWmCvHm7DpRWmhW7UVZujvjVPvD',
            //   accountSlot: 1,
            //   eventTimestamp: '2022-09-12T08:45:41.000Z',
            //   expiryTimestamp: '2022-09-12T08:45:49.000Z'
            // }
            ctx.service.gmail.sendMail('交易达人操作', `【${message.account}】与${message.timestamp}，以单价【${message.price}】 ${message.side}【${message.market}】永续合约，挂单【${message.size}】个`)
            this.ctx.logger.info(`下单: ${message.account}`);
            ctx.service.lark.sendChatMessage(`【${message.account}】与${message.timestamp}，以单价【${message.price}】 ${message.side}【${message.market}】永续合约，挂单【${message.size}】个`);
          }
          if (message.type === "done") {
            if (message.reason === "canceled") {
              // this.ctx.logger.info(`取消下单: ${message.account}`);
            } else if (message.reason === "filled") {
              // this.ctx.logger.info(`成交: ${message.account}`);
            }
          }
        } else if (message.type === "open" || message.type === "done") {
          accounts.push({
            account: message.account,
          });
        }
        // if (message.type === "open") {
        //   this.ctx.logger.info(`下单: ${message.account}`);
        // }
        // if (message.type === "done") {
        //   if (message.reason === "canceled") {
        //     this.ctx.logger.info(`取消下单: ${message.account}`);
        //   } else if (message.reason === "filled") {
        //     this.ctx.logger.info(`成交: ${message.account}`);
        //   }
        // }
      }
      this.ctx.service.trackingAccount.create(accounts);
    } catch (error) {
      this.ctx.logger.error(`MessagePushService:${error}`);
    }
  }
  public async fetchMarkets() {
    const config = new Config(configFile);
    const groupConfig = config.getGroupWithName("mainnet.1") as GroupConfig;
    const markets = groupConfig.perpMarkets.map((item) => {
      return item.name;
    });
    return markets;
  }
}
