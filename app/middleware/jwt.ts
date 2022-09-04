import { Context } from 'egg';

module.exports = () => {
  return async (ctx: Context, next) => {
    console.log('in jwt middleware...');

    if (ctx.request.header.token) {
      const address = ctx.request.header.token;
      ctx.state.address = address;
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
