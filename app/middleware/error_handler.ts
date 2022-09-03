import { Context } from 'egg';
import { ResponseCode, ResponseMsg } from '../types';

export default () => {
  return async function (ctx: Context, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);
      const status = (err as any).status || ResponseCode.INTERNAL_SERVER_ERROR;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const msg =
        status === ResponseCode.INTERNAL_SERVER_ERROR &&
        ctx.app.config.env === 'prod'
          ? ResponseMsg.INTERNAL_SERVER_ERROR
          : (err as any).message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = ctx.helper.error({
        msg,
      });
      if (status === ResponseCode.FIELD_VALIDATE_ERROR) {
        // validate
        ctx.body.data = (err as any).errors;
      }
      ctx.status = status;
    }
  };
};
