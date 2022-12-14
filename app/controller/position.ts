import { Controller } from 'egg';

export default class PositionController extends Controller {
  public async list() {
    const { ctx } = this;

    const { owner } = ctx.state;
    if (owner) {
      const { account } =
        await ctx.service.accountTradeHistory.getAccountWithOwner(
          owner as string
        );

      const res = await ctx.service.position.getPosition(
        owner as string,
        account
      );
      ctx.body = ctx.helper.success({
        msg: 'position list',
        data: res,
      });
    } else {
      ctx.body = ctx.helper.error({
        msg: '缺少参数: owner',
      });
    }
  }

  public async history() {
    const { ctx } = this;
    const { owner } = ctx.state;
    const list = await ctx.service.accountTradeHistory.getTradeHistoryByOwner(
      owner as string
    );

    ctx.body = ctx.helper.success({
      data: list,
    });
  }
}
