// 我的订阅
export default (app) => {
    const mongoose = app.mongoose;
    const Schema = new mongoose.Schema(
      {
        owner: { type: String, unique: true, required: true }, // 钱包地址
        subAccount: { type: Array }, // 订阅地址
        email: { type: String }, // 邮箱
        phoneNumber: { type: String }, //手机号
        status: { type: Number, default: 1 }, // 0已删除，1是正常
        expTime: { // 到期日
            type: Date,
            default: Date.now,
          },
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
  
    return mongoose.model("SubList", Schema);
  };
  