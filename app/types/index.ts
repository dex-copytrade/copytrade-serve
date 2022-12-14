export enum ResponseCode {
  /** 操作错误 */
  ERROR = -1,
  /** 操作成功 */
  SUCCESS = 0,
  /** 字段验证错误 */
  FIELD_VALIDATE_ERROR = 422,
  /** 服务器错误 */
  INTERNAL_SERVER_ERROR = 500,
}

export enum ResponseMsg {
  /** 操作错误 */
  ERROR = "error",
  /** 操作成功 */
  SUCCESS = "success",
  /** 服务器错误 */
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

export interface IResponse {
  /** 返回代码 */
  code: ResponseCode | number;
  /** 返回数据 */
  data: any;
  /** 返回信息 */
  msg: string;
}
