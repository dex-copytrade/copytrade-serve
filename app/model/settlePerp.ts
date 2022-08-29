import md5 from 'md5'
// 跟踪记录
export default (app) => {
  const mongoose = app.mongoose;
  const Schema = new mongoose.Schema(
    {
      account: { type: String, required: true }, // 保证金账号
      owner: { type: String }, // 钱包地址
      md5: { type: String, unique: true },
      status: { type: Number, default: 1 }, // 0已删除，1是正常
      activityType: { type: String }, // 钱包地址
      blockDatetime: { type: String },
      signature: { type: String },
      symbol: { type: String},
      settlement: { type: Number },
      counterparty: { type: String },
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
      timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
    }
  );
  Schema.pre('save', function (next) {
    // @ts-ignore
    const _this = this;
    _this.md5 = md5(_this.activityType + _this.blockDatetime + _this.symbol)
    next()
  })

  return mongoose.model("SettlePerp", Schema);
};
