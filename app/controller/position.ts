import { Controller } from 'egg';

export default class PositionController extends Controller {
  public async list() {
    const { ctx } = this;
    const { owner = '' } = ctx.request.header;
    if (owner) {
      const res = await ctx.service.position.getPosition(owner as string);
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
    const { owner } = ctx.request.header;
    ctx.body = ctx.helper.success({
      msg: 'get history list',
      data: owner,
    });
  }
}
