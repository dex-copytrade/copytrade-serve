import { Controller } from 'egg';
import { getMoney } from '../utils';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    // await ctx.render("home.ejs");
    ctx.body = await ctx.service.settlePerp.getAllPnl();
  }

  public async info() {
    const { ctx } = this;

    const data = await ctx.service.info.info();
    await ctx.render('info.ejs', { data: { getMoney, ...data } });
  }
  public async test() {
    const { ctx } = this;

    const data =
      await ctx.service.accountPNLStatistics.updatePNLStatisticsWithAccount();
    // await ctx.render("info.ejs", { data: { getMoney, ...data } });
    ctx.body = data;
  }
}
