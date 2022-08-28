import { Service } from "egg";

interface TradeHistory {
  loadTimestamp: string;
  address: string;
  seqNum: string;
  makerFee: string;
  takerFee: string;
  takerSide: string;
  maker: string;
  makerOrderId: string;
  taker: string;
  takerOrderId: string;
  price: string;
  quantity: string;
  makerClientOrderId: string;
  takerClientOrderId: string;
}

export default class AccountTradeHistory extends Service {
  public async create(data) {
    const { ctx } = this;
    return await ctx.model.AccountTradeHistory.create(data);
  }
  public async update(filter = {}, data) {
    const { ctx } = this;
    return await ctx.model.AccountTradeHistory.updateMany(filter, data);
  }
  private async getAccountHistoryAll(account: string) {
    const { ctx } = this;
    const url = `https://trade-history-api-v3.onrender.com/perp_trades/${account}`;
    const data = await ctx.service.utils.get(
      url,
      {},
      {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63",
      }
    );
    if (data.success === true) {
      return data.data;
    } else {
      return [];
    }
  }
  public async updateAccountTradeHistory() {
    const { ctx } = this;
    const account = await ctx.service.trackingAccount.getOneAccount({
      grasp: 1,
    });
    // const account = await ctx.service.trackingAccount.getOneAccount({
    //   account: "9Z7ts8g29L5XnamRrLsSaNT3A1ZiCS8E2npyKWw3jrw6",
    // });

    if (account) {
      ctx.logger.info("updateAccountTradeHistory插入", account.account);
      const data: Array<TradeHistory> = await this.getAccountHistoryAll(
        account.account
      );
      if (data.length > 0) {
        try {
          const _data = data.map((item) => {
            return {
              ...item,
              account: account.account,
              owner: account.owner,
            };
          });
          ctx.service.lark.sendChatMessage(`账号： ${account.account} 成功更新：${data.length} 条数据`)
          ctx.logger.info(
            "updateAccountTradeHistory成功",
            data.length,
            account.account
          );
          await this.create(_data);
        } catch (error) {
          ctx.service.lark.sendChatMessage(`账号： ${account.account} 异常：${String(error)}`)
          ctx.logger.error("updateAccountTradeHistory", error);
        }
        // 更新
        await ctx.service.trackingAccount.updateAccount(
          { account: account.account },
          { grasp: 2 }
        );
      } else {
        ctx.logger.info("无数据", account.account);
      }
    }
  }
}
