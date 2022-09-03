export enum ResponseCode {
  /** 操作错误 */
  ERROR = -1,
  /** 操作成功 */
  SUCCESS = 200,
  /** 登录态失效 */
  LOGIN_STATE_FAILURE = 401,
  /** 字段验证错误 */
  FIELD_VALIDATE_ERROR = 422,
  /** 服务器错误 */
  INTERNAL_SERVER_ERROR = 500,
}

export enum ResponseMsg {
  /** 操作错误 */
  ERROR = 'error',
  /** 操作成功 */
  SUCCESS = 'success',
  /** 服务器错误 */
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export interface IResponse {
  /** 返回代码 */
  code: ResponseCode;
  /** 返回数据 */
  data: any;
  /** 返回信息 */
  msg: string;
}

export enum EnvMap {
  /** 开发环境 */
  local = 'dev',
  /** 单元测试对应开发环境 */
  unittest = 'dev',
  /** 测试环境 */
  qa = 'dev',
  /** 生产环境 */
  prod = 'prod',
}

export interface QueryPaginationParams {
  pageSize: number;
  current: number;
}

export interface Pagination extends QueryPaginationParams {
  total: number;
}
