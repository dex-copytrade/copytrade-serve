import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/api/info', controller.home.info);

  // 获取历史记录
  router.get('/api/position/list', controller.position.list);
  router.get('/api/tradeHistory/list', controller.position.history);

  // web3 login ethereum
  router.get('/api/ethereum/nonce', controller.login.ethereumNonce);
  router.post('/api/ethereum/verify', controller.login.ethereumVerify);
  router.get('/api/ethereum/user', controller.login.personInfomation);

  // web3 login solana
  router.get('/api/solana/nonce', controller.login.solanaNonce);
  router.post('/api/solana/verify', controller.login.solanaVerify);
  router.get('/api/solana/user', controller.login.getSolanaPersonInfomation);

  router.get('/api/subList/list', controller.subList.list);
  router.get('/api/subList/info', controller.subList.info);
  router.post('/api/subList/addSub', controller.subList.addSub);
  router.post('/api/subList/cancelSub', controller.subList.cancelSub);
  router.post('/api/subList/create', controller.subList.create);
};
