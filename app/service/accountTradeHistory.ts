import { Service } from 'egg';

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
  new Promise((resolve) => setTimeout(resolve, time * 1000));

export default class AccountTradeHistory extends Service {
  public async create(data, account?) {
    const { ctx } = this;
    try {
      return await ctx.model.AccountTradeHistory.create(data);
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
  private async getAccountHistoryAll(account: string, page) {
    const { ctx } = this;
    try {
      const url = `https://trade-history-api-v3.onrender.com/perp_trades/${account}`;
      const data = await ctx.service.utils.get(
        url,
        { page },
        {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63',
        }
      );
      if (data.success === true) {
        // 更新
        ctx.service.trackingAccount.updateAccount({ account }, { grasp: 2 });
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      ctx.logger.error('getAccountHistoryAll===>>请求错误', error);
      return [];
    }
  }
  public async updateAccountTradeHistory(acc?, page = 1) {
    const { ctx } = this;
    const account = acc
      ? acc
      : await ctx.service.trackingAccount.getOneAccount({
          grasp: 1,
        });
    // const account = acc ? acc : await ctx.service.trackingAccount.getOneAccount({
    //   account: "AoQJZaoTePWwgvHG4MTtUZ3N9Eqkxny25vpFmJYzSAvM",
    // });

    if (account) {
      const data: Array<TradeHistory> = await this.getAccountHistoryAll(
        account.account,
        page
      );
      ctx.logger.info(
        'updateAccountTradeHistory===>>插入',
        account.account,
        data.length
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
          ctx.service.lark.sendChatMessage(
            `账号： ${account.account} 成功更新：${data.length} 条数据 Page: ${page}`
          );
          ctx.logger.info(
            'updateAccountTradeHistory成功',
            data.length,
            account.account
          );
          this.create(_data, account.account);
          if (data.length === 5000) {
            await sleep(60);
            await this.updateAccountTradeHistory(
              {
                account: account.account,
                owner: account.owner,
              },
              page + 1
            );
          }
        } catch (error) {
          ctx.service.lark.sendChatMessage(
            `账号： ${account.account} 异常：${String(error)}`
          );
          ctx.logger.error('updateAccountTradeHistory', error);
        }
      } else {
        ctx.logger.info('无数据', account.account);
      }
    }
  }

  public async getTradeHistoryByOwner(owner: string) {
    const { ctx } = this;
    try {
      const list = await ctx.model.AccountTradeHistory.find({
        owner,
      }).limit(5000);
      console.log(`查询到 ${list.length} 条记录`);
      return list;
    } catch (error) {
      ctx.logger.error('getTradeHistoryByOwner error', error);
    }
  }

  public async getTradeHistoryByAccount(account: string) {
    const { ctx } = this;
    try {
      const list = await ctx.model.AccountTradeHistory.find({
        account,
      }).limit(5000);
      console.log(`查询到 ${list.length} 条记录`);
      return list;
    } catch (error) {
      ctx.logger.error('getTradeHistoryByAccount error', error);
    }
  }

  public async getAccountWithOwner(owner: string) {
    const { ctx } = this;
    try {
      const record = await ctx.model.AccountTradeHistory.findOne(
        {
          owner,
        },
        {
          account: 1,
          _id: 0,
        }
      );
      return record;
    } catch (error) {
      ctx.logger.error('getTradeHistoryByAccount error', error);
    }
  }
}
