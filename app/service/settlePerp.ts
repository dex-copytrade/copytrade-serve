import { Service } from "egg";
import dayjs from "dayjs";

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
  public async getAllPnl() {
    const { ctx } = this;
    const data = await ctx.model.SettlePerp.find({ blockTimestamp: null });
    const updateList: any = [];
    for await (const i of data) {
      updateList.push({
        updateMany: {
          filter: { _id: i._id },
          update: { blockTimestamp: dayjs(i.blockDatetime).valueOf() },
        },
      });
    }

    // }
    // }
    await ctx.model.SettlePerp.bulkWrite(updateList)
    // return await ctx.service.trackingAccount.bulkWriteOwner(updateList)
    // ctx.model.SettlePerp.u
    // const ids = data.map(i => i._id)
    // await ctx.model.SettlePerp.updateMany({_id: ids}, { blockDatetime: })
    // { $gte: dayjs(date).startOf('date').toDate(), $lte: dayjs(date).endOf('date').toDate() };
    // {
    //   $project: {
    //     USDT: 1, time: { $dateToString: { format: '%Y-%m-%d', timezone: '+08:00', date: '$createTime' } },
    //   },
    // },
    // { $group: { _id: '$time', count: { $sum: 1 }, qty: { $sum: '$USDT' } } },
    // { $sort: { _id: -1 } },
    // { $project: { count: 1, qty: 1, date: { $toUpper: '$_id' }, _id: 0 } },
    // const data = await ctx.model.SettlePerp.aggregate([
    //   {
    //     $addFields: {
    //       blockTimestamp: {
    //         $toLong: {
    //           $dateFromString: {
    //             dateString: "$blockDatetime",
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // {
    //   //   $project: {
    //   //       "status":1,
    //   //       "blockDatetime": 1,
    //   //       "blockTimestamp": {
    //   //         "$toLong": {
    //   //           "$dateFromString": {
    //   //             "dateString": "$blockDatetime"
    //   //           }
    //   //         }
    //   //       }
    //   //   }
    //   // },
    //   {
    //     $match: {
    //       status: 1,
    //       // gte 小于 lte 大于
    //       blockTimestamp: { $lte: dayjs("2022-08-29").valueOf() },
    //     },
    //   },
    //   { $limit: 50 },
    //   // { $group: { _id: "$account", sum: { $sum: "$settlement" } } },
    // ]);
    // const data = await ctx.model.SettlePerp.findOne({
    //   createTime: { $gte: dayjs('2022-08-28').startOf('date').toDate() }
    // })
    // console.log(dayjs("2022-08-29").valueOf());
    // return data || "无";
    return data.length;
  }
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
        { "mango-account": account },
        {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63",
        }
      );
      ctx.service.trackingAccount.updateAccount({ account }, { grasp: 3 });
      if (Array.isArray(data)) {
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
        account.account
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
              blockTimestamp: dayjs(item.block_datetime).valueOf(),
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
