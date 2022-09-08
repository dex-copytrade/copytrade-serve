import { Controller } from "egg";

const rankingRule = {
  interval: { type: "int", require: false, allowEmpty: false },
  current: { type: "int", require: false, allowEmpty: false },
  pageSize: { type: "int", require: false, allowEmpty: false },
};
export default class CopyTradeMarketController extends Controller {
  public async tradeTalentRanking() {
    const { ctx } = this;
    ctx.validate(rankingRule, ctx.request.body);
    const data = await ctx.service.tradeTalent.queryList();
    ctx.body = data;
  }
  public async test() {
    const { ctx } = this;
    const { account } = ctx.query;
    const data = await ctx.service.tradeTalent.queryAggregateInfoByAccount(
      account
    );
    ctx.body = data;
  }
  public async queryDetail() {
    const { ctx } = this;
    const data = await ctx.service.tradeTalent.queryDetail();
    ctx.body = data;
  }
}
