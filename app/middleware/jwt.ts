import { Context } from 'egg';

module.exports = () => {
  return async (ctx: Context, next) => {
    if (ctx.request.header.owner) {
      const { owner } = ctx.request.header;
      ctx.state.owner = owner;
      await next();
    } else {
      ctx.body = {
        code: 401,
        data: null,
        message: 'owner 必填',
      };
      return;
    }
  };
};
