import { Service } from "egg";


interface SettlePerpData {
    activity_type: string;
    block_datetime: string;
    activity_details: {
        mango_account: string;
        signature: string;
        symbol: string;
        settlement: number;
        counterparty: string;
        block_datetime: string;
    };
}

export default class SettlePerp extends Service {
  public async create(data, account?) {
    const { ctx } = this;
    try {
      return await ctx.model.SettlePerp.create(data);
    } catch (error) {
      ctx.service.lark.sendChatMessage(
        `账号： ${account} 异常：${String(error)}`
      );
    }
  }
  public async update(filter = {}, data) {
    const { ctx } = this;
    return await ctx.model.AccountTradeHistory.updateMany(filter, data);
  }
  private async getAccountHistoryAll(account: string) {
    const { ctx } = this;
    try {
      const url = `https://mango-transaction-log.herokuapp.com/v3/stats/settle_perp`;
      const data = await ctx.service.utils.get(
        url,
        { 'mango-account': account},
        {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63",
        }
      );
      if (Array.isArray(data)) {
        ctx.service.trackingAccount.updateAccount(
            { account },
            { grasp: 3 }
          );
        return data;
      } else {
        return [];
      }
    } catch (error) {
      ctx.logger.error("getAccountHistoryAll===>>请求错误", error);
      return [];
    }
  }
  public async updateSettlePerp() {
    const { ctx } = this;
    const account = await ctx.service.trackingAccount.getOneAccount({
        grasp: 2,
      });

    if (account) {
      const data: Array<SettlePerpData> = await this.getAccountHistoryAll(
        account.account,
      );
      ctx.logger.info(
        "updateAccountTradeHistory===>>插入",
        account.account,
        data.length
      );
      if (data.length > 0) {
        try {
          const _data = data.map((item) => {
            return {
              ...item,
              activityType: item.activity_type, // 钱包地址
              blockDatetime: item.block_datetime,
              signature: item.activity_details.signature,
              symbol: item.activity_details.symbol,
              settlement: item.activity_details.settlement,
              counterparty: item.activity_details.counterparty,
              account: account.account,
              owner: account.owner,
            };
          });
          ctx.service.lark.sendChatMessage(
            `账号： ${account.account} 成功更新：${data.length} 条数据 `
          );
          ctx.logger.info(
            "updateAccountTradeHistory成功",
            data.length,
            account.account
          );
          this.create(_data, account.account);
        } catch (error) {
          ctx.service.lark.sendChatMessage(
            `账号： ${account.account} 异常：${String(error)}`
          );
          ctx.logger.error("updateAccountTradeHistory", error);
        }
      } else {
        ctx.logger.info("无数据", account.account);
      }
    }
  }
}
