import { Context } from 'egg';

// 这里是你自定义的中间件
export default function fooMiddleware(option, app): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
        await next();
      } catch (err: any) {
        console.error(err, 'error');
        // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
        const status = err.status || 500;
        // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
        const error = status === 500 && app.config.env === 'prod' ?
          'Internal Server Error' :
  
          err.message;
        // 从 error 对象上读出各个属性，设置到响应中
        ctx.body = {
          code: err.code || status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
          message: error,
          data: null,
        };
        if (status === 422) {
          ctx.body.code = 422;
          delete ctx.body.message;
        }
        ctx.status = 200;
      }
  };
}