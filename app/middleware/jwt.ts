import { Context } from 'egg';

module.exports = () => {
  return async (ctx: Context, next) => {
    if (ctx.request.header.owner) {
      const { owner } = ctx.request.header;
      ctx.state.owner = owner;
      await next();
    } else {
      ctx.body = {
        code: 402,
        data: null,
        message: 'token 必填',
      };
      return;
    }
  };
};
