import { Subscription } from "egg";

export default class UpdateAccountPNLStatistics extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: "1m",
      type: "worker",
    };
  }

  async subscribe() {
    const { ctx } = this;
    if (ctx.app.env !== "local") {
      ctx.logger.info("开始执行updatePNLStatisticsWithAccount");
      await ctx.service.accountPNLStatistics.updatePNLStatisticsWithAccount();
    }
  }
}
