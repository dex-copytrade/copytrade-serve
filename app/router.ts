import { Application } from "egg";

export default (app: Application) => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt()

  router.get("/", controller.home.index);
  router.get("/api/info", controller.home.info);

  // 获取历史记录
  router.get("/api/position/list",jwt , controller.position.list);
  router.get("/api/tradeHistory/list", jwt, controller.position.history);

  // web3 login ethereum
  router.get("/api/ethereum/nonce", controller.login.ethereumNonce);
  router.post("/api/ethereum/verify", controller.login.ethereumVerify);
  router.get("/api/ethereum/user", controller.login.personInfomation);

  // web3 login solana
  router.get("/api/solana/nonce", controller.login.solanaNonce);
  router.post("/api/solana/verify", controller.login.solanaVerify);
  router.get("/api/solana/user", controller.login.getSolanaPersonInfomation);

  router.get("/api/subList/list", jwt, controller.subList.list);
  router.get("/api/subList/info",jwt, controller.subList.info);
  router.post("/api/subList/addSub",jwt, controller.subList.addSub);
  router.post("/api/subList/cancelSub",jwt, controller.subList.cancelSub);
  router.post("/api/subList/create", jwt,controller.subList.create);

  router.get("/api/test", controller.home.test);
  router.get("/api/tradeTalent/info", controller.copyTradeMarket.test);
  router.get("/api/tradeTalent/detail", controller.copyTradeMarket.queryDetail);
  router.post(
    "/api/tradeTalent/list",
    controller.copyTradeMarket.tradeTalentRanking
  );
};
