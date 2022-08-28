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

const sleep = (time) =>
new Promise((resolve) => setTimeout(resolve, time * 1000))

export default class AccountTradeHistory extends Service {
  public async create(data) {
    const { ctx } = this;
    return await ctx.model.AccountTradeHistory.create(data);
  }
  public async update(filter = {}, data) {
    const { ctx } = this;
    return await ctx.model.AccountTradeHistory.updateMany(filter, data);
  }
  private async getAccountHistoryAll(account: string, page) {
    const { ctx } = this;
    const url = `https://trade-history-api-v3.onrender.com/perp_trades/${account}`;
    const data = await ctx.service.utils.get(
      url,
      {page},
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
  public async updateAccountTradeHistory(acc?, page: number = 1) {
    const { ctx } = this;
    // const account = acc ? acc : await ctx.service.trackingAccount.getOneAccount({
    //   grasp: 1,
    // });
    const account = acc ? acc : await ctx.service.trackingAccount.getOneAccount({
      account: "AoQJZaoTePWwgvHG4MTtUZ3N9Eqkxny25vpFmJYzSAvM",
    });

    if (account) {
      ctx.logger.info("updateAccountTradeHistory插入", account.account);
      const data: Array<TradeHistory> = await this.getAccountHistoryAll(
        account.account,page
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
          ctx.service.lark.sendChatMessage(`账号： ${account.account} 成功更新：${data.length} 条数据 Page: ${page}`)
          ctx.logger.info(
            "updateAccountTradeHistory成功",
            data.length,
            account.account
          );
          await this.create(_data);
          if(data.length === 5000){
            await sleep(30)
            await this.updateAccountTradeHistory({
              account: account.account,
              owner: account.owner
            }, page + 1)

          }
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
