import { Context } from 'egg';

module.exports = () => {
  return async function responseTime(ctx: Context, next) {
    const start = Date.now();
    await next();
    const cost = Date.now() - start;
    ctx.set('X-Response-Time', `${cost}ms`);
  };
};
