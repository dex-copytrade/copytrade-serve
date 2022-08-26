import { Controller } from 'egg';
import asios from 'axios'
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    // const data = await asios.get('https://trade-history-api-v3.onrender.com/perp_trades/9Z7ts8g29L5XnamRrLsSaNT3A1ZiCS8E2npyKWw3jrw6')
    // ctx.body = data.data
    // ctx.body = await ctx.service.accountTradeHistory.getAccountAll('9Z7ts8g29L5XnamRrLsSaNT3A1ZiCS8E2npyKWw3jrw6')
    // ctx.body = await ctx.service.account.getActivityFeed('9Z7ts8g29L5XnamRrLsSaNT3A1ZiCS8E2npyKWw3jrw6')
  }
}
