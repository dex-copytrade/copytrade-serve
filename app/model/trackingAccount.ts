export default app => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema(
        {
          account: { type: String, unique: true, required: true }, // 保证金账号
          walletPk: { type: String, required: true }, // 钱包地址
          source: { type: Number, required: true, default: 1 }, // 来源 1 mango
          grasp: { type: Number, required: true, default: 1 }, // 是否处理 1 未处理 2已处理
          status: { type: Number, default: 1 }, // 0已删除，1是正常
          createTime: {
            type: Date,
            default: Date.now,
          },
          updateTime: {
            type: Date,
            default: Date.now,
          },
        },
        {
          versionKey: false,
          timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        }
      )
  
    return mongoose.model('TrackingAccount', Schema); 

  };
  
  