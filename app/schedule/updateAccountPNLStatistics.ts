import { Subscription } from "egg";

export default class updateSettlePerp extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: "1h",
      type: "worker",
    };
  }

  async subscribe() {
    const { ctx } = this;
    if (ctx.app.env !== "local") {
      await ctx.service.accountPNLStatistics.updatePNLStatisticsWithAccount();
    }
  }
}
