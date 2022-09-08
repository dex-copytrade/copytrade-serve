import { Service } from "egg";
import dayjs from "dayjs";
import { ResponseCode, ResponseMsg } from "../types";

export default class TradeTalentService extends Service {
  public async queryList() {
    const { ctx } = this;

    try {
      const {
        interval = 7,
        pageSize = 10,
        current = 1,
        sortKey = "winRate",
      } = ctx.request.body;
      const currentDate = dayjs().format();
      const endTime = new Date(
        dayjs(currentDate).format("YYYY-MM-DD")
      ).toISOString();
      const firstTime = new Date(
        dayjs(currentDate)
          .subtract(interval - 1, "day")
          .format("YYYY-MM-DD")
      ).toISOString();

      const skip = (current - 1) * pageSize;

      const args = [
        {
          $match: {
            date: {
              $gte: new Date(firstTime),
              $lte: new Date(endTime),
            },
          },
        },
        {
          $project: {
            _id: 0,
            account: 1,
            profitOrder: 1,
            lossOrder: 1,
            totalOrder: 1,
            profit: 1,
            loss: 1,
          },
        },
        {
          $group: {
            _id: "$account",
            profitOrderNums: { $sum: "$profitOrder" },
            lossOrderNums: { $sum: "$lossOrder" },
            totalOrderNums: { $sum: "$totalOrder" },
            profitSettlements: { $sum: "$profit" },
            lossSettlements: { $sum: "$loss" },
          },
        },
        {
          $project: {
            _id: 1,
            account: "$_id",
            profitOrderNums: 1,
            lossOrderNums: 1,
            totalOrderNums: 1,
            profitSettlements: 1,
            lossSettlements: 1,
            lossOrder: 1,
            winRate: { $divide: ["$profitOrderNums", "$totalOrderNums"] },
            totalRevenue: { $add: ["$profitSettlements", "$lossSettlements"] },
          },
        },
      ];
      const total = await ctx.model.AccountPNLStatistics.aggregate([
        ...args,
        { $count: "count" },
      ]);

      const data = await ctx.model.AccountPNLStatistics.aggregate([
        ...args,
        { $sort: { [sortKey]: -1 } },
        { $skip: skip },
        { $limit: pageSize },
      ]);

      const list: any[] = [];

      for await (const item of data) {
        const {
          account,
          winRate,
          profitSettlements,
          lossSettlements,
          totalRevenue,
        } = item;
        const copyCount = await ctx.service.subList.getCopyCount(account);
        let drawdownRate = "";
        if (parseInt(profitSettlements) !== 0) {
          drawdownRate = (lossSettlements / profitSettlements) as any;
        }
        list.push({
          id: account,
          account,
          winRate,
          copyCount,
          profitSettlements,
          lossSettlements,
          drawdownRate,
          totalRevenue,
        });
      }

      ctx.logger.info(
        "tradeTalentService:reqParams",
        `interval:${interval}`,
        `pageSize:${pageSize}`,
        `current:${current}`
      );

      const pagination = {
        total: total[0]?.count,
        current,
        pageSize,
      };

      return ctx.helper.success({ data: { list, pagination } });
    } catch (error) {
      ctx.logger.error(`tradeTalentService:queryList:errorcause: ${error}`);
      return ctx.helper.error({
        code: ResponseCode.ERROR,
        msg: ResponseMsg.INTERNAL_SERVER_ERROR,
      });
    }
  }
  public async queryAggregateInfoByAccount(account: string) {
    const { ctx } = this;
    ctx.logger.info(
      "queryAggregateInfoByAccount:reqParams",
      `account:${account}`
    );

    try {
      // const { interval = 7, pageSize = 10, current = 1 } = ctx.request.body;
      // const currentDate = dayjs().format();
      // const endTime = new Date(
      //   dayjs(currentDate).format("YYYY-MM-DD")
      // ).toISOString();
      // const firstTime = new Date(
      //   dayjs(currentDate)
      //     .subtract(interval - 1, "day")
      //     .format("YYYY-MM-DD")
      // ).toISOString();

      // const skip = (current - 1) * pageSize;

      const args = [
        {
          $match: {
            account,
            // date: {
            //   $gte: new Date(firstTime),
            //   $lte: new Date(endTime),
            // },
          },
        },
        {
          $project: {
            _id: 0,
            account: 1,
            profitOrder: 1,
            lossOrder: 1,
            totalOrder: 1,
            profit: 1,
            loss: 1,
          },
        },
        {
          $group: {
            _id: "$account",
            profitOrderNums: { $sum: "$profitOrder" },
            lossOrderNums: { $sum: "$lossOrder" },
            totalOrderNums: { $sum: "$totalOrder" },
            profitSettlements: { $sum: "$profit" },
            lossSettlements: { $sum: "$loss" },
          },
        },
        {
          $project: {
            _id: 1,
            account: "$_id",
            profitOrderNums: 1,
            lossOrderNums: 1,
            totalOrderNums: 1,
            profitSettlements: 1,
            lossSettlements: 1,
            lossOrder: 1,
            winRate: { $divide: ["$profitOrderNums", "$totalOrderNums"] },
            totalRevenue: { $add: ["$profitSettlements", "$lossSettlements"] },
          },
        },
      ];

      const data = await ctx.model.AccountPNLStatistics.aggregate([...args]);

      const list: any[] = [];

      for await (const item of data) {
        const {
          account,
          winRate,
          profitSettlements,
          lossSettlements,
          totalRevenue,
        } = item;
        const copyCount = await ctx.service.subList.getCopyCount(account);
        let drawdownRate = "";
        if (parseInt(profitSettlements) !== 0) {
          drawdownRate = (lossSettlements / profitSettlements) as any;
        }
        list.push({
          id: account,
          account,
          winRate,
          copyCount,
          profitSettlements,
          lossSettlements,
          drawdownRate,
          totalRevenue,
        });
      }

      return list.length > 0 ? list[0] : null;
    } catch (error) {
      ctx.logger.error(
        `TradeTalentService:queryAggregateInfoByAccount:errorcause: ${error}`
      );
      return null;
    }
  }
  public async queryDetail() {
    const { ctx } = this;
    const { account } = ctx.query;
    ctx.logger.info("queryDetail:reqParams", `account:${account}`);

    try {
      // const { interval = 7, pageSize = 10, current = 1 } = ctx.request.body;
      // const currentDate = dayjs().format();
      // const endTime = new Date(
      //   dayjs(currentDate).format("YYYY-MM-DD")
      // ).toISOString();
      // const firstTime = new Date(
      //   dayjs(currentDate)
      //     .subtract(interval - 1, "day")
      //     .format("YYYY-MM-DD")
      // ).toISOString();

      // const skip = (current - 1) * pageSize;

      const args = [
        {
          $match: {
            account,
            // date: {
            //   $gte: new Date(firstTime),
            //   $lte: new Date(endTime),
            // },
          },
        },
        {
          $project: {
            _id: 0,
            account: 1,
            profitOrder: 1,
            lossOrder: 1,
            totalOrder: 1,
            profit: 1,
            loss: 1,
          },
        },
        {
          $group: {
            _id: "$account",
            profitOrderNums: { $sum: "$profitOrder" },
            lossOrderNums: { $sum: "$lossOrder" },
            totalOrderNums: { $sum: "$totalOrder" },
            profitSettlements: { $sum: "$profit" },
            lossSettlements: { $sum: "$loss" },
          },
        },
        {
          $project: {
            _id: 1,
            account: "$_id",
            profitOrderNums: 1,
            lossOrderNums: 1,
            totalOrderNums: 1,
            profitSettlements: 1,
            lossSettlements: 1,
            lossOrder: 1,
            winRate: { $divide: ["$profitOrderNums", "$totalOrderNums"] },
            totalRevenue: { $add: ["$profitSettlements", "$lossSettlements"] },
          },
        },
      ];

      const data = await ctx.model.AccountPNLStatistics.aggregate([...args]);

      const list: any[] = [];

      for await (const item of data) {
        const {
          account,
          winRate,
          totalOrderNums,
          profitOrderNums,
          lossOrderNums,
          profitSettlements,
          lossSettlements,
          totalRevenue,
        } = item;
        const copyCount = await ctx.service.subList.getCopyCount(account);
        let drawdownRate = "";
        if (parseInt(profitSettlements) !== 0) {
          drawdownRate = (lossSettlements / profitSettlements) as any;
        }
        list.push({
          id: account,
          account,
          winRate,
          copyCount,
          profitSettlements,
          lossSettlements,
          drawdownRate,
          totalRevenue,
          totalOrderNums,
          profitOrderNums,
          lossOrderNums,
        });
      }

      const info = list.length > 0 ? list[0] : {};
      Object.assign(info, {
        rankNo: "",
        amount: "",
        positionAmount: "",
      });
      return ctx.helper.success({ data: info });
    } catch (error) {
      ctx.logger.error(`TradeTalentService:queryDetail:errorcause: ${error}`);
      return ctx.helper.error({
        code: ResponseCode.ERROR,
        msg: ResponseMsg.INTERNAL_SERVER_ERROR,
        data: null,
      });
    }
  }
}
