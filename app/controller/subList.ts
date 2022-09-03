import { Controller } from "egg";

export default class SubListController extends Controller {
  public async list() {
    const { ctx } = this;
    const data = await ctx.service.subList.list()
    ctx.success(data)
  }

  public async info() {
    const { ctx } = this;
    const data = await ctx.service.subList.info()
    ctx.success(data)
  }


  public async cancelSub() {
    const { ctx } = this;
    const { account } = ctx.request.body
    const data = await ctx.service.subList.cancelSub(account)
    ctx.success(data)
  }

  public async create() {
    const { ctx } = this;
    const body = ctx.request.body
    const data = await ctx.service.subList.create(body)
    ctx.success(data)
  }

  public async addSub() {
    const { ctx } = this;
    const { account } = ctx.request.body
    const data = await ctx.service.subList.addSub(account)
    ctx.success(data)
  }

  
}
