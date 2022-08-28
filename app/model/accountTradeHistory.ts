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
      // mango 数据
      loadTimestamp: { type: String },
      address: { type: String },
      seqNum: { type: String},
      makerFee: { type: String },
      takerFee: { type: String },
      takerSide: { type: String },
      maker: { type: String },
      makerOrderId: { type: String, },
      taker: { type: String },
      takerOrderId: { type: String},
      price: { type: String },
      quantity: { type: String },
      makerClientOrderId: { type: String },
      takerClientOrderId: { type: String },
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
    _this.md5 = md5(_this.seqNum + _this.account + _this.address)
    next()
  })

  return mongoose.model("AccountTradeHistory", Schema);
};
