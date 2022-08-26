import { Service } from "egg";

export default class TrackingAccount extends Service {
  public async create(data) {
    const { ctx } = this;
    try {
      return await ctx.model.TrackingAccount.create(data);
    } catch (error) {}
  }

  public async getAccount(owner = null){
    const { ctx } = this;
    return await ctx.model.TrackingAccount.find({owner})
  }

  public async bulkWriteOwner(writes){
    const { ctx } = this;
    return await ctx.model.TrackingAccount.bulkWrite(writes)
  }

  private async getActivityFeed(account: string) {
    const { ctx } = this;
    const url =
      "https://mango-transaction-log.herokuapp.com/v3/stats/activity-feed";
    const data = await ctx.service.utils.get(url, { "mango-account": account });
    return data;
  }
  public async updateOwner() {
    const { ctx } = this;
    const list = await ctx.service.trackingAccount.getAccount();
    const updateList: Array<any> = [];
    for await (const account of list) {
      const feed = await this.getActivityFeed(account.account);
      const deposit = feed.find(item => item.activity_type === 'Deposit')
      if (
        deposit &&
        deposit.activity_details &&
        deposit.activity_details.owner
      ) {
       
        updateList.push({
          updateMany: {
            filter: { account: account.account },
            update: { owner: deposit.activity_details.owner, ext: feed  },
          },
        });
      }
    }
    return await ctx.service.trackingAccount.bulkWriteOwner(updateList)
  }
}
