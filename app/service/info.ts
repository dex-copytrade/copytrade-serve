import { Service } from 'egg';

/**
 * Test Service
 */
export default class Info extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async info() {
    const { ctx } = this;
    const count =  await ctx.model.TrackingAccount.find({}).count()
    const count1 =  await ctx.model.TrackingAccount.find({grasp: 1}).count()
    const count4 =  await ctx.model.TrackingAccount.find({grasp: 2}).count()

    const count2 = await ctx.model.AccountTradeHistory.find({}).count();
    const count3 = await ctx.model.SettlePerp.find({}).count();
    return {
      count,
      count1,
      count2,
      count3,
      count4
    }
  }
}
