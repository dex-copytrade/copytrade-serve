import { IResponse, ResponseCode, ResponseMsg } from "../types";

export default {
  success(res: Partial<IResponse>) {
    const {
      code = ResponseCode.SUCCESS,
      msg = ResponseMsg.SUCCESS,
      data = null,
    } = res;
    return {
      code,
      msg,
      data,
    };
  },

  error(res: Partial<IResponse>) {
    const {
      code = ResponseCode.ERROR,
      msg = ResponseMsg.ERROR,
      data = null,
    } = res;
    return {
      code,
      msg,
      data,
    };
  },
};
