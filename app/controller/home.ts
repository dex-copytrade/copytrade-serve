import { Controller } from 'egg';
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    // ctx.body = await ctx.service.trackingAccount.updateAccount({grasp: 2},{grasp: 1})
  }
}
