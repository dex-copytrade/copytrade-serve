export default (app) => {
  const mongoose = app.mongoose;
  const Schema = new mongoose.Schema(
    {
      account: { type: String, required: true }, // 保证金账号
      totalOrder: { type: Number },
      profitOrder: { type: Number },
      lossOrder: { type: Number },
      profit: { type: Number },
      loss: { type: Number },
      date: { type: Date },
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

  return mongoose.model("AccountPNLStatistics", Schema);
};
