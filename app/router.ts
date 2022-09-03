import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/api/info', controller.home.info);
  router.get('/api/subList/list', controller.subList.list);
  router.get('/api/subList/info', controller.subList.info);
  router.post('/api/subList/addSub', controller.subList.addSub);
  router.post('/api/subList/cancelSub', controller.subList.cancelSub);
  router.post('/api/subList/create', controller.subList.create);
};
