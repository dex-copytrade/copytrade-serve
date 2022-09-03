import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/api/info', controller.home.info);

  // web3 login
  router.get('/api/ethereum/nonce', controller.login.ethereumNonce);
  router.post('/api/ethereum/verify', controller.login.ethereumVerify);
  router.get('/api/ethereum/user', controller.login.personInfomation);

  router.get('/api/solana/nonce', controller.login.solanaNonce);
  router.post('/api/solana/verify', controller.login.solanaVerify);
  router.get('/api/solana/user', controller.login.getSolanaPersonInfomation);
};
