// 跟踪记录
export default (app) => {
  const mongoose = app.mongoose;
  const Schema = new mongoose.Schema(
    {
      account: { type: String, required: true }, // 保证金账号
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
      timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
    }
  );

  return mongoose.model("AccountTradeHistory", Schema);
};
