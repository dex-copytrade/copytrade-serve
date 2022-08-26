import { Service } from "egg";

export default class TrackingAccount extends Service {
  public async create(data) {
    const { ctx } = this;
    try {
      await ctx.model.TrackingAccount.create(data);
      ctx.logger.info("插入账户", data);
    } catch (error) {}
  }
}
