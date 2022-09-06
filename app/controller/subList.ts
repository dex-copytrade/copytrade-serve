import { Controller } from 'egg';

export default class SubListController extends Controller {
  public async list() {
    const { ctx } = this;
    const data = await ctx.service.subList.list();
    ctx.body = ctx.helper.success({data})
    // ctx.success(data);
  }

  public async info() {
    const { ctx } = this;
    const data = await ctx.service.subList.info();
    ctx.body = ctx.helper.success({data})
    // ctx.success(data);
  }

  public async cancelSub() {
    const { ctx } = this;
    const { account } = ctx.request.body;
    const data = await ctx.service.subList.cancelSub(account);
    ctx.body = ctx.helper.success({data})
  }

  public async create() {
    const { ctx } = this;
    const body = ctx.request.body;
    const data = await ctx.service.subList.create(body);
    ctx.body = ctx.helper.success({data})
    // ctx.success(data);
  }

  public async addSub() {
    const { ctx } = this;
    const { account } = ctx.request.body;
    const data = await ctx.service.subList.addSub(account);
    ctx.body = ctx.helper.success({data})
    // ctx.success(data);
  }
}
