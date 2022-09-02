import { Service } from 'egg';
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'TRACE'
  | 'CONNECT';

export default class Utils extends Service {
  public async get(url, params?, headers = {}) {
    return await this.request(url, params, 'GET', headers);
  }

  public async post(url, params = {}, headers = {}) {
    return await this.request(url, params, 'POST', headers);
  }

  private async request(
    path,
    params = {},
    method: HttpMethod = 'POST',
    headers = {}
  ) {
    const { ctx } = this;
    try {
      const data = await ctx.curl(path, {
        method,
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          ...headers,
        },
        contentType: 'json',
        timeout: 300000,
        dataType: 'json',
        data: params,
      });
      if (data.status === 200) {
        return data.data;
      } else {
        ctx.throw(data.status);
      }
      return data;
    } catch (error: any) {
      ctx.throw(error);
    }
  }
}
