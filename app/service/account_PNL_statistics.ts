import { Service } from "egg";
import dayjs from "dayjs";

export default class AccountPNLStatistics extends Service {
  public async updatePNLStatisticsWithAccount() {
    try {
      const { ctx } = this;
      const { date = "" } = ctx.query;
      const currentDate = !date ? dayjs().format() : date;
      const firstTime = new Date(
        dayjs(currentDate).format("YYYY-MM-DD")
      ).toISOString();
      const endTime = new Date(
        dayjs(currentDate).add(1, "day").format("YYYY-MM-DD")
      ).toISOString();
      const data = await ctx.model.SettlePerp.aggregate([
        {
          $match: {
            blockTimestamp: {
              $gte: new Date(firstTime),
              $lte: new Date(endTime),
            },
          },
        },
        {
          $project: {
            _id: 0,
            account: 1,
            profitOrders: { $cond: [{ $gt: ["$settlement", 0] }, 1, 0] },
            lossOrders: { $cond: [{ $lt: ["$settlement", 0] }, 1, 0] },
            profitSettlement: {
              $cond: [{ $gt: ["$settlement", 0] }, "$settlement", 0],
            },
            lossSettlement: {
              $cond: [{ $lt: ["$settlement", 0] }, "$settlement", 0],
            },
          },
        },
        {
          $group: {
            _id: "$account",
            profitOrder: { $sum: "$profitOrders" },
            lossOrder: { $sum: "$lossOrders" },
            profit: { $sum: "$profitSettlement" },
            loss: { $sum: "$lossSettlement" },
            totalOrder: { $count: {} },
          },
        },
      ]);
      const updateList = data.map((item) => {
        const { _id, ...rest } = item;
        const currentDate = new Date(firstTime).toISOString();
        return {
          updateOne: {
            filter: { account: _id, date: currentDate },
            update: {
              account: _id,
              date: currentDate,
              ...rest,
            },
            upsert: true,
          },
        };
      });
      await ctx.model.AccountPNLStatistics.bulkWrite(updateList);

      ctx.logger.info(
        `updatePNLStatisticsWithAccount:info:账户数量:${data.length}`
      );

      return data;
    } catch (error) {
      this.ctx.logger.error(`updatePNLStatisticsWithAccount：error:${error}`);
      return null;
    }
  }
}
