import { IResponse, ResponseCode, ResponseMsg } from '../types';
export default {
  parseInt(str: string | number): number {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    return parseInt(str) || 0;
  },

  success(res: Partial<IResponse>) {
    const { code = ResponseCode.SUCCESS, msg = ResponseMsg.SUCCESS, data = null } = res;
    return {
      code,
      msg,
      data,
    };
  },

  error(res: Partial<IResponse>) {
    const { code = ResponseCode.ERROR, msg = ResponseMsg.ERROR, data = null } = res;
    return {
      code,
      msg,
      data,
    };
  },
};
