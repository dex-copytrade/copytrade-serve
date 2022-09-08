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

export default class MessagePushService extends Service {
  public async watchAccountAction() {
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

      for await (const message of wsClient.stream()) {
        if (message.type === "open") {
          this.ctx.logger.info(`下单: ${message.account}`);
        }
        if (message.type === "done") {
          if (message.reason === "canceled") {
            this.ctx.logger.info(`取消下单: ${message.account}`);
          } else if (message.reason === "filled") {
            this.ctx.logger.info(`成交: ${message.account}`);
          }
        }
      }
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
