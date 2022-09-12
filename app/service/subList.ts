import { Service } from "egg";

/**
 * Test Service
 */
export default class SubList extends Service {
  public async create({ phoneNumber, email, account }) {
    const { ctx } = this;
    const owner = ctx.state.owner;
    const params = {
      phoneNumber,
      email,
      subAccount: [account],
      owner,
    };
    console.log(params, 'paramsparams')
    return await ctx.model.SubList.create(params);
  }

  public async info() {
    const { ctx } = this;
    const owner = ctx.state.owner;
    return await ctx.model.SubList.findOne({ owner });
  }

  public async cancelSub(account) {
    const { ctx } = this;
    const owner = ctx.state.owner;
    return await ctx.model.SubList.updateOne(
      { owner },
      { $pull: { subAccount: { $in: [account] } } }
    );
  }

  public async addSub(account) {
    const { ctx } = this;
    const owner = ctx.state.owner;
    return await ctx.model.SubList.updateOne(
      { owner },
      { $addToSet: { subAccount: [account] } }
    );
  }

  public async getOwnerSubCount(owner) {
    const { ctx } = this;
    return await ctx.model.SubList.aggregate([
      {
        $match: { owner },
      },

      {
        $project: {
          owner: 1,
          subAccount: 1,
          subAccountCount: { $size: "$subAccount" },
        },
      },
    ]);
  }

  public async getCopyCount(account) {
    const { ctx } = this;
    return await ctx.model.SubList.find({
      subAccount: { $in: [account] },
    }).count();
  }
  public async list() {
    const { ctx } = this;
    const owner = ctx.state.owner;
    const data = await ctx.model.SubList.findOne({owner});
    let list:Array<any> = [];
    if(data.subAccount){
      for await (const iterator of data.subAccount) {
        const _list = await ctx.service.tradeTalent.queryAggregateInfoByAccount(iterator)
        list.push(_list);
      }
      
    }
  
    return list
  }
}
