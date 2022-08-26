import { Service } from "egg";

export default class AccountTradeHistory extends Service {
  public async getAccountAll(account: string) {
    const { ctx } = this;
    const url =
      `https://trade-history-api-v3.onrender.com/perp_trades/${account}`;
    const data = await ctx.service.utils.get(url, {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63'
    });
    return data;
  }
  public async updateAccountTradeHistory() {
    const { ctx } = this;
    const list = await ctx.service.trackingAccount.getAccount();
    const updateList: Array<any> = [];
    for await (const account of list) {
      const feed = await this.getAccountAll(account.account);
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
    console.log(updateList, 'updateList')
    return await ctx.service.trackingAccount.bulkWriteOwner(updateList)
  }
}
